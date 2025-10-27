-- Seed data for TaskManager PLV
-- This script creates test users and sample data for development and testing

-- Note: This script should be run AFTER the main schema.sql
-- It requires that users be created in Supabase Auth first

-- ============================================================================
-- SEED DATA INSTRUCTIONS
-- ============================================================================
-- 1. First, create users in Supabase Auth dashboard or via API:
--    - admin@taskmanager.com (password: admin123!)
--    - commercial1@taskmanager.com (password: commercial123!)
--    - commercial2@taskmanager.com (password: commercial123!)
--    - client1@taskmanager.com (password: client123!)
--    - client2@taskmanager.com (password: client123!)
--    - client3@taskmanager.com (password: client123!)
--
-- 2. Then run this script to populate the database with test data
-- ============================================================================

-- Insert sample profiles (replace UUIDs with actual user IDs from auth.users)
-- You need to get the actual UUIDs from Supabase Auth after creating the users

-- Sample admin profile
INSERT INTO profiles (id, role, nom, prenom, email, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin'::user_role, 'Admin', 'System', 'admin@taskmanager.com', NOW())
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  email = EXCLUDED.email;

-- Sample commercial profiles
INSERT INTO profiles (id, role, nom, prenom, email, created_by, created_at) VALUES
('00000000-0000-0000-0000-000000000002', 'commercial'::user_role, 'Dupont', 'Jean', 'commercial1@taskmanager.com', '00000000-0000-0000-0000-000000000001', NOW()),
('00000000-0000-0000-0000-000000000003', 'commercial'::user_role, 'Martin', 'Marie', 'commercial2@taskmanager.com', '00000000-0000-0000-0000-000000000001', NOW())
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  email = EXCLUDED.email,
  created_by = EXCLUDED.created_by;

-- Sample client profiles
INSERT INTO profiles (id, role, nom, prenom, email, created_by, created_at) VALUES
('00000000-0000-0000-0000-000000000004', 'client'::user_role, 'Durand', 'Pierre', 'client1@taskmanager.com', '00000000-0000-0000-0000-000000000002', NOW()),
('00000000-0000-0000-0000-000000000005', 'client'::user_role, 'Leroy', 'Sophie', 'client2@taskmanager.com', '00000000-0000-0000-0000-000000000002', NOW()),
('00000000-0000-0000-0000-000000000006', 'client'::user_role, 'Bernard', 'Luc', 'client3@taskmanager.com', '00000000-0000-0000-0000-000000000003', NOW())
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  email = EXCLUDED.email,
  created_by = EXCLUDED.created_by;

-- Insert sample clients
INSERT INTO clients (id, nom, entreprise, commercial_id, contact, created_at) VALUES
('c0000000-0000-0000-0000-000000000001', 'Durand Pierre', 'TechCorp SARL', '00000000-0000-0000-0000-000000000002', 'client1@taskmanager.com', NOW()),
('c0000000-0000-0000-0000-000000000002', 'Leroy Sophie', 'InnovSoft SAS', '00000000-0000-0000-0000-000000000002', 'client2@taskmanager.com', NOW()),
('c0000000-0000-0000-0000-000000000003', 'Bernard Luc', 'DesignPro EURL', '00000000-0000-0000-0000-000000000003', 'client3@taskmanager.com', NOW()),
('c0000000-0000-0000-0000-000000000004', 'Moreau Anne', 'WebAgency SA', '00000000-0000-0000-0000-000000000002', 'anne.moreau@webagency.fr', NOW()),
('c0000000-0000-0000-0000-000000000005', 'Petit Thomas', 'StartupXYZ', '00000000-0000-0000-0000-000000000003', 'thomas@startupxyz.com', NOW())
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  entreprise = EXCLUDED.entreprise,
  commercial_id = EXCLUDED.commercial_id,
  contact = EXCLUDED.contact;

-- Insert sample stock items
INSERT INTO stock (id, nom, quantite, unite, updated_at) VALUES
('s0000000-0000-0000-0000-000000000001', 'Kakémono 80x200cm', 25, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000002', 'Roll-up 85x200cm', 15, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000003', 'Flyers A5', 5000, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000004', 'Brochures A4', 2500, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000005', 'Cartes de visite', 10000, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000006', 'Banderoles 3x1m', 8, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000007', 'Stickers personnalisés', 1500, 'unité', NOW()),
('s0000000-0000-0000-0000-000000000008', 'Totems publicitaires', 5, 'unité', NOW())
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  quantite = EXCLUDED.quantite,
  unite = EXCLUDED.unite,
  updated_at = EXCLUDED.updated_at;

-- Insert sample commandes
INSERT INTO commandes (id, reference, client_id, commercial_id, produit, quantite, statut, date_livraison, created_at) VALUES
('o0000000-0000-0000-0000-000000000001', 'CMD-2024-001', 'c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Kakémono personnalisé 80x200cm', 5, 'en_cours'::order_status, '2024-11-15', NOW() - INTERVAL '5 days'),
('o0000000-0000-0000-0000-000000000002', 'CMD-2024-002', 'c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Roll-up avec visuel entreprise', 2, 'termine'::order_status, '2024-11-10', NOW() - INTERVAL '3 days'),
('o0000000-0000-0000-0000-000000000003', 'CMD-2024-003', 'c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Flyers A5 - 1000 exemplaires', 1000, 'livre'::order_status, '2024-11-05', NOW() - INTERVAL '7 days'),
('o0000000-0000-0000-0000-000000000004', 'CMD-2024-004', 'c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Brochures A4 - 500 exemplaires', 500, 'en_attente'::order_status, '2024-11-20', NOW() - INTERVAL '1 day'),
('o0000000-0000-0000-0000-000000000005', 'CMD-2024-005', 'c0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Cartes de visite - 250 exemplaires', 250, 'en_cours'::order_status, '2024-11-18', NOW() - INTERVAL '2 days'),
('o0000000-0000-0000-0000-000000000006', 'CMD-2024-006', 'c0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'Banderole 3x1m personnalisée', 1, 'en_attente'::order_status, '2024-11-25', NOW()),
('o0000000-0000-0000-0000-000000000007', 'CMD-2024-007', 'c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Stickers personnalisés - 200 pièces', 200, 'en_cours'::order_status, '2024-11-22', NOW() - INTERVAL '1 day'),
('o0000000-0000-0000-0000-000000000008', 'CMD-2024-008', 'c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Totem publicitaire avec impression', 1, 'termine'::order_status, '2024-11-12', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET
  reference = EXCLUDED.reference,
  client_id = EXCLUDED.client_id,
  commercial_id = EXCLUDED.commercial_id,
  produit = EXCLUDED.produit,
  quantite = EXCLUDED.quantite,
  statut = EXCLUDED.statut,
  date_livraison = EXCLUDED.date_livraison;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the seed data was inserted correctly:

-- Check profiles
-- SELECT role, nom, prenom, email FROM profiles ORDER BY role, nom;

-- Check clients with their commercial
-- SELECT c.nom, c.entreprise, p.nom as commercial_nom, p.prenom as commercial_prenom 
-- FROM clients c 
-- JOIN profiles p ON c.commercial_id = p.id 
-- ORDER BY p.nom, c.nom;

-- Check commandes with client and commercial info
-- SELECT cmd.reference, cmd.produit, cmd.quantite, cmd.statut, cmd.date_livraison,
--        c.nom as client_nom, c.entreprise,
--        p.nom as commercial_nom, p.prenom as commercial_prenom
-- FROM commandes cmd
-- JOIN clients c ON cmd.client_id = c.id
-- JOIN profiles p ON cmd.commercial_id = p.id
-- ORDER BY cmd.created_at DESC;

-- Check stock levels
-- SELECT nom, quantite, unite FROM stock ORDER BY nom;

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
-- 1. Replace the sample UUIDs with actual user IDs from auth.users table
-- 2. Make sure to create the auth users first in Supabase Auth
-- 3. The emails in profiles must match the emails in auth.users
-- 4. Client contacts should match user emails for proper linking
-- 5. This script uses ON CONFLICT to allow re-running safely
-- ============================================================================