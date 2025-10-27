# Guide de mise à niveau - TaskManager PLV v2.0.0

## 🚀 Résumé des améliorations

Cette mise à jour majeure corrige les problèmes identifiés et améliore considérablement la robustesse du système :

### ✅ Problèmes résolus

1. **✅ Politiques RLS corrigées** - Permet maintenant la création manuelle d'utilisateurs
2. **✅ Système de rôles refactorisé** - Types ENUM au lieu de TEXT libre  
3. **✅ Seed data automatisé** - Scripts pour créer des données de test
4. **✅ Configuration Vercel optimisée** - Déploiement simplifié

## 📋 Checklist de mise à niveau

### Étape 1: Sauvegarde (Recommandé)
```bash
# Exportez vos données existantes depuis Supabase si nécessaire
# Dashboard Supabase > Table Editor > Export
```

### Étape 2: Mise à jour du schéma
1. Ouvrez Supabase SQL Editor
2. Exécutez le nouveau `supabase/schema.sql`
3. ⚠️ **ATTENTION**: Cela va recréer les politiques RLS

### Étape 3: Mise à jour des types TypeScript
Les types sont déjà mis à jour dans `lib/supabase/database.types.ts`

### Étape 4: Création des données de test
Choisissez une option :

#### Option A: Script automatisé (Recommandé)
```bash
npm run setup-seed
```

#### Option B: Création manuelle
1. Créez les utilisateurs dans Supabase Auth
2. Modifiez `supabase/seed-manual.sql` avec les vrais UUIDs
3. Exécutez le script SQL

### Étape 5: Vérification
```bash
npm run verify
```

## 🔄 Changements techniques détaillés

### Base de données

#### Nouveaux types ENUM
```sql
-- Avant (v1.x)
role TEXT NOT NULL CHECK (role IN ('admin', 'commercial', 'client'))

-- Après (v2.0)
role user_role NOT NULL DEFAULT 'client'
```

#### Politiques RLS améliorées
```sql
-- Nouvelle politique permettant la création manuelle
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR  -- Supabase dashboard
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
    auth.uid() = id  -- Auto-création via trigger
  );
```

### Types TypeScript

#### Avant (v1.x)
```typescript
role: 'admin' | 'commercial' | 'client'
statut: 'en_attente' | 'en_cours' | 'termine' | 'livre'
```

#### Après (v2.0)
```typescript
role: Database['public']['Enums']['user_role']
statut: Database['public']['Enums']['order_status']
```

### Nouveaux scripts

#### Package.json
```json
{
  "scripts": {
    "setup-seed": "node supabase/setup-seed-data.js",
    "verify": "node scripts/verify-setup.js"
  }
}
```

## 🚨 Points d'attention

### Compatibilité
- ✅ **Données existantes préservées** - Le schéma migre automatiquement
- ✅ **Interface utilisateur inchangée** - Aucun impact sur l'UX
- ⚠️ **Politiques RLS remplacées** - Nouvelles règles de sécurité

### Variables d'environnement
Ajoutez la nouvelle variable (optionnelle) :
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Déploiement Vercel
Le nouveau `vercel.json` optimise la configuration :
- Headers de sécurité
- Variables d'environnement
- Redirections automatiques

## 🧪 Test de la mise à niveau

### Vérifications essentielles

1. **Connexion admin**
   ```bash
   # Testez avec admin@taskmanager.com (admin123!)
   ```

2. **Création d'utilisateur**
   ```bash
   # Via Supabase Dashboard > Auth > Users
   # Devrait maintenant fonctionner sans erreur
   ```

3. **Permissions par rôle**
   ```bash
   # Testez l'accès aux différents dashboards
   # /dashboard/admin, /dashboard/commercial, /dashboard/client
   ```

4. **Données de test**
   ```bash
   npm run verify
   # Doit afficher ✅ pour toutes les vérifications
   ```

## 🆘 Résolution de problèmes

### Erreur "enum does not exist"
```sql
-- Exécutez à nouveau le schéma complet
-- Le script crée les ENUMs avant les tables
```

### Erreur de politique RLS
```sql
-- Vérifiez que le nouveau schéma a bien été exécuté
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Utilisateurs de test non créés
```bash
# Vérifiez les variables d'environnement
npm run verify

# Ou créez manuellement via Supabase Dashboard
```

### Erreur de déploiement Vercel
```bash
# Vérifiez les variables d'environnement dans Vercel
vercel env ls

# Ajoutez les variables manquantes
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

## 📞 Support

### Logs utiles
```bash
# Vérification complète
npm run verify

# Logs Supabase
# Dashboard > Logs > API Logs

# Logs Vercel  
# Dashboard Vercel > Functions > View Function Logs
```

### Rollback (si nécessaire)
```sql
-- Restaurer l'ancien schéma depuis votre sauvegarde
-- Ou recréer les anciennes politiques RLS
```

## 🎯 Prochaines étapes

Après la mise à niveau réussie :

1. **Testez en production** avec les comptes de test
2. **Configurez votre domaine** personnalisé sur Vercel
3. **Créez vos vrais utilisateurs** via l'interface admin
4. **Personnalisez les données** selon vos besoins
5. **Consultez le CHANGELOG.md** pour les futures améliorations

---

**🎉 Félicitations !** Votre TaskManager PLV est maintenant plus robuste et prêt pour la production.

*Pour toute question, consultez les fichiers `DEPLOYMENT.md` et `CHANGELOG.md`.*