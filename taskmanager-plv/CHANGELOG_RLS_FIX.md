# Changelog - Correction RLS et Rôles Multiples

## 🎯 Problèmes résolus

### 1. Politiques RLS trop restrictives
**Problème** : Impossible de créer manuellement des utilisateurs dans Supabase car les politiques RLS nécessitaient qu'un admin existe déjà.

**Solution** : 
- Ajout d'une politique spéciale permettant la création du premier admin
- Politique "Allow profile creation when no admin exists" qui autorise l'insertion si aucun admin n'existe

### 2. Rôles limités à un seul type
**Problème** : Un utilisateur ne pouvait avoir qu'un seul rôle (admin OU commercial OU client).

**Solution** :
- Migration de `role TEXT` vers `roles TEXT[]`
- Support des rôles multiples (ex: admin + commercial)
- Mise à jour de toutes les politiques RLS pour utiliser `'admin' = ANY(roles)`

### 3. Absence de données de test
**Problème** : Pas de données initiales pour tester l'application.

**Solution** :
- Script `seed.sql` avec 6 utilisateurs, 5 clients, 8 articles stock, 8 commandes
- Guide détaillé `README_SEED.md` pour l'initialisation
- Script automatique de création des profils

## 📋 Modifications apportées

### Base de données (schema.sql)
```sql
-- AVANT
role TEXT NOT NULL CHECK (role IN ('admin', 'commercial', 'client'))

-- APRÈS  
roles TEXT[] NOT NULL DEFAULT ARRAY['client']
```

### Politiques RLS mises à jour
- ✅ `profiles` : Support rôles multiples + création initiale admin
- ✅ `clients` : Commerciaux et admins peuvent gérer
- ✅ `commandes` : Accès basé sur les nouveaux rôles
- ✅ `stock` : Seuls les admins peuvent modifier

### Types TypeScript (database.types.ts)
```typescript
// AVANT
role: 'admin' | 'commercial' | 'client'

// APRÈS
roles: ('admin' | 'commercial' | 'client')[]
```

### Fonctions utilitaires (lib/auth.ts)
- `hasRole()` : Vérifier si un utilisateur a un rôle spécifique
- `hasAnyRole()` : Vérifier si un utilisateur a au moins un des rôles
- `isAdmin()`, `isCommercial()`, `isClient()` : Raccourcis
- `canManageUsers()`, `canManageClients()`, etc. : Permissions métier

### Composants UI
- `RoleBadge` : Affichage des rôles multiples avec couleurs distinctes

## 🚀 Nouveaux fichiers créés

1. **supabase/seed.sql** : Données de test complètes
2. **supabase/README_SEED.md** : Guide d'initialisation détaillé  
3. **components/ui/role-badge.tsx** : Composant d'affichage des rôles
4. **scripts/check-setup.js** : Script de vérification de configuration
5. **.env.example** : Template des variables d'environnement
6. **CHANGELOG_RLS_FIX.md** : Ce fichier de documentation

## 🔧 Utilisation

### Créer le premier admin
```sql
-- Dans Supabase SQL Editor, après avoir créé l'utilisateur dans Auth
INSERT INTO profiles (id, roles, nom, prenom, email) 
VALUES ('user-uuid-from-auth', ARRAY['admin'], 'Nom', 'Prenom', 'email@domain.com');
```

### Vérifier les rôles en TypeScript
```typescript
import { hasRole, isAdmin, canManageUsers } from '@/lib/auth'

// Vérifier un rôle spécifique
if (hasRole(profile, 'admin')) {
  // L'utilisateur est admin
}

// Vérifier les permissions métier
if (canManageUsers(profile)) {
  // Peut gérer les utilisateurs
}
```

### Afficher les rôles dans l'UI
```tsx
import { RoleBadge } from '@/components/ui/role-badge'

<RoleBadge roles={profile.roles} />
```

## 📊 Données de test disponibles

### Utilisateurs créés
- **Admin** : admin@taskmanager.com (rôle: admin)
- **Commerciaux** : sophie.martin@taskmanager.com, pierre.bernard@taskmanager.com
- **Clients** : marie.durand@client1.com, paul.moreau@client2.com
- **Multi-rôle** : julie.leroy@taskmanager.com (admin + commercial)

### Données associées
- 5 entreprises clientes avec contacts
- 8 articles en stock (vis, écrous, plaques, etc.)
- 8 commandes avec différents statuts

## ✅ Tests recommandés

1. **Création manuelle d'admin** : Créer un utilisateur dans Auth puis son profil
2. **Rôles multiples** : Assigner plusieurs rôles à un utilisateur
3. **Permissions** : Vérifier l'accès selon les rôles
4. **Données de test** : Utiliser le script seed.sql
5. **Déploiement Vercel** : Tester avec les variables d'environnement

## 🎉 Résultat

- ✅ Création manuelle d'utilisateurs possible dans Supabase
- ✅ Support des rôles multiples (admin + commercial, etc.)
- ✅ Politiques RLS correctement configurées
- ✅ Données de test complètes pour développement
- ✅ Configuration Vercel optimisée
- ✅ Documentation complète et scripts utilitaires