# Guide de Dépannage - Authentification Supabase

## ⚠️ Problème: Impossible de se connecter ou de s'inscrire

### Étape 1: Vérifier la Configuration de Base

#### A. Vérifier le fichier `.env.local`

```bash
# Dans le terminal, à la racine du projet
cat .env.local
```

Le fichier doit contenir:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Si le fichier n'existe pas ou est vide:**
1. Copiez `.env.example` vers `.env.local`
2. Remplissez avec vos vraies clés depuis Supabase
3. **IMPORTANT:** Redémarrez le serveur Next.js !

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

#### B. Obtenir vos clés Supabase

1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Cliquez sur l'icône ⚙️ **Settings** (en bas à gauche)
4. Allez dans **API**
5. Copiez:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### Étape 2: Tester la Connexion

Accédez à: http://localhost:3000/test-connection

Cette page va vérifier:
- ✅ Variables d'environnement chargées
- ✅ Connexion à Supabase
- ✅ État de l'authentification
- ✅ Accès aux données

**Résultats attendus:**
```json
{
  "envVars": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://xxx.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGci..."
  },
  "connection": {
    "success": true,
    "error": null
  }
}
```

### Étape 3: Vérifier la Configuration Supabase

#### A. Vérifier que le schéma est appliqué

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le contenu de `supabase/schema.sql`
4. Cliquez sur **Run**

**Vérifier les tables:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'clients', 'commandes', 'stock');
```

Vous devriez voir 4 tables.

#### B. Vérifier le trigger de création de profil

Dans SQL Editor:
```sql
SELECT trigger_name, event_object_table, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Si le trigger n'existe pas:**
1. Exécutez le fichier `supabase/fix-auth-trigger.sql`
2. Vérifiez à nouveau

#### C. Désactiver la confirmation d'email (développement)

1. Allez dans **Authentication** > **Settings**
2. Trouvez **Enable email confirmations**
3. **Décochez** cette option
4. Sauvegardez

> ⚠️ **IMPORTANT:** Réactivez cela en production !

### Étape 4: Tester l'Inscription

1. Allez sur `/signup`
2. Remplissez le formulaire
3. Ouvrez la console du navigateur (F12 > Console)
4. Soumettez le formulaire

**Logs attendus dans la console:**
```
📝 Tentative d'inscription pour: test@example.com
✅ Client Supabase créé
📤 Envoi des données: { email: "test@example.com", metadata: {...} }
✅ Inscription réussie!
👤 Utilisateur créé: abc-123-def
🔍 Vérification de la création du profil...
✅ Profil créé avec succès: {...}
```

**Si vous voyez une erreur:**

**Erreur: "Invalid API key"**
- Les clés dans `.env.local` sont incorrectes
- Solution: Vérifiez et corrigez les clés, redémarrez le serveur

**Erreur: "User already registered"**
- L'email existe déjà
- Solution: Utilisez un autre email OU supprimez l'utilisateur dans Supabase
- Pour supprimer: **Authentication** > **Users** > [Votre user] > **Actions** > **Delete user**

**Erreur: "Failed to create profile"**
- Le trigger n'a pas fonctionné
- Solution: Exécutez `supabase/fix-auth-trigger.sql`

### Étape 5: Vérifier dans Supabase

Après l'inscription, vérifiez que tout est créé:

**1. Vérifier l'utilisateur:**
- Allez dans **Authentication** > **Users**
- Votre utilisateur doit apparaître
- Status doit être "Confirmed" (si confirmation désactivée)

**2. Vérifier le profil:**
Dans SQL Editor:
```sql
SELECT * FROM profiles WHERE email = 'votre-email@example.com';
```

Vous devriez voir votre profil avec:
- id (UUID)
- role: 'client'
- nom, prenom
- email
- created_at

**Si le profil n'existe pas:**
Le trigger n'a pas fonctionné. Créez-le manuellement:
```sql
INSERT INTO profiles (id, role, nom, prenom, email)
VALUES (
  'uuid-de-votre-user',  -- Copiez depuis Authentication > Users
  'client',
  'Votre Nom',
  'Votre Prénom',
  'votre-email@example.com'
);
```

### Étape 6: Tester le Login

1. Allez sur `/login`
2. Entrez vos identifiants
3. Ouvrez la console (F12)

**Logs attendus:**
```
🔐 Tentative de connexion pour: test@example.com
✅ Client Supabase créé
✅ Connexion réussie, utilisateur: abc-123-def
🔍 Récupération du profil...
✅ Profil trouvé, rôle: client
🔄 Redirection vers: /dashboard/client
```

**Si erreur:**

**"Invalid login credentials"**
- Email ou mot de passe incorrect
- Solution: Vérifiez vos identifiants

**"Profil introuvable"**
- Le profil n'existe pas dans la table `profiles`
- Solution: Créez-le manuellement (voir étape 5)

**"Row Level Security policy violation"**
- Les RLS bloquent l'accès au profil
- Solution: Exécutez `supabase/fix-auth-trigger.sql` (il corrige les policies)

### Étape 7: Déboguer les RLS (Row Level Security)

Si vous avez des erreurs de permissions:

**1. Vérifier les policies:**
```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
```

**2. Temporairement désactiver RLS (DÉVELOPPEMENT UNIQUEMENT):**
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Testez à nouveau. Si ça fonctionne, le problème vient des policies.

**3. Réactiver RLS et corriger les policies:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

Puis exécutez `supabase/fix-auth-trigger.sql`

### Étape 8: Vérifier les Logs Supabase

1. Dans Supabase, allez dans **Logs**
2. Sélectionnez **Database** logs
3. Cherchez les erreurs récentes

Vous pouvez voir:
- Les triggers qui s'exécutent
- Les erreurs SQL
- Les violations de policies

## 🔧 Checklist Complète

Utilisez cette checklist pour vérifier chaque point:

- [ ] Fichier `.env.local` existe et contient les bonnes clés
- [ ] Serveur Next.js redémarré après modification de `.env.local`
- [ ] Page `/test-connection` montre que la connexion fonctionne
- [ ] Tables créées dans Supabase (profiles, clients, commandes, stock)
- [ ] Trigger `on_auth_user_created` existe
- [ ] Confirmation d'email désactivée (développement)
- [ ] RLS activé sur la table `profiles`
- [ ] Policies RLS permettent la lecture et création de profil
- [ ] Inscription crée bien un utilisateur dans Authentication
- [ ] Inscription crée bien un profil dans la table `profiles`
- [ ] Login fonctionne et redirige vers le bon dashboard

## 📞 Si le problème persiste

Si après toutes ces étapes le problème persiste:

1. **Copiez les résultats de `/test-connection`**
2. **Copiez les logs de la console du navigateur** (F12)
3. **Copiez les logs Supabase** (Logs > Database)
4. **Notez le message d'erreur exact**

### Commandes de diagnostic utiles

```bash
# Voir les variables d'environnement chargées
npm run dev 2>&1 | grep SUPABASE

# Vérifier que le fichier .env.local est lu
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Relancer complètement l'application
rm -rf .next
npm run dev
```

### Reset complet (dernière solution)

Si rien ne fonctionne:

```sql
-- Dans Supabase SQL Editor
-- ⚠️ ATTENTION: Cela supprime TOUTES les données !

-- Supprimer tous les utilisateurs
TRUNCATE auth.users CASCADE;

-- Réinitialiser les tables
TRUNCATE profiles, clients, commandes, stock CASCADE;

-- Re-exécuter le schéma
-- Puis re-exécuter fix-auth-trigger.sql
```

Puis retestez l'inscription depuis zéro.

## 🎯 Configuration Recommandée pour le Développement

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Supabase Settings:**
- ✅ Email confirmation: **Désactivée**
- ✅ RLS: **Activé**
- ✅ Trigger on_auth_user_created: **Activé**
- ✅ Policies: **Configurées selon fix-auth-trigger.sql**

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js avec Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
