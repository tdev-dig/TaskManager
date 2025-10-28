# 🔐 Configuration de l'Authentification - TaskManager PLV

## 🎯 Résumé des Problèmes et Solutions

J'ai identifié et corrigé plusieurs problèmes d'authentification dans votre application. Voici ce qui a été fait :

### ✅ Problèmes Identifiés

1. **Variables d'environnement manquantes** - Le fichier `.env.local` n'existait pas
2. **Trigger de création de profil** - Potentiellement défaillant
3. **Gestion d'erreurs insuffisante** - Difficile de diagnostiquer les problèmes
4. **Pas d'outil de diagnostic** - Impossible de vérifier la configuration

### ✅ Solutions Implémentées

#### 1. Fichier `.env.local` créé
Un template a été créé. **Vous devez le remplir avec vos vraies clés Supabase !**

```bash
# Éditez ce fichier:
/workspace/taskmanager-plv/.env.local

# Ajoutez vos vraies clés depuis Supabase.com > Settings > API
```

#### 2. Page de diagnostic créée
Nouvelle page pour tester la connexion : `/test-connection`

Cette page vérifie:
- ✅ Variables d'environnement
- ✅ Connexion Supabase
- ✅ Authentification
- ✅ Accès au profil

#### 3. Scripts SQL de correction
- `supabase/fix-auth-trigger.sql` - Corrige le trigger de création de profil
- `supabase/fix-email-confirmation.sql` - Instructions pour désactiver la confirmation email

#### 4. Logs détaillés ajoutés
Les pages login et signup affichent maintenant des logs détaillés dans la console pour faciliter le débogage.

#### 5. Guides de dépannage
- `QUICK_FIX.md` - Guide rapide (5 minutes)
- `TROUBLESHOOTING.md` - Guide détaillé de dépannage
- `AUTHENTICATION_GUIDE.md` - Guide complet de configuration

## 🚀 Comment Démarrer (Étapes Rapides)

### Étape 1: Configurez `.env.local`

```bash
# 1. Allez sur https://supabase.com
# 2. Sélectionnez votre projet
# 3. Settings > API
# 4. Copiez les clés dans .env.local
# 5. Redémarrez le serveur !
```

### Étape 2: Configurez Supabase (première fois)

Dans Supabase SQL Editor, exécutez dans cet ordre:
1. `supabase/schema.sql` (si pas déjà fait)
2. `supabase/fix-auth-trigger.sql`

Dans Supabase Authentication > Settings:
- Décochez "Enable email confirmations" (pour le développement)

### Étape 3: Testez

1. Accédez à: http://localhost:3000/test-connection
2. Vérifiez que tout est vert ✅
3. Testez l'inscription: http://localhost:3000/signup
4. Testez le login: http://localhost:3000/login

## 📁 Nouveaux Fichiers Créés

```
taskmanager-plv/
├── .env.local                          # NOUVEAU - À remplir avec vos clés
├── app/
│   └── test-connection/
│       └── page.tsx                    # NOUVEAU - Page de diagnostic
├── supabase/
│   ├── fix-auth-trigger.sql           # NOUVEAU - Correction du trigger
│   └── fix-email-confirmation.sql     # NOUVEAU - Instructions confirmation email
├── QUICK_FIX.md                        # NOUVEAU - Guide rapide
├── TROUBLESHOOTING.md                  # NOUVEAU - Guide de dépannage
└── AUTHENTICATION_GUIDE.md             # NOUVEAU - Guide complet
```

## 📝 Fichiers Modifiés

- `app/(auth)/login/page.tsx` - Ajout de logs détaillés et meilleure gestion d'erreurs
- `app/(auth)/signup/page.tsx` - Ajout de logs détaillés et vérification du profil
- `middleware.ts` - Ajout de `/test-connection` aux routes publiques

## 🔍 Diagnostiquer les Problèmes

