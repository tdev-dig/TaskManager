# TaskManager PLV

Application web de gestion interne pour une entreprise de confection de PLV (publicité sur lieu de vente).

## 🚀 Stack Technique

- **Next.js 14** (App Router)
- **Supabase** (Base de données + Auth + Storage)
- **TypeScript**
- **Tailwind CSS + Shadcn UI**
- **React Hook Form + Zod**
- **XLSX.js** pour import/export Excel

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

4. Initialiser la base de données Supabase

Se connecter à votre projet Supabase et exécuter le script SQL dans `supabase/schema.sql`

5. Lancer l'application
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
    └── schema.sql          # Schéma de base de données
```

## 🔐 Configuration Supabase

### Créer le premier admin

Après avoir exécuté le script SQL, créer manuellement le premier admin via le dashboard Supabase:

1. Aller dans Authentication > Users
2. Créer un nouvel utilisateur
3. Aller dans Table Editor > profiles
4. Modifier le rôle de l'utilisateur en 'admin'

## 📝 Licence

MIT
