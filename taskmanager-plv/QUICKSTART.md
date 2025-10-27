# 🚀 QuickStart - TaskManager PLV

## Lancement rapide (5 minutes)

### 1. Installation

```bash
cd taskmanager-plv
npm install
```

### 2. Configuration Supabase

1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Dans le **SQL Editor**, exécutez le fichier `supabase/schema.sql`
4. Dans **Settings > API**, copiez:
   - Project URL
   - anon public key

### 3. Variables d'environnement

Créez `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici
```

### 4. Créer le premier admin

Dans Supabase:
1. **Authentication > Users** → Add user
2. **Table Editor > profiles** → Modifier le rôle en `admin`

### 5. Lancer l'app

```bash
npm run dev
```

Ouvrez http://localhost:3000

## 🎯 Premier test

1. **Connexion admin**: utilisez l'email/mdp créé
2. **Créer un commercial**: Dashboard Admin > Utilisateurs
3. **Créer un client**: Se connecter en commercial > Clients
4. **Créer une commande**: Commandes > Nouvelle commande

## 📚 Utilisateurs de test

Vous pouvez créer ces utilisateurs pour tester:

| Rôle | Email | Fonction |
|------|-------|----------|
| Admin | admin@plv.com | Tout voir, tout gérer |
| Commercial | commercial@plv.com | Ses clients, ses commandes |
| Client | client@plv.com | Ses commandes uniquement |

## 🔑 Fonctionnalités clés

- **Admin**: Utilisateurs, Stock, Toutes commandes, Import Excel
- **Commercial**: Ses clients, Ses commandes, Import Excel
- **Client**: Ses commandes, Créer une commande

## 📖 Documentation complète

- `README.md` - Vue d'ensemble
- `DEPLOYMENT.md` - Guide de déploiement
- `PROJECT_STATUS.md` - État du projet

## 🆘 Problèmes fréquents

**Erreur: "Invalid API key"**
→ Vérifiez les variables d'environnement

**Erreur: "User not found"**
→ Le profil n'a pas été créé, vérifiez le trigger SQL

**Page blanche**
→ Ouvrez la console (F12), vérifiez les erreurs

## 📞 Support

Consultez `DEPLOYMENT.md` section "Debugging"
