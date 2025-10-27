-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  roles TEXT[] NOT NULL DEFAULT ARRAY['client'],
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  entreprise TEXT NOT NULL,
  commercial_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create commandes table
CREATE TABLE IF NOT EXISTS commandes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  commercial_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  produit TEXT NOT NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'termine', 'livre')),
  date_livraison DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock table
CREATE TABLE IF NOT EXISTS stock (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  quantite INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  unite TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_roles ON profiles USING GIN(roles);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_clients_commercial ON clients(commercial_id);
CREATE INDEX IF NOT EXISTS idx_commandes_client ON commandes(client_id);
CREATE INDEX IF NOT EXISTS idx_commandes_commercial ON commandes(commercial_id);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_reference ON commandes(reference);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- Allow initial profile creation (for seeding and manual creation)
CREATE POLICY "Allow profile creation when no admin exists" ON profiles
  FOR INSERT WITH CHECK (
    -- Allow if user is admin OR no admin exists yet
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))) OR
    (NOT EXISTS (SELECT 1 FROM profiles WHERE 'admin' = ANY(roles)))
  );

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for clients table
CREATE POLICY "Commercials can view their clients" ON clients
  FOR SELECT USING (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

CREATE POLICY "Commercials can insert clients" ON clients
  FOR INSERT WITH CHECK (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND ('admin' = ANY(roles) OR 'commercial' = ANY(roles)))
  );

CREATE POLICY "Commercials can update their clients" ON clients
  FOR UPDATE USING (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Policies for commandes table
CREATE POLICY "Users can view relevant commandes" ON commandes
  FOR SELECT USING (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)) OR
    EXISTS (
      SELECT 1 FROM clients 
      JOIN profiles ON profiles.id = clients.commercial_id
      WHERE clients.id = commandes.client_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Commercials and admins can insert commandes" ON commandes
  FOR INSERT WITH CHECK (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND ('admin' = ANY(roles) OR 'commercial' = ANY(roles)))
  );

CREATE POLICY "Commercials and admins can update commandes" ON commandes
  FOR UPDATE USING (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Policies for stock table
CREATE POLICY "Everyone can view stock" ON stock
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage stock" ON stock
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, roles, nom, prenom, email)
  VALUES (
    NEW.id,
    ARRAY['client'],
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for stock table
DROP TRIGGER IF EXISTS update_stock_updated_at ON stock;
CREATE TRIGGER update_stock_updated_at
  BEFORE UPDATE ON stock
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
