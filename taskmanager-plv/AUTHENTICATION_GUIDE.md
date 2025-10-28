# Guide de Configuration de l'Authentification

## Problèmes Identifiés et Solutions

### 1. Variables d'Environnement Manquantes

**Problème**: Le fichier `.env.local` n'existe pas, ce qui empêche la connexion à Supabase.

**Solution**: 
1. Créez ou modifiez le fichier `.env.local` à la racine du projet
2. Ajoutez vos credentials Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
```

**Où trouver ces informations**:
- Allez sur [supabase.com](https://supabase.com)
- Sélectionnez votre projet
- Allez dans **Settings** > **API**
- Copiez:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configuration Supabase

#### A. Vérifier que le schéma est appliqué

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez le fichier `supabase/schema.sql`
3. Vérifiez que les tables `profiles`, `clients`, `commandes`, et `stock` existent

#### B. Vérifier les Row Level Security (RLS) Policies

Les RLS doivent être configurées mais ne doivent pas bloquer la création de profil:

```sql
-- Cette policy permet la création de profil lors de l'inscription
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ) OR
    auth.uid() = id
  );
```

#### C. Vérifier le Trigger de Création de Profil

Le trigger doit créer automatiquement un profil lors de l'inscription:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, nom, prenom, email)
  VALUES (
    NEW.id,
    'client'::user_role,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Désactiver la Confirmation d'Email (pour le développement)

Pour faciliter les tests, désactivez la confirmation d'email:

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Sous **Email Auth**, décochez **Enable email confirmations**
3. Sauvegardez

### 4. Tester la Configuration

Accédez à `/test-connection` pour vérifier:
- Les variables d'environnement sont chargées
- La connexion Supabase fonctionne
- L'inscription crée bien un profil
- Le login fonctionne

### 5. Problèmes Courants

#### Erreur: "Invalid API key"
- Vérifiez que les clés dans `.env.local` sont correctes
- Redémarrez le serveur Next.js après modification de `.env.local`

#### Erreur: "User already registered"
- L'email existe déjà dans Supabase
- Utilisez un autre email ou supprimez l'utilisateur dans **Authentication** > **Users**

#### Erreur: "Profile not found" après login
- Le trigger n'a pas créé le profil
- Vérifiez que le trigger existe dans **Database** > **Triggers**
- Créez manuellement le profil:
```sql
INSERT INTO profiles (id, role, nom, prenom, email)
VALUES ('user-uuid', 'client', 'Nom', 'Prenom', 'email@example.com');
```

#### Erreur: "Row Level Security policy violation"
- Les policies RLS bloquent l'accès
- Vérifiez que les policies permettent bien la lecture du profil:
```sql
-- L'utilisateur peut voir son propre profil
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

### 6. Commandes Utiles

```bash
# Redémarrer le serveur (obligatoire après modification .env.local)
npm run dev

# Vérifier la configuration
npm run verify

# Voir les logs de l'application
# Ouvrez la console du navigateur (F12) pour voir les erreurs
```

### 7. Activer les Logs Supabase (Debug)

Pour voir plus de détails sur les erreurs:

```typescript
// Dans lib/supabase/client.ts
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        debug: true // Active les logs détaillés
      }
    }
  )
}
```

## Étapes de Diagnostic

1. **Vérifier les variables d'environnement**
   - Fichier `.env.local` existe et contient les bonnes valeurs
   - Redémarrer le serveur après modification

2. **Tester la page de diagnostic**
   - Aller sur `/test-connection`
   - Vérifier que toutes les sections sont vertes

3. **Tester l'inscription**
   - Aller sur `/signup`
   - Créer un compte
   - Vérifier dans Supabase > Authentication > Users que l'utilisateur est créé
   - Vérifier dans Database > profiles que le profil est créé

4. **Tester le login**
   - Aller sur `/login`
   - Se connecter avec les credentials
   - Vérifier la redirection vers le dashboard approprié

5. **Vérifier les logs**
   - Console du navigateur (F12)
   - Terminal du serveur Next.js
   - Supabase > Logs

## Contact Support

Si le problème persiste après ces étapes:
1. Copiez les résultats de `/test-connection`
2. Copiez les logs de la console du navigateur
3. Notez le message d'erreur exact
