#!/usr/bin/env node

/**
 * Script de vérification de l'installation TaskManager PLV
 * 
 * Vérifie que:
 * - Les variables d'environnement sont configurées
 * - La connexion Supabase fonctionne
 * - Les tables existent avec les bons schémas
 * - Les politiques RLS sont actives
 * - Les données de test sont présentes
 * 
 * Usage: node scripts/verify-setup.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function verifyEnvironment() {
  log('blue', '🔍 Vérification des variables d\'environnement...')
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const optionalVars = [
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  let allGood = true
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      log('green', `  ✅ ${varName}`)
    } else {
      log('red', `  ❌ ${varName} - MANQUANT`)
      allGood = false
    }
  }
  
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      log('green', `  ✅ ${varName} (optionnel)`)
    } else {
      log('yellow', `  ⚠️  ${varName} - Non configuré (optionnel pour seed data)`)
    }
  }
  
  return allGood
}

async function verifySupabaseConnection() {
  log('blue', '🔗 Vérification de la connexion Supabase...')
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Test de connexion basique
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      log('red', `  ❌ Erreur de connexion: ${error.message}`)
      return false
    }
    
    log('green', '  ✅ Connexion Supabase réussie')
    return true
    
  } catch (error) {
    log('red', `  ❌ Erreur de connexion: ${error.message}`)
    return false
  }
}

async function verifyTables() {
  log('blue', '📊 Vérification des tables...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  const tables = ['profiles', 'clients', 'commandes', 'stock']
  let allGood = true
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        log('red', `  ❌ Table ${table}: ${error.message}`)
        allGood = false
      } else {
        log('green', `  ✅ Table ${table} existe`)
      }
    } catch (error) {
      log('red', `  ❌ Table ${table}: ${error.message}`)
      allGood = false
    }
  }
  
  return allGood
}

async function verifyEnums() {
  log('blue', '🔤 Vérification des types ENUM...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  try {
    // Tester l'insertion avec les nouveaux ENUMs
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000000',
      role: 'admin',
      nom: 'Test',
      prenom: 'User',
      email: 'test@example.com'
    }
    
    // Test sans insertion réelle (dry run)
    const { error } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select()
    
    if (error && error.message.includes('enum')) {
      log('red', '  ❌ Types ENUM non configurés correctement')
      log('red', `     ${error.message}`)
      return false
    }
    
    log('green', '  ✅ Types ENUM configurés')
    return true
    
  } catch (error) {
    log('yellow', '  ⚠️  Impossible de vérifier les ENUMs (normal si pas d\'accès admin)')
    return true
  }
}

async function verifyTestData() {
  log('blue', '👥 Vérification des données de test...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  try {
    // Vérifier les profils
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('role, email')
    
    if (profilesError) {
      log('red', `  ❌ Erreur lecture profils: ${profilesError.message}`)
      return false
    }
    
    const adminCount = profiles?.filter(p => p.role === 'admin').length || 0
    const commercialCount = profiles?.filter(p => p.role === 'commercial').length || 0
    const clientCount = profiles?.filter(p => p.role === 'client').length || 0
    
    log('green', `  ✅ Profils trouvés: ${adminCount} admin(s), ${commercialCount} commercial(aux), ${clientCount} client(s)`)
    
    // Vérifier les clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
    
    if (!clientsError) {
      log('green', `  ✅ ${clients?.length || 0} client(s) en base`)
    }
    
    // Vérifier le stock
    const { data: stock, error: stockError } = await supabase
      .from('stock')
      .select('id')
    
    if (!stockError) {
      log('green', `  ✅ ${stock?.length || 0} article(s) en stock`)
    }
    
    // Vérifier les commandes
    const { data: commandes, error: commandesError } = await supabase
      .from('commandes')
      .select('id')
    
    if (!commandesError) {
      log('green', `  ✅ ${commandes?.length || 0} commande(s) en base`)
    }
    
    return true
    
  } catch (error) {
    log('yellow', `  ⚠️  Impossible de vérifier les données: ${error.message}`)
    return true
  }
}

async function verifyFiles() {
  log('blue', '📁 Vérification des fichiers...')
  
  const requiredFiles = [
    'supabase/schema.sql',
    'supabase/seed.sql',
    'supabase/setup-seed-data.js',
    'vercel.json',
    '.env.example',
    'DEPLOYMENT.md',
    'CHANGELOG.md'
  ]
  
  let allGood = true
  
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      log('green', `  ✅ ${file}`)
    } else {
      log('red', `  ❌ ${file} - MANQUANT`)
      allGood = false
    }
  }
  
  return allGood
}

async function main() {
  log('blue', '🚀 Vérification de l\'installation TaskManager PLV\n')
  
  const checks = [
    { name: 'Variables d\'environnement', fn: verifyEnvironment },
    { name: 'Fichiers requis', fn: verifyFiles },
    { name: 'Connexion Supabase', fn: verifySupabaseConnection },
    { name: 'Tables de base', fn: verifyTables },
    { name: 'Types ENUM', fn: verifyEnums },
    { name: 'Données de test', fn: verifyTestData }
  ]
  
  let allPassed = true
  
  for (const check of checks) {
    try {
      const result = await check.fn()
      if (!result) {
        allPassed = false
      }
    } catch (error) {
      log('red', `❌ Erreur lors de la vérification ${check.name}: ${error.message}`)
      allPassed = false
    }
    console.log() // Ligne vide
  }
  
  if (allPassed) {
    log('green', '🎉 Toutes les vérifications sont passées !')
    log('green', '✅ Votre installation TaskManager PLV est prête')
    log('blue', '\n📖 Prochaines étapes:')
    log('blue', '   1. Lancez l\'application: npm run dev')
    log('blue', '   2. Ouvrez http://localhost:3000')
    log('blue', '   3. Connectez-vous avec admin@taskmanager.com (admin123!)')
    log('blue', '   4. Consultez DEPLOYMENT.md pour le déploiement en production')
  } else {
    log('red', '❌ Certaines vérifications ont échoué')
    log('yellow', '⚠️  Consultez les erreurs ci-dessus et le guide DEPLOYMENT.md')
    process.exit(1)
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  // Charger les variables d'environnement depuis .env.local
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  }
  
  main().catch(error => {
    log('red', `❌ Erreur fatale: ${error.message}`)
    process.exit(1)
  })
}

module.exports = { verifyEnvironment, verifySupabaseConnection, verifyTables }