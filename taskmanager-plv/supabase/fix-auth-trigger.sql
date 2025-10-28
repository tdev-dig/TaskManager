-- Script pour corriger le trigger de création de profil
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Créer une fonction améliorée pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_nom TEXT;
  user_prenom TEXT;
BEGIN
  -- Récupérer les métadonnées ou utiliser des valeurs par défaut
  user_nom := COALESCE(NEW.raw_user_meta_data->>'nom', 'Non renseigné');
  user_prenom := COALESCE(NEW.raw_user_meta_data->>'prenom', 'Non renseigné');
  
  -- Log pour debug (visible dans les logs Supabase)
  RAISE LOG 'Création du profil pour l''utilisateur %', NEW.id;
  RAISE LOG 'Email: %', NEW.email;
  RAISE LOG 'Métadonnées: nom=%, prenom=%', user_nom, user_prenom;
  
  -- Insérer le profil
  INSERT INTO public.profiles (id, role, nom, prenom, email, created_at)
  VALUES (
    NEW.id,
    'client'::user_role,
    user_nom,
    user_prenom,
    NEW.email,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RAISE LOG 'Profil créé avec succès pour l''utilisateur %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne pas bloquer la création de l'utilisateur
    RAISE WARNING 'Erreur lors de la création du profil pour %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 4. Vérifier les policies RLS pour permettre la création de profil
-- Cette policy doit permettre au trigger de créer le profil

-- Supprimer l'ancienne policy si elle existe
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;

-- Recréer la policy améliorée
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (
    -- Permettre au service role (trigger) de créer des profils
    true
  );

-- 5. Vérifier que les utilisateurs peuvent lire leur propre profil
-- Supprimer et recréer la policy de lecture
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (
    -- L'utilisateur peut voir son propre profil
    auth.uid() = id
  );

-- 6. Vérifier et améliorer la policy pour que les admins voient tous les profils
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Script de vérification - Exécuter après la création du trigger
-- Vérifier que le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Vérifier les policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 8. Script de test manuel
-- Décommentez et exécutez pour tester la création d'un profil
/*
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Créer un utilisateur de test
  test_user_id := gen_random_uuid();
  
  -- Simuler l'insertion dans auth.users (à adapter selon votre cas)
  -- Note: Vous ne pouvez normalement pas insérer directement dans auth.users
  -- Utilisez plutôt la page signup pour tester
  
  RAISE NOTICE 'Test user ID: %', test_user_id;
END $$;
*/
