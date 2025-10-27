# Guide de configuration des données de test

## Problème résolu : RLS et création d'utilisateurs

Les politiques RLS ont été modifiées pour permettre :
1. La création manuelle d'utilisateurs dans Supabase
2. Le support de rôles multiples (admin, commercial, client)
3. La création initiale d'un administrateur même si aucun admin n'existe

## Étapes pour initialiser l'application

### 1. Appliquer le nouveau schéma

```sql
-- Dans l'éditeur SQL de Supabase, exécutez le contenu de schema.sql
-- Cela va :
-- - Modifier la table profiles pour supporter les rôles multiples
-- - Mettre à jour toutes les politiques RLS
-- - Créer les index nécessaires
```

### 2. Créer les utilisateurs de test dans Supabase Auth

Allez dans Authentication > Users dans votre dashboard Supabase et créez ces utilisateurs :

1. **Admin** : `admin@taskmanager.com` / `password123`
2. **Commercial 1** : `sophie.martin@taskmanager.com` / `password123`
3. **Commercial 2** : `pierre.bernard@taskmanager.com` / `password123`
4. **Client 1** : `marie.durand@client1.com` / `password123`
5. **Client 2** : `paul.moreau@client2.com` / `password123`
6. **Admin/Commercial** : `julie.leroy@taskmanager.com` / `password123`

### 3. Récupérer les IDs des utilisateurs

```sql
-- Exécutez cette requête pour voir les IDs des utilisateurs créés
SELECT id, email FROM auth.users ORDER BY created_at;
```

### 4. Modifier le fichier seed.sql

Remplacez les UUIDs dans `seed.sql` par les vrais IDs récupérés à l'étape 3 :

```sql
-- Remplacez ces lignes dans seed.sql :
('00000000-0000-0000-0000-000000000001', ARRAY['admin'], 'Dupont', 'Jean', 'admin@taskmanager.com', NOW()),
-- Par :
('VRAI_UUID_DE_L_ADMIN', ARRAY['admin'], 'Dupont', 'Jean', 'admin@taskmanager.com', NOW()),
```

### 5. Exécuter le script de seed

```sql
-- Dans l'éditeur SQL de Supabase, exécutez le contenu de seed.sql modifié
-- Cela va créer :
-- - 6 profils utilisateurs avec différents rôles
-- - 5 clients d'entreprise
-- - 8 articles en stock
-- - 8 commandes de test
```

## Alternative : Script automatique

Si vous préférez, vous pouvez utiliser ce script qui récupère automatiquement les IDs :

```sql
-- Script automatique de seed (à exécuter après avoir créé les utilisateurs)
WITH user_mapping AS (
  SELECT 
    email,
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM auth.users
  WHERE email IN (
    'admin@taskmanager.com',
    'sophie.martin@taskmanager.com',
    'pierre.bernard@taskmanager.com',
    'marie.durand@client1.com',
    'paul.moreau@client2.com',
    'julie.leroy@taskmanager.com'
  )
)
INSERT INTO profiles (id, roles, nom, prenom, email, created_at)
SELECT 
  id,
  CASE 
    WHEN email = 'admin@taskmanager.com' THEN ARRAY['admin']
    WHEN email = 'sophie.martin@taskmanager.com' THEN ARRAY['commercial']
    WHEN email = 'pierre.bernard@taskmanager.com' THEN ARRAY['commercial']
    WHEN email = 'marie.durand@client1.com' THEN ARRAY['client']
    WHEN email = 'paul.moreau@client2.com' THEN ARRAY['client']
    WHEN email = 'julie.leroy@taskmanager.com' THEN ARRAY['admin', 'commercial']
  END,
  CASE 
    WHEN email = 'admin@taskmanager.com' THEN 'Dupont'
    WHEN email = 'sophie.martin@taskmanager.com' THEN 'Martin'
    WHEN email = 'pierre.bernard@taskmanager.com' THEN 'Bernard'
    WHEN email = 'marie.durand@client1.com' THEN 'Durand'
    WHEN email = 'paul.moreau@client2.com' THEN 'Moreau'
    WHEN email = 'julie.leroy@taskmanager.com' THEN 'Leroy'
  END,
  CASE 
    WHEN email = 'admin@taskmanager.com' THEN 'Jean'
    WHEN email = 'sophie.martin@taskmanager.com' THEN 'Sophie'
    WHEN email = 'pierre.bernard@taskmanager.com' THEN 'Pierre'
    WHEN email = 'marie.durand@client1.com' THEN 'Marie'
    WHEN email = 'paul.moreau@client2.com' THEN 'Paul'
    WHEN email = 'julie.leroy@taskmanager.com' THEN 'Julie'
  END,
  email,
  NOW()
FROM user_mapping
ON CONFLICT (id) DO NOTHING;
```

## Comptes de test créés

### Administrateur
- **Email** : admin@taskmanager.com
- **Rôles** : admin
- **Accès** : Toutes les fonctionnalités

### Commerciaux
- **Sophie Martin** : sophie.martin@taskmanager.com (commercial)
- **Pierre Bernard** : pierre.bernard@taskmanager.com (commercial)
- **Julie Leroy** : julie.leroy@taskmanager.com (admin + commercial)

### Clients
- **Marie Durand** : marie.durand@client1.com (client)
- **Paul Moreau** : paul.moreau@client2.com (client)

## Données créées

- **5 entreprises clientes** avec contacts assignés aux commerciaux
- **8 articles en stock** (vis, écrous, plaques, tubes, etc.)
- **8 commandes** avec différents statuts (en_attente, en_cours, terminé, livré)

## Test de l'application

1. Connectez-vous avec `admin@taskmanager.com` pour accéder à toutes les fonctionnalités
2. Testez les différents rôles avec les autres comptes
3. Vérifiez que les politiques RLS fonctionnent correctement

## Changements apportés au schéma

1. **Table profiles** : `role` → `roles TEXT[]` (support multi-rôles)
2. **Politiques RLS** : Mise à jour pour utiliser `'admin' = ANY(roles)`
3. **Politique spéciale** : Permet la création du premier admin
4. **Index GIN** : Pour les recherches efficaces dans les arrays de rôles