### Ouvrez la console du navigateur (F12)

Lors de l'inscription, vous devriez voir:
```
📝 Tentative d'inscription pour: test@example.com
✅ Client Supabase créé
📤 Envoi des données: {...}
✅ Inscription réussie!
👤 Utilisateur créé: abc-123
🔍 Vérification de la création du profil...
✅ Profil créé avec succès
```

Lors du login, vous devriez voir:
```
🔐 Tentative de connexion pour: test@example.com
✅ Client Supabase créé
✅ Connexion réussie, utilisateur: abc-123
🔍 Récupération du profil...
✅ Profil trouvé, rôle: client
🔄 Redirection vers: /dashboard/client
```

### Messages d'Erreur Courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Invalid API key" | Clés Supabase incorrectes | Vérifiez `.env.local` et redémarrez |
| "User already registered" | Email déjà utilisé | Utilisez un autre email |
| "Profile not found" | Trigger n'a pas créé le profil | Exécutez `fix-auth-trigger.sql` |
| "Configuration Supabase manquante" | `.env.local` vide | Remplissez `.env.local` |

## 🎓 Comprendre l'Architecture

### Flux d'Inscription
1. Utilisateur remplit le formulaire → `/signup`
2. Appel `supabase.auth.signUp()` → Création dans `auth.users`
3. **Trigger automatique** → Création du profil dans `profiles`
4. Redirection vers `/login`

### Flux de Connexion
1. Utilisateur entre email/mot de passe → `/login`
2. Appel `supabase.auth.signInWithPassword()`
3. Récupération du profil depuis la table `profiles`
4. Redirection selon le rôle:
   - admin → `/dashboard/admin`
   - commercial → `/dashboard/commercial`
   - client → `/dashboard/client`

### Row Level Security (RLS)
Les policies RLS contrôlent qui peut lire/écrire:
- ✅ Utilisateur peut voir son propre profil
- ✅ Admin peut voir tous les profils
- ✅ Le trigger peut créer des profils (SECURITY DEFINER)

## 🔒 Sécurité

### Pour le Développement
- ✅ Confirmation email désactivée (pour faciliter les tests)
- ✅ RLS activé (sécurité de base maintenue)

### Pour la Production
Avant de déployer, réactivez:
1. **Confirmation email** (Authentication > Settings)
2. Vérifiez les **RLS policies**
3. Utilisez des **clés environnement sécurisées**
4. Supprimez la page `/test-connection` ou protégez-la

## ❓ FAQ

**Q: Dois-je créer manuellement les utilisateurs ?**
Non, l'inscription via `/signup` crée automatiquement l'utilisateur ET le profil.

**Q: Comment créer un admin ?**
Via SQL dans Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

**Q: Pourquoi dois-je redémarrer le serveur après `.env.local` ?**
Next.js charge les variables d'environnement au démarrage uniquement.

**Q: Comment supprimer un utilisateur de test ?**
Supabase > Authentication > Users > [User] > Actions > Delete user

**Q: Le trigger fonctionne-t-il pour tous les nouveaux utilisateurs ?**
Oui, le trigger s'exécute automatiquement après chaque insertion dans `auth.users`.

## 📞 Support

Si vous avez encore des problèmes:

1. **Vérifiez `/test-connection`** - Identifiez le problème exact
2. **Consultez les logs** - Console navigateur (F12)
3. **Lisez TROUBLESHOOTING.md** - Guide détaillé étape par étape
4. **Vérifiez les logs Supabase** - Logs > Database dans Supabase

## ✨ Prochaines Étapes

Une fois l'authentification fonctionnelle:

1. ✅ Testez tous les rôles (admin, commercial, client)
2. ✅ Vérifiez les dashboards spécifiques à chaque rôle
3. ✅ Testez la création de commandes
4. ✅ Importez des données de test
5. ✅ Configurez le déploiement en production

Bon courage ! 🚀
