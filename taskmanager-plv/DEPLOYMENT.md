# Guide de déploiement - TaskManager PLV

## 📋 Prérequis

1. Un compte Supabase (gratuit sur https://supabase.com)
2. Node.js 18+ installé
3. npm ou yarn

## 🚀 Étapes de déploiement

### 1. Configuration Supabase

#### Créer un projet Supabase
1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Attendez que le projet soit initialisé

#### Exécuter le schéma SQL
1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `supabase/schema.sql`
3. Collez-le dans l'éditeur SQL
4. Exécutez le script (bouton "Run")

#### Récupérer les clés d'API
1. Allez dans **Settings** > **API**
2. Copiez:
   - `Project URL`
   - `anon public` key

### 2. Configuration de l'application

#### Configurer les variables d'environnement
1. Renommez `.env.example` en `.env.local`
2. Remplissez les variables:

```env
NEXT_PUBLIC_SUPABASE_URL=votre-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
```

#### Installer les dépendances
```bash
npm install
```

### 3. Créer le premier administrateur

Le premier utilisateur admin doit être créé manuellement:

1. Dans Supabase, allez dans **Authentication** > **Users**
2. Cliquez sur **Add user** > **Create new user**
3. Entrez un email et un mot de passe
4. Allez dans **Table Editor** > **profiles**
5. Trouvez l'utilisateur créé
6. Modifiez le champ `role` en `admin`
7. Sauvegardez

### 4. Lancer l'application en développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

### 5. Déploiement en production

#### Option 1: Vercel (Recommandé)

1. Créez un compte sur https://vercel.com
2. Importez votre projet GitHub
3. Ajoutez les variables d'environnement dans Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Déployez

#### Option 2: Build local

```bash
npm run build
npm start
```

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
