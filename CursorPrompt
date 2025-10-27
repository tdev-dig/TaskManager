# 🚀 Project: TaskManager PLV

## 🎯 Objectif du projet
Développer une application web de gestion interne pour une **entreprise de confection de PLV (publicité sur lieu de vente)**.  
L’application doit permettre de **gérer les commandes, le suivi des tâches, la production et la relation client**, via une interface adaptée à chaque rôle utilisateur.

## 🧱 Stack technique
- **Next.js 14 (App Router)**
- **Supabase** (Base de données + Auth + Storage)
- **TypeScript**
- **Tailwind CSS + Shadcn UI**
- **React Hook Form + Zod**
- **React Query ou Supabase client hooks**
- **XLSX.js** pour import/export de fichiers Excel

---

## 👥 Rôles utilisateurs et règles d’accès

### 1. Admin
- Créé uniquement via Supabase (compte initial).
- Peut :
  - Créer des comptes **commerciaux** et **admins**.
  - Voir et gérer toutes les commandes.
  - Gérer le stock de matériaux (ajout, retrait, mise à jour).
  - Importer des commandes à partir d’un fichier Excel.
  - Gérer les utilisateurs (désactivation, réinitialisation mot de passe).
  - Voir les statistiques globales : nombre de commandes, statut, performance commerciale.

### 2. Commercial
- Compte créé par l’admin uniquement.
- Peut :
  - Gérer ses propres **clients**.
  - Créer, modifier et suivre les **commandes** des clients dont il est responsable.
  - Mettre à jour les statuts de production (en attente, en cours, terminé, livré).
  - Consulter l’historique de ses ventes et performances.
  - Importer ses commandes via fichier Excel (modèle standard).

### 3. Client
- Seul rôle pouvant **s’inscrire** librement via le formulaire public.
- Lors de l’inscription, le rôle `client` est automatiquement attribué.
- Peut :
  - Créer une commande via un formulaire (nom produit, quantité, date souhaitée…).
  - Consulter le statut de ses commandes.
  - Télécharger ses bons de commande ou factures.
  - Communiquer avec le commercial affecté.

---

## 🔐 Authentification & gestion des rôles
- Utiliser **Supabase Auth**.
- Rôle attribué via la table `profiles` liée à `auth.users`.
- Un middleware Next.js (`middleware.ts`) doit protéger les routes selon le rôle :
  - `/dashboard/admin/*` → accessible uniquement aux admins.
  - `/dashboard/commercial/*` → accessible uniquement aux commerciaux.
  - `/dashboard/client/*` → accessible uniquement aux clients.
- Redirections automatiques selon le rôle après connexion.

---

## 🗂️ Structure de la base de données Supabase

### Table: `profiles`
| colonne | type | description |
|----------|-------|-------------|
| id | uuid | référence à `auth.users.id` |
| role | text | 'admin', 'commercial', 'client' |
| nom | text | prénom ou nom |
| prenom | text | prénom |
| email | text | unique |
| created_by | uuid | admin qui a créé l’utilisateur (null si client) |
| created_at | timestamp | date de création |

### Table: `clients`
| colonne | type | description |
|----------|-------|-------------|
| id | uuid | clé primaire |
| nom | text | nom du client |
| entreprise | text | nom société |
| commercial_id | uuid | référence au commercial responsable |
| contact | text | téléphone / email |
| created_at | timestamp | date création |

### Table: `commandes`
| colonne | type | description |
|----------|-------|-------------|
| id | uuid | clé primaire |
| reference | text | identifiant commande |
| client_id | uuid | référence vers `clients.id` |
| commercial_id | uuid | référence vers `profiles.id` |
| produit | text | description produit PLV |
| quantite | integer | quantité commandée |
| statut | text | 'en_attente', 'en_cours', 'termine', 'livre' |
| date_livraison | date | date prévue |
| created_at | timestamp | date création |

### Table: `stock`
| colonne | type | description |
|----------|-------|-------------|
| id | uuid | clé primaire |
| nom | text | nom du matériau |
| quantite | integer | stock disponible |
| unite | text | unité de mesure (ex: m², pièce...) |
| updated_at | timestamp | mise à jour |

---

## ⚙️ Fonctions clés à implémenter

### Auth & rôles
- Inscription uniquement pour clients.
- Création d’utilisateurs (admin/commercial) depuis le dashboard admin.
- Middleware pour protéger les routes selon le rôle.

### Importation Excel
- Bouton “Importer un fichier Excel” dans le dashboard admin et commercial.
- Lecture via `xlsx` → insertion automatique dans la table `commandes`.
- Valider les colonnes obligatoires : `client`, `produit`, `quantite`, `date_livraison`.

### Gestion des commandes
- Formulaire dynamique avec validation Zod.
- Statuts modifiables uniquement par commercial ou admin.
- Historique des changements (table `commandes_logs` optionnelle).

### Dashboard par rôle
- **Admin** : KPIs, gestion utilisateurs, stock, commandes globales, import Excel.
- **Commercial** : commandes personnelles, clients, import Excel, suivi production.
- **Client** : suivi commandes, historique, création nouvelle commande.

### Gestion du stock
- CRUD complet pour le stock (admin uniquement).
- Alerte visuelle si quantité < seuil minimal.
- Historique des entrées/sorties optionnel.

---

## 🧭 Comportement attendu à la connexion
- Si `role = admin` → `/dashboard/admin`
- Si `role = commercial` → `/dashboard/commercial`
- Si `role = client` → `/dashboard/client`
- Si non authentifié → `/login`

---

## 💡 Bonus (facultatif si temps)
- Upload de visuels PLV (Stockage Supabase Storage).
- Notifications en temps réel (Supabase Realtime).
- Export Excel des commandes.
- Dark mode.
- Recherche et filtres avancés sur les commandes.

---

## 🧩 But du MVP
L’objectif du MVP est d’avoir :
1. Auth fonctionnelle avec redirection par rôle.
2. Gestion CRUD des commandes et du stock.
3. Import Excel opérationnel.
4. Dashboard minimal par rôle.
5. Design propre et responsive avec Shadcn UI.

---

> 🧠 Tips pour Cursor :  
> - Commence par scaffolder la structure (Next + Supabase + Auth + routes dashboards).  
> - Ensuite crée les composants par rôle.  
> - Puis ajoute les fonctionnalités secondaires (import Excel, gestion stock).  
> - Teste l’auth avant de passer au CRUD.
