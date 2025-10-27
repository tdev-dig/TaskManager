-- Script de seed data manuel pour TaskManager PLV
-- À exécuter après avoir créé manuellement les utilisateurs dans Supabase Auth

-- ============================================================================
-- ÉTAPES PRÉALABLES REQUISES
-- ============================================================================
-- 1. Dans Supabase Auth > Users, créez manuellement ces utilisateurs:
--    - admin@taskmanager.com (mot de passe: admin123!)
--    - commercial1@taskmanager.com (mot de passe: commercial123!)
--    - commercial2@taskmanager.com (mot de passe: commercial123!)
--    - client1@taskmanager.com (mot de passe: client123!)
--    - client2@taskmanager.com (mot de passe: client123!)
--    - client3@taskmanager.com (mot de passe: client123!)
--
-- 2. Récupérez les UUIDs de ces utilisateurs depuis la table auth.users
-- 3. Remplacez les UUIDs ci-dessous par les vrais UUIDs
-- 4. Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================================================

-- Récupérer les UUIDs des utilisateurs créés (pour référence)
-- SELECT id, email FROM auth.users ORDER BY created_at;

-- Variables pour les UUIDs (à remplacer par les vrais)
-- Remplacez ces UUIDs par ceux générés par Supabase Auth
DO $$
DECLARE
    admin_id UUID := '00000000-0000-0000-0000-000000000001';  -- Remplacer par le vrai UUID
    commercial1_id UUID := '00000000-0000-0000-0000-000000000002';  -- Remplacer par le vrai UUID
    commercial2_id UUID := '00000000-0000-0000-0000-000000000003';  -- Remplacer par le vrai UUID
    client1_id UUID := '00000000-0000-0000-0000-000000000004';  -- Remplacer par le vrai UUID
    client2_id UUID := '00000000-0000-0000-0000-000000000005';  -- Remplacer par le vrai UUID
    client3_id UUID := '00000000-0000-0000-0000-000000000006';  -- Remplacer par le vrai UUID
BEGIN

-- Insérer les profils avec les bons rôles
INSERT INTO profiles (id, role, nom, prenom, email, created_by, created_at) VALUES
(admin_id, 'admin'::user_role, 'Admin', 'System', 'admin@taskmanager.com', NULL, NOW()),
(commercial1_id, 'commercial'::user_role, 'Dupont', 'Jean', 'commercial1@taskmanager.com', admin_id, NOW()),
(commercial2_id, 'commercial'::user_role, 'Martin', 'Marie', 'commercial2@taskmanager.com', admin_id, NOW()),
(client1_id, 'client'::user_role, 'Durand', 'Pierre', 'client1@taskmanager.com', commercial1_id, NOW()),
(client2_id, 'client'::user_role, 'Leroy', 'Sophie', 'client2@taskmanager.com', commercial1_id, NOW()),
(client3_id, 'client'::user_role, 'Bernard', 'Luc', 'client3@taskmanager.com', commercial2_id, NOW())
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    email = EXCLUDED.email,
    created_by = EXCLUDED.created_by;

-- Insérer les clients
INSERT INTO clients (id, nom, entreprise, commercial_id, contact, created_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'Durand Pierre', 'TechCorp SARL', commercial1_id, 'client1@taskmanager.com', NOW()),
('c2222222-2222-2222-2222-222222222222', 'Leroy Sophie', 'InnovSoft SAS', commercial1_id, 'client2@taskmanager.com', NOW()),
('c3333333-3333-3333-3333-333333333333', 'Bernard Luc', 'DesignPro EURL', commercial2_id, 'client3@taskmanager.com', NOW()),
('c4444444-4444-4444-4444-444444444444', 'Moreau Anne', 'WebAgency SA', commercial1_id, 'anne.moreau@webagency.fr', NOW()),
('c5555555-5555-5555-5555-555555555555', 'Petit Thomas', 'StartupXYZ', commercial2_id, 'thomas@startupxyz.com', NOW())
ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    entreprise = EXCLUDED.entreprise,
    commercial_id = EXCLUDED.commercial_id,
    contact = EXCLUDED.contact;

