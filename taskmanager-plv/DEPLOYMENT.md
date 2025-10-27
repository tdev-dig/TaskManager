# Guide de déploiement - TaskManager PLV

## 📋 Prérequis

1. Un compte Supabase (gratuit sur https://supabase.com)
2. Un compte Vercel (gratuit sur https://vercel.com)
3. Node.js 18+ installé
4. npm ou yarn

## 🚀 Étapes de déploiement

### 1. Configuration Supabase

#### Créer un projet Supabase
1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Attendez que le projet soit initialisé (5-10 minutes)

#### Exécuter le schéma SQL amélioré
1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `supabase/schema.sql` (version mise à jour avec ENUMs et RLS corrigé)
3. Collez-le dans l'éditeur SQL
4. Exécutez le script (bouton "Run")

#### Récupérer les clés d'API
1. Allez dans **Settings** > **API**
2. Copiez:
   - `Project URL`
   - `anon public` key
   - `service_role` key (pour le script de seed data)

### 2. Configuration de l'application

#### Configurer les variables d'environnement
1. Renommez `.env.example` en `.env.local`
2. Remplissez les variables:

```env
NEXT_PUBLIC_SUPABASE_URL=votre-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

#### Installer les dépendances
```bash
npm install
```

### 3. Créer les données de test (2 options)

#### Option A: Script automatisé (Recommandé)
```bash
# Installer les dépendances si pas déjà fait
npm install @supabase/supabase-js

# Exécuter le script de création automatique
node supabase/setup-seed-data.js
```

#### Option B: Création manuelle
1. Dans Supabase, allez dans **Authentication** > **Users**
2. Créez manuellement les utilisateurs avec **Add user** > **Create new user**:
   - admin@taskmanager.com (mot de passe: admin123!)
   - commercial1@taskmanager.com (mot de passe: commercial123!)
   - commercial2@taskmanager.com (mot de passe: commercial123!)
   - client1@taskmanager.com (mot de passe: client123!)
   - client2@taskmanager.com (mot de passe: client123!)
   - client3@taskmanager.com (mot de passe: client123!)

3. Récupérez les UUIDs des utilisateurs créés
4. Modifiez le fichier `supabase/seed-manual.sql` avec les vrais UUIDs
5. Exécutez le script dans l'éditeur SQL de Supabase

### 4. Lancer l'application en développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

### 5. Déploiement en production sur Vercel

#### Préparation du projet
1. Assurez-vous que le fichier `vercel.json` est présent (déjà configuré)
2. Vérifiez que toutes les dépendances sont dans `package.json`

#### Déploiement via Vercel CLI (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redéployer avec les nouvelles variables
vercel --prod
```

#### Déploiement via Dashboard Vercel
1. Créez un compte sur https://vercel.com
2. Connectez votre repository GitHub
3. Importez le projet TaskManager PLV
4. Dans les paramètres du projet, ajoutez les variables d'environnement:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Déployez automatiquement

#### Configuration post-déploiement
1. Vérifiez que l'application se lance correctement
2. Testez la connexion avec les comptes créés
3. Vérifiez les politiques RLS dans Supabase
4. Configurez le domaine personnalisé si nécessaire

## 🔐 Sécurité

### Row Level Security (RLS)

Les politiques RLS sont déjà configurées dans le schéma SQL. Elles garantissent que:

- Les admins ont accès à tout
- Les commerciaux ne voient que leurs clients et commandes
- Les clients ne voient que leurs propres commandes

### Authentification

- Les mots de passe sont hashés par Supabase
- Les sessions sont gérées automatiquement
- Le middleware Next.js protège les routes

## 📝 Workflow initial

### Après le premier déploiement:

1. **Connexion admin**
   - Connectez-vous avec le compte admin créé

2. **Créer des commerciaux**
   - Dashboard Admin > Utilisateurs
   - Créez des comptes commerciaux

3. **Les commerciaux créent leurs clients**
   - Connexion commercial
   - Dashboard Commercial > Clients
   - Ajoutez des clients

4. **Les clients peuvent s'inscrire**
   - Page d'inscription publique
   - Rôle "client" automatique

5. **Créer des commandes**
   - Les commerciaux créent des commandes pour leurs clients
   - Les clients peuvent créer leurs propres commandes
   - Import Excel disponible pour les commandes en masse

## 🧪 Tests

### Test de l'authentification
1. Inscrivez un client via `/signup`
2. Connectez-vous avec ce compte
3. Vérifiez la redirection vers `/dashboard/client`

### Test des permissions
1. Essayez d'accéder à `/dashboard/admin` avec un compte client
2. Vous devriez être redirigé automatiquement

### Test des commandes
1. Créez un client (en tant que commercial)
2. Créez une commande pour ce client
3. Vérifiez que la commande apparaît dans les tableaux de bord

## 🐛 Debugging

### Problème: "Aucun utilisateur trouvé"
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que le schéma SQL a été exécuté

### Problème: "Client non trouvé"
- Pour les clients qui s'inscrivent, un commercial doit d'abord créer une fiche client avec leur email
- L'email dans la table `clients` doit correspondre à l'email d'inscription

### Problème: Import Excel ne fonctionne pas
- Vérifiez le format du fichier (colonnes requises)
- Vérifiez que les IDs clients existent
- Consultez la console pour les erreurs détaillées

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Shadcn UI](https://ui.shadcn.com)

## 🆘 Support

Pour toute question ou problème:
1. Vérifiez les logs Supabase
2. Vérifiez la console du navigateur
3. Vérifiez les logs Next.js
