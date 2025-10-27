#!/usr/bin/env node

/**
 * Script automatisé pour créer les utilisateurs de test et insérer les données de seed
 * 
 * Usage:
 * 1. Assurez-vous d'avoir les variables d'environnement configurées
 * 2. npm install @supabase/supabase-js
 * 3. node supabase/setup-seed-data.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Clé service role nécessaire

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '❌')
  console.error('\nVeuillez configurer ces variables dans votre .env.local')
  process.exit(1)
}

// Client Supabase avec clé service role (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Utilisateurs de test à créer
const testUsers = [
  {
    email: 'admin@taskmanager.com',
    password: 'admin123!',
    role: 'admin',
    nom: 'Admin',
    prenom: 'System'
  },
  {
    email: 'commercial1@taskmanager.com',
    password: 'commercial123!',
    role: 'commercial',
    nom: 'Dupont',
    prenom: 'Jean'
  },
  {
    email: 'commercial2@taskmanager.com',
    password: 'commercial123!',
    role: 'commercial',
    nom: 'Martin',
    prenom: 'Marie'
  },
  {
    email: 'client1@taskmanager.com',
    password: 'client123!',
    role: 'client',
    nom: 'Durand',
    prenom: 'Pierre'
  },
  {
    email: 'client2@taskmanager.com',
    password: 'client123!',
    role: 'client',
    nom: 'Leroy',
    prenom: 'Sophie'
  },
  {
    email: 'client3@taskmanager.com',
    password: 'client123!',
    role: 'client',
    nom: 'Bernard',
    prenom: 'Luc'
  }
]

async function createTestUsers() {
  console.log('🚀 Création des utilisateurs de test...\n')
  
  const createdUsers = []
  
  for (const user of testUsers) {
    try {
      console.log(`Création de l'utilisateur: ${user.email}`)
      
      // Créer l'utilisateur dans auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          nom: user.nom,
          prenom: user.prenom
        }
      })
      
      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`  ⚠️  Utilisateur déjà existant: ${user.email}`)
          
          // Récupérer l'utilisateur existant
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers.users.find(u => u.email === user.email)
          
          if (existingUser) {
            createdUsers.push({ ...user, id: existingUser.id })
          }
        } else {
          console.error(`  ❌ Erreur création auth: ${authError.message}`)
        }
        continue
      }
      
      console.log(`  ✅ Utilisateur auth créé: ${authUser.user.id}`)
      
      // Créer ou mettre à jour le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.user.id,
          role: user.role,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          created_by: user.role === 'admin' ? null : createdUsers.find(u => u.role === 'admin')?.id || null
        })
      
      if (profileError) {
        console.error(`  ❌ Erreur création profil: ${profileError.message}`)
      } else {
        console.log(`  ✅ Profil créé avec rôle: ${user.role}`)
      }
      
      createdUsers.push({ ...user, id: authUser.user.id })
      
    } catch (error) {
      console.error(`❌ Erreur inattendue pour ${user.email}:`, error.message)
    }
  }
  
  return createdUsers
}

async function insertSeedData(users) {
  console.log('\n📊 Insertion des données de test...\n')
  
  const adminUser = users.find(u => u.role === 'admin')
  const commercial1 = users.find(u => u.email === 'commercial1@taskmanager.com')
  const commercial2 = users.find(u => u.email === 'commercial2@taskmanager.com')
  
  if (!adminUser || !commercial1 || !commercial2) {
    console.error('❌ Utilisateurs requis manquants pour les données de test')
    return
  }
  
  try {
    // Insérer les clients
    console.log('Insertion des clients...')
    const { error: clientsError } = await supabase
      .from('clients')
      .upsert([
        {
          id: 'c0000000-0000-0000-0000-000000000001',
          nom: 'Durand Pierre',
          entreprise: 'TechCorp SARL',
          commercial_id: commercial1.id,
          contact: 'client1@taskmanager.com'
        },
        {
          id: 'c0000000-0000-0000-0000-000000000002',
          nom: 'Leroy Sophie',
          entreprise: 'InnovSoft SAS',
          commercial_id: commercial1.id,
          contact: 'client2@taskmanager.com'
        },
        {
          id: 'c0000000-0000-0000-0000-000000000003',
          nom: 'Bernard Luc',
          entreprise: 'DesignPro EURL',
          commercial_id: commercial2.id,
          contact: 'client3@taskmanager.com'
        },
        {
          id: 'c0000000-0000-0000-0000-000000000004',
          nom: 'Moreau Anne',
          entreprise: 'WebAgency SA',
          commercial_id: commercial1.id,
          contact: 'anne.moreau@webagency.fr'
        },
        {
          id: 'c0000000-0000-0000-0000-000000000005',
          nom: 'Petit Thomas',
          entreprise: 'StartupXYZ',
          commercial_id: commercial2.id,
          contact: 'thomas@startupxyz.com'
        }
      ])
    
    if (clientsError) {
      console.error('❌ Erreur insertion clients:', clientsError.message)
    } else {
      console.log('✅ Clients insérés')
    }
    
    // Insérer le stock
    console.log('Insertion du stock...')
    const { error: stockError } = await supabase
      .from('stock')
      .upsert([
        { nom: 'Kakémono 80x200cm', quantite: 25, unite: 'unité' },
        { nom: 'Roll-up 85x200cm', quantite: 15, unite: 'unité' },
        { nom: 'Flyers A5', quantite: 5000, unite: 'unité' },
        { nom: 'Brochures A4', quantite: 2500, unite: 'unité' },
        { nom: 'Cartes de visite', quantite: 10000, unite: 'unité' },
        { nom: 'Banderoles 3x1m', quantite: 8, unite: 'unité' },
        { nom: 'Stickers personnalisés', quantite: 1500, unite: 'unité' },
        { nom: 'Totems publicitaires', quantite: 5, unite: 'unité' }
      ])
    
    if (stockError) {
      console.error('❌ Erreur insertion stock:', stockError.message)
    } else {
      console.log('✅ Stock inséré')
    }
    
    // Insérer les commandes
    console.log('Insertion des commandes...')
    const { error: commandesError } = await supabase
      .from('commandes')
      .upsert([
        {
          reference: 'CMD-2024-001',
          client_id: 'c0000000-0000-0000-0000-000000000001',
          commercial_id: commercial1.id,
          produit: 'Kakémono personnalisé 80x200cm',
          quantite: 5,
          statut: 'en_cours',
          date_livraison: '2024-11-15'
        },
        {
          reference: 'CMD-2024-002',
          client_id: 'c0000000-0000-0000-0000-000000000002',
          commercial_id: commercial1.id,
          produit: 'Roll-up avec visuel entreprise',
          quantite: 2,
          statut: 'termine',
          date_livraison: '2024-11-10'
        },
        {
          reference: 'CMD-2024-003',
          client_id: 'c0000000-0000-0000-0000-000000000003',
          commercial_id: commercial2.id,
          produit: 'Flyers A5 - 1000 exemplaires',
          quantite: 1000,
          statut: 'livre',
          date_livraison: '2024-11-05'
        },
        {
          reference: 'CMD-2024-004',
          client_id: 'c0000000-0000-0000-0000-000000000001',
          commercial_id: commercial1.id,
          produit: 'Brochures A4 - 500 exemplaires',
          quantite: 500,
          statut: 'en_attente',
          date_livraison: '2024-11-20'
        }
      ])
    
    if (commandesError) {
      console.error('❌ Erreur insertion commandes:', commandesError.message)
    } else {
      console.log('✅ Commandes insérées')
    }
    
  } catch (error) {
    console.error('❌ Erreur insertion données:', error.message)
  }
}

async function main() {
  console.log('🌱 Configuration des données de test pour TaskManager PLV\n')
  
  try {
    // Créer les utilisateurs
    const users = await createTestUsers()
    
    // Attendre un peu pour que les triggers se déclenchent
    console.log('\n⏳ Attente de la propagation des données...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Insérer les données de test
    await insertSeedData(users)
    
    console.log('\n🎉 Configuration terminée !')
    console.log('\n📋 Utilisateurs créés:')
    users.forEach(user => {
      console.log(`   ${user.role.padEnd(10)} | ${user.email.padEnd(30)} | ${user.password}`)
    })
    
    console.log('\n🔗 Vous pouvez maintenant vous connecter avec ces comptes sur:')
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/login`)
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
    process.exit(1)
  }
}

// Exécuter le script
if (require.main === module) {
  main()
}

module.exports = { createTestUsers, insertSeedData }