-- Insérer le stock
INSERT INTO stock (nom, quantite, unite, updated_at) VALUES
('Kakémono 80x200cm', 25, 'unité', NOW()),
('Roll-up 85x200cm', 15, 'unité', NOW()),
('Flyers A5', 5000, 'unité', NOW()),
('Brochures A4', 2500, 'unité', NOW()),
('Cartes de visite', 10000, 'unité', NOW()),
('Banderoles 3x1m', 8, 'unité', NOW()),
('Stickers personnalisés', 1500, 'unité', NOW()),
('Totems publicitaires', 5, 'unité', NOW())
ON CONFLICT (nom) DO UPDATE SET
    quantite = EXCLUDED.quantite,
    unite = EXCLUDED.unite,
    updated_at = EXCLUDED.updated_at;

-- Insérer les commandes
INSERT INTO commandes (reference, client_id, commercial_id, produit, quantite, statut, date_livraison, created_at) VALUES
('CMD-2024-001', 'c1111111-1111-1111-1111-111111111111', commercial1_id, 'Kakémono personnalisé 80x200cm', 5, 'en_cours'::order_status, '2024-11-15', NOW() - INTERVAL '5 days'),
('CMD-2024-002', 'c2222222-2222-2222-2222-222222222222', commercial1_id, 'Roll-up avec visuel entreprise', 2, 'termine'::order_status, '2024-11-10', NOW() - INTERVAL '3 days'),
('CMD-2024-003', 'c3333333-3333-3333-3333-333333333333', commercial2_id, 'Flyers A5 - 1000 exemplaires', 1000, 'livre'::order_status, '2024-11-05', NOW() - INTERVAL '7 days'),
('CMD-2024-004', 'c1111111-1111-1111-1111-111111111111', commercial1_id, 'Brochures A4 - 500 exemplaires', 500, 'en_attente'::order_status, '2024-11-20', NOW() - INTERVAL '1 day'),
('CMD-2024-005', 'c4444444-4444-4444-4444-444444444444', commercial1_id, 'Cartes de visite - 250 exemplaires', 250, 'en_cours'::order_status, '2024-11-18', NOW() - INTERVAL '2 days'),
('CMD-2024-006', 'c5555555-5555-5555-5555-555555555555', commercial2_id, 'Banderole 3x1m personnalisée', 1, 'en_attente'::order_status, '2024-11-25', NOW()),
('CMD-2024-007', 'c3333333-3333-3333-3333-333333333333', commercial2_id, 'Stickers personnalisés - 200 pièces', 200, 'en_cours'::order_status, '2024-11-22', NOW() - INTERVAL '1 day'),
('CMD-2024-008', 'c2222222-2222-2222-2222-222222222222', commercial1_id, 'Totem publicitaire avec impression', 1, 'termine'::order_status, '2024-11-12', NOW() - INTERVAL '4 days')
ON CONFLICT (reference) DO UPDATE SET
    client_id = EXCLUDED.client_id,
    commercial_id = EXCLUDED.commercial_id,
    produit = EXCLUDED.produit,
    quantite = EXCLUDED.quantite,
    statut = EXCLUDED.statut,
    date_livraison = EXCLUDED.date_livraison;

END $$;

-- ============================================================================
-- VÉRIFICATION DES DONNÉES
-- ============================================================================

-- Vérifier les profils créés
SELECT 'PROFILS' as table_name, role, nom, prenom, email FROM profiles ORDER BY role, nom;

-- Vérifier les clients avec leur commercial
SELECT 'CLIENTS' as table_name, c.nom, c.entreprise, p.nom as commercial_nom, p.prenom as commercial_prenom 
FROM clients c 
JOIN profiles p ON c.commercial_id = p.id 
ORDER BY p.nom, c.nom;

-- Vérifier les commandes
SELECT 'COMMANDES' as table_name, cmd.reference, cmd.produit, cmd.quantite, cmd.statut, cmd.date_livraison,
       c.nom as client_nom, c.entreprise,
       p.nom as commercial_nom, p.prenom as commercial_prenom
FROM commandes cmd
JOIN clients c ON cmd.client_id = c.id
JOIN profiles p ON cmd.commercial_id = p.id
ORDER BY cmd.created_at DESC;

-- Vérifier le stock
SELECT 'STOCK' as table_name, nom, quantite, unite FROM stock ORDER BY nom;

-- ============================================================================
-- COMPTES DE TEST CRÉÉS
-- ============================================================================
-- admin@taskmanager.com (admin123!) - Administrateur système
-- commercial1@taskmanager.com (commercial123!) - Jean Dupont
-- commercial2@taskmanager.com (commercial123!) - Marie Martin  
-- client1@taskmanager.com (client123!) - Pierre Durand
-- client2@taskmanager.com (client123!) - Sophie Leroy
-- client3@taskmanager.com (client123!) - Luc Bernard
-- ============================================================================