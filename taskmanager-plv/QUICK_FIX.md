# 🚀 Guide de Correction Rapide - Authentification

## Problème: Impossible de se connecter/inscrire

### Solution Rapide (5 minutes)

#### 1. Configurez vos clés Supabase

**a) Obtenez vos clés:**
- Allez sur https://supabase.com
- Sélectionnez votre projet
- Settings (⚙️) > API
- Copiez les 3 clés

**b) Créez `.env.local` à la racine du projet:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...VOTRE_CLE_ANON
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...VOTRE_CLE_SERVICE
```

**c) Redémarrez le serveur:**
```bash
# Ctrl+C pour arrêter
npm run dev
```

#### 2. Configurez Supabase (première fois seulement)

**a) Appliquez le schéma:**
1. Dans Supabase: SQL Editor > New query
2. Copiez tout le contenu de `supabase/schema.sql`
3. Run

**b) Corrigez le trigger:**
1. SQL Editor > New query
2. Copiez tout le contenu de `supabase/fix-auth-trigger.sql`
3. Run

**c) Désactivez la confirmation email (dev):**
1. Authentication > Settings
2. Décochez "Enable email confirmations"
3. Save

#### 3. Testez

**Test 1: Connexion Supabase**
- Allez sur: http://localhost:3000/test-connection
- Tout doit être vert ✅

**Test 2: Inscription**
- Allez sur: http://localhost:3000/signup
- Créez un compte
- Ouvrez la console (F12) pour voir les logs

**Test 3: Login**
- Allez sur: http://localhost:3000/login
- Connectez-vous
- Vous devez être redirigé vers `/dashboard/client`

### ✅ C'est tout !

Si ça ne fonctionne toujours pas, consultez `TROUBLESHOOTING.md` pour plus de détails.

---

## 🐛 Problèmes Courants

### "Invalid API key"
→ Vérifiez `.env.local` et redémarrez le serveur

### "User already registered"
→ Utilisez un autre email OU supprimez l'utilisateur dans Supabase (Authentication > Users)

### "Profile not found"
→ Exécutez `supabase/fix-auth-trigger.sql`

### Rien ne se passe
→ Ouvrez la console (F12) pour voir les erreurs

---

## 📋 Checklist Rapide

- [ ] `.env.local` créé avec les bonnes clés
- [ ] Serveur redémarré après création de `.env.local`
- [ ] `supabase/schema.sql` exécuté dans Supabase
- [ ] `supabase/fix-auth-trigger.sql` exécuté dans Supabase
- [ ] Confirmation email désactivée
- [ ] Page `/test-connection` affiche tout en vert
- [ ] Inscription fonctionne
- [ ] Login fonctionne

---

## 🎯 Commandes Utiles

```bash
# Redémarrer proprement
rm -rf .next
npm run dev

# Vérifier les variables d'environnement
cat .env.local

# Voir les logs en temps réel
# Gardez la console du navigateur ouverte (F12)
```
