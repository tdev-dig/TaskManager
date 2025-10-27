# Changelog - TaskManager PLV

## Version 2.0.0 - Améliorations Majeures (2024-10-27)

### 🚀 Nouvelles fonctionnalités

#### Système de rôles refactorisé
- **BREAKING CHANGE**: Remplacement du type `TEXT` par `ENUM` pour les rôles utilisateurs
- Nouveau type `user_role` avec valeurs: `'admin' | 'commercial' | 'client'`
- Nouveau type `order_status` avec valeurs: `'en_attente' | 'en_cours' | 'termine' | 'livre'`
- Types TypeScript mis à jour pour refléter les ENUMs

#### Politiques RLS améliorées
- **CORRECTION MAJEURE**: Les politiques RLS permettent maintenant la création manuelle d'utilisateurs
- Support du `service_role` pour contourner RLS lors des opérations administratives
- Politiques plus granulaires et sécurisées
- Meilleure gestion des permissions par rôle

#### Scripts de seed data
- **NOUVEAU**: Script automatisé `setup-seed-data.js` pour créer utilisateurs et données de test
- **NOUVEAU**: Script manuel `seed-manual.sql` pour configuration manuelle
- Création automatique de 6 utilisateurs de test (1 admin, 2 commerciaux, 3 clients)
- Données de test cohérentes (clients, stock, commandes)

#### Configuration Vercel optimisée
- **NOUVEAU**: Fichier `vercel.json` avec configuration optimale
- Headers de sécurité configurés
- Gestion des variables d'environnement
- Redirections automatiques

### 🔧 Améliorations techniques

#### Base de données
```sql
-- Nouveaux types ENUM
CREATE TYPE user_role AS ENUM ('admin', 'commercial', 'client');
CREATE TYPE order_status AS ENUM ('en_attente', 'en_cours', 'termine', 'livre');

-- Politiques RLS améliorées
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
    auth.uid() = id
  );
```

#### Types TypeScript
```typescript
// Nouveaux types avec ENUMs
role: Database['public']['Enums']['user_role']
statut: Database['public']['Enums']['order_status']
```

#### Scripts de déploiement
- Script Node.js pour création automatique des utilisateurs
- Gestion des erreurs et vérifications
- Support des opérations idempotentes (ON CONFLICT)

### 📚 Documentation

#### Guides mis à jour
- `DEPLOYMENT.md` complètement revu avec les nouvelles procédures
- Instructions pour les 2 méthodes de seed data
- Guide Vercel détaillé
- Procédures de vérification

#### Nouveaux fichiers
- `CHANGELOG.md` (ce fichier)
- `supabase/seed.sql` - Données de test avec instructions
- `supabase/seed-manual.sql` - Script manuel avec UUIDs
- `supabase/setup-seed-data.js` - Script automatisé Node.js
- `vercel.json` - Configuration Vercel optimisée

### 🐛 Corrections de bugs

#### Politiques RLS
- **CORRIGÉ**: Impossible de créer des utilisateurs manuellement via Supabase
- **CORRIGÉ**: Erreurs de permissions lors de l'insertion de profils
- **CORRIGÉ**: Politiques trop restrictives pour les opérations administratives

#### Types et validation
- **CORRIGÉ**: Validation des rôles plus stricte avec ENUMs
- **CORRIGÉ**: Types TypeScript plus précis
- **CORRIGÉ**: Cohérence entre schéma SQL et types TS

### 🔄 Changements de compatibilité

#### BREAKING CHANGES
1. **Types de rôles**: Migration de `TEXT` vers `ENUM`
   - Les anciens rôles en texte libre ne sont plus acceptés
   - Migration automatique lors de l'exécution du nouveau schéma

2. **Politiques RLS**: Nouvelles règles de sécurité
   - Les anciennes politiques sont remplacées
   - Meilleure granularité des permissions

#### Migration depuis v1.x
```sql
-- Exécuter le nouveau schema.sql pour migrer automatiquement
-- Les données existantes seront préservées
-- Les nouveaux ENUMs remplaceront les contraintes CHECK
```

### 📊 Données de test incluses

#### Utilisateurs créés
- `admin@taskmanager.com` (admin123!) - Administrateur système
- `commercial1@taskmanager.com` (commercial123!) - Jean Dupont
- `commercial2@taskmanager.com` (commercial123!) - Marie Martin
- `client1@taskmanager.com` (client123!) - Pierre Durand
- `client2@taskmanager.com` (client123!) - Sophie Leroy
- `client3@taskmanager.com` (client123!) - Luc Bernard

#### Données de test
- 5 clients d'entreprises avec commerciaux assignés
- 8 articles en stock (PLV variés)
- 8 commandes avec différents statuts
- Relations cohérentes entre toutes les entités

### 🚀 Déploiement

#### Nouvelles procédures
1. **Automatisée**: `node supabase/setup-seed-data.js`
2. **Manuelle**: Création via Supabase + `seed-manual.sql`
3. **Vercel**: Configuration optimisée avec `vercel.json`

#### Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Nouveau pour seed data
```

### 🔮 Prochaines versions

#### Fonctionnalités planifiées
- [ ] Interface d'administration pour gérer les utilisateurs
- [ ] Export Excel des données
- [ ] Notifications temps réel
- [ ] Upload de fichiers (visuels PLV)
- [ ] API REST documentée
- [ ] Tests automatisés

#### Améliorations techniques
- [ ] Cache Redis pour les performances
- [ ] Logs structurés
- [ ] Monitoring et métriques
- [ ] Sauvegarde automatique
- [ ] Migration de données avancée

---

## Version 1.0.0 - Version initiale

### Fonctionnalités de base
- Authentification multi-rôles
- Gestion des commandes PLV
- Interface administrateur, commercial, client
- Import Excel
- Dashboard avec statistiques
- Design responsive avec Shadcn UI

### Architecture
- Next.js 16 avec App Router
- Supabase pour backend et auth
- TypeScript strict
- Tailwind CSS + Shadcn UI
- Row Level Security (RLS)

---

*Pour plus de détails sur l'utilisation, consultez le [README.md](./README.md) et le [guide de déploiement](./DEPLOYMENT.md).*