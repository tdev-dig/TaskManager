# TaskManager PLV v2.0.0

Application web de gestion interne pour une entreprise de confection de PLV (publicité sur lieu de vente).

## 🚀 Stack Technique

- **Next.js 16** (App Router)
- **Supabase** (Base de données + Auth + RLS)
- **TypeScript** strict avec types générés
- **Tailwind CSS + Shadcn UI**
- **React Hook Form + Zod**
- **XLSX.js** pour import/export Excel

## ✨ Nouveautés v2.0.0

- 🔐 **Politiques RLS corrigées** - Création manuelle d'utilisateurs possible
- 🎯 **Types ENUM** - Rôles et statuts plus robustes  
- 🌱 **Seed data automatisé** - Données de test prêtes à l'emploi
- 🚀 **Configuration Vercel optimisée** - Déploiement simplifié
- 📚 **Documentation complète** - Guides détaillés

## 🛠️ Installation

1. Cloner le projet
```bash
git clone <repo-url>
cd taskmanager-plv
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Remplir les variables suivantes dans `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clé anonyme de votre projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clé service role (pour seed data)

4. Initialiser la base de données Supabase

Se connecter à votre projet Supabase et exécuter le script SQL dans `supabase/schema.sql`

5. Créer les données de test (optionnel)
```bash
# Option A: Script automatisé (recommandé)
npm run setup-seed

# Option B: Création manuelle (voir DEPLOYMENT.md)
```

6. Vérifier l'installation
```bash
npm run verify
```

7. Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 👥 Rôles et Permissions

### Admin
- Créé uniquement via Supabase
- Gestion complète des utilisateurs (commerciaux, admins)
- Gestion du stock
- Accès à toutes les commandes
- Import Excel
- Statistiques globales

### Commercial
- Créé par un admin
- Gestion de ses clients
- Gestion de ses commandes
- Import Excel de ses commandes
- Suivi de production

### Client
- Inscription libre
- Création de commandes
- Suivi de ses commandes
- Téléchargement de documents

## 📁 Structure du projet

```
taskmanager-plv/
├── app/
│   ├── (auth)/              # Routes d'authentification
│   ├── dashboard/
│   │   ├── admin/          # Dashboard admin
│   │   ├── commercial/     # Dashboard commercial
│   │   └── client/         # Dashboard client
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Composants Shadcn UI
│   └── ...                 # Composants custom
├── lib/
│   ├── supabase/           # Configuration Supabase
│   └── ...                 # Utilitaires
└── supabase/
    ├── schema.sql              # Schéma de base de données (v2.0 avec ENUMs)
    ├── seed.sql                # Données de test détaillées
    ├── seed-manual.sql         # Script manuel avec UUIDs
    └── setup-seed-data.js      # Script automatisé Node.js
```

## 🧪 Comptes de test

Si vous avez exécuté `npm run setup-seed`, ces comptes sont disponibles :

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| Admin | admin@taskmanager.com | admin123! | Administrateur système |
| Commercial | commercial1@taskmanager.com | commercial123! | Jean Dupont |
| Commercial | commercial2@taskmanager.com | commercial123! | Marie Martin |
| Client | client1@taskmanager.com | client123! | Pierre Durand |
| Client | client2@taskmanager.com | client123! | Sophie Leroy |
| Client | client3@taskmanager.com | client123! | Luc Bernard |

## 🔐 Configuration Supabase

### Créer le premier admin (si pas de seed data)

Après avoir exécuté le script SQL, créer manuellement le premier admin via le dashboard Supabase:

1. Aller dans Authentication > Users
2. Créer un nouvel utilisateur
3. Aller dans Table Editor > profiles
4. Modifier le rôle de l'utilisateur en 'admin'

## 🛠️ Scripts disponibles

```bash
npm run dev          # Lancer en développement
npm run build        # Build pour production
npm run start        # Lancer en production
npm run lint         # Vérifier le code
npm run setup-seed   # Créer les données de test
npm run verify       # Vérifier l'installation
```

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement complet
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions
- **[UPGRADE-GUIDE.md](./UPGRADE-GUIDE.md)** - Guide de mise à niveau v2.0
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - État du projet

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Via CLI
vercel

# Ou via dashboard Vercel en connectant votre repo GitHub
```

### Variables d'environnement Vercel
Ajoutez ces variables dans les paramètres Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Licence

MIT
