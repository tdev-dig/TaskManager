-- Seed data for TaskManager PLV
-- This script creates initial test data for the application

-- Note: This assumes you have already created users in Supabase Auth
-- You need to replace the UUIDs below with actual user IDs from auth.users table

-- First, let's create some sample users in profiles table
-- Replace these UUIDs with real ones from your Supabase Auth users
INSERT INTO profiles (id, roles, nom, prenom, email, created_at) VALUES
  -- Admin user
  ('00000000-0000-0000-0000-000000000001', ARRAY['admin'], 'Dupont', 'Jean', 'admin@taskmanager.com', NOW()),
  
  -- Commercial users
  ('00000000-0000-0000-0000-000000000002', ARRAY['commercial'], 'Martin', 'Sophie', 'sophie.martin@taskmanager.com', NOW()),
  ('00000000-0000-0000-0000-000000000003', ARRAY['commercial'], 'Bernard', 'Pierre', 'pierre.bernard@taskmanager.com', NOW()),
  
  -- Client users
  ('00000000-0000-0000-0000-000000000004', ARRAY['client'], 'Durand', 'Marie', 'marie.durand@client1.com', NOW()),
  ('00000000-0000-0000-0000-000000000005', ARRAY['client'], 'Moreau', 'Paul', 'paul.moreau@client2.com', NOW()),
  
  -- Multi-role user (admin + commercial)
  ('00000000-0000-0000-0000-000000000006', ARRAY['admin', 'commercial'], 'Leroy', 'Julie', 'julie.leroy@taskmanager.com', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, nom, entreprise, commercial_id, contact, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Entreprise Alpha', 'Alpha Corp', '00000000-0000-0000-0000-000000000002', '+33 1 23 45 67 89', NOW()),
  ('10000000-0000-0000-0000-000000000002', 'Beta Solutions', 'Beta SARL', '00000000-0000-0000-0000-000000000002', '+33 1 23 45 67 90', NOW()),
  ('10000000-0000-0000-0000-000000000003', 'Gamma Industries', 'Gamma SAS', '00000000-0000-0000-0000-000000000003', '+33 1 23 45 67 91', NOW()),
  ('10000000-0000-0000-0000-000000000004', 'Delta Services', 'Delta Ltd', '00000000-0000-0000-0000-000000000003', '+33 1 23 45 67 92', NOW()),
  ('10000000-0000-0000-0000-000000000005', 'Epsilon Tech', 'Epsilon Inc', '00000000-0000-0000-0000-000000000006', '+33 1 23 45 67 93', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample stock items
INSERT INTO stock (id, nom, quantite, unite, updated_at) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Vis M6x20', 1000, 'pièces', NOW()),
  ('20000000-0000-0000-0000-000000000002', 'Écrous M6', 800, 'pièces', NOW()),
  ('20000000-0000-0000-0000-000000000003', 'Rondelles M6', 1200, 'pièces', NOW()),
  ('20000000-0000-0000-0000-000000000004', 'Boulons M8x30', 500, 'pièces', NOW()),
  ('20000000-0000-0000-0000-000000000005', 'Plaques acier 2mm', 25, 'm²', NOW()),
  ('20000000-0000-0000-0000-000000000006', 'Tubes aluminium Ø20', 150, 'mètres', NOW()),
  ('20000000-0000-0000-0000-000000000007', 'Peinture antirouille', 12, 'litres', NOW()),
  ('20000000-0000-0000-0000-000000000008', 'Joints toriques', 300, 'pièces', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO commandes (id, reference, client_id, commercial_id, produit, quantite, statut, date_livraison, created_at) VALUES
  ('30000000-0000-0000-0000-000000000001', 'CMD-2024-001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Assemblage mécanique A1', 50, 'en_attente', '2024-12-15', NOW() - INTERVAL '5 days'),
  ('30000000-0000-0000-0000-000000000002', 'CMD-2024-002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Support métallique B2', 25, 'en_cours', '2024-12-20', NOW() - INTERVAL '3 days'),
  ('30000000-0000-0000-0000-000000000003', 'CMD-2024-003', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Pièce usinée C3', 100, 'termine', '2024-11-30', NOW() - INTERVAL '10 days'),
  ('30000000-0000-0000-0000-000000000004', 'CMD-2024-004', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Châssis aluminium D4', 10, 'livre', '2024-11-25', NOW() - INTERVAL '15 days'),
  ('30000000-0000-0000-0000-000000000005', 'CMD-2024-005', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Boîtier électronique E5', 75, 'en_attente', '2024-12-25', NOW() - INTERVAL '2 days'),
  ('30000000-0000-0000-0000-000000000006', 'CMD-2024-006', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'Module de contrôle F6', 20, 'en_cours', '2024-12-30', NOW() - INTERVAL '1 day'),
  ('30000000-0000-0000-0000-000000000007', 'CMD-2024-007', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Kit de fixation G7', 200, 'en_attente', '2025-01-10', NOW()),
  ('30000000-0000-0000-0000-000000000008', 'CMD-2024-008', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Connecteur étanche H8', 150, 'en_attente', '2025-01-15', NOW())
ON CONFLICT (id) DO NOTHING;

-- Update created_by fields for profiles (admin creates other users)
UPDATE profiles 
SET created_by = '00000000-0000-0000-0000-000000000001' 
WHERE id != '00000000-0000-0000-0000-000000000001';

-- Display summary of inserted data
SELECT 'Profiles inserted' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Clients inserted', COUNT(*) FROM clients
UNION ALL
SELECT 'Stock items inserted', COUNT(*) FROM stock
UNION ALL
SELECT 'Orders inserted', COUNT(*) FROM commandes;