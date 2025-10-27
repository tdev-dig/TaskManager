#!/usr/bin/env node

/**
 * Script de vérification de la configuration TaskManager PLV
 * Vérifie que toutes les variables d'environnement et dépendances sont correctement configurées
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration TaskManager PLV...\n');

let hasErrors = false;

// Vérifier les variables d'environnement
console.log('📋 Variables d\'environnement:');

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local manquant');
  console.log('   Copiez .env.example vers .env.local et remplissez les valeurs');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  for (const varName of requiredVars) {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your-`)) {
      console.log(`✅ ${varName} configuré`);
    } else {
      console.log(`❌ ${varName} manquant ou non configuré`);
      hasErrors = true;
    }
  }
}

// Vérifier les fichiers essentiels
console.log('\n📁 Fichiers essentiels:');

const essentialFiles = [
  'supabase/schema.sql',
  'supabase/seed.sql',
  'supabase/README_SEED.md',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'lib/auth.ts'
];

for (const file of essentialFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} manquant`);
    hasErrors = true;
  }
}

// Vérifier package.json
console.log('\n📦 Dépendances:');

const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = [
    '@supabase/supabase-js',
    '@supabase/ssr',
    'next',
    'react',
    'react-dom'
  ];
  
  for (const dep of requiredDeps) {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} manquant`);
      hasErrors = true;
    }
  }
} else {
  console.log('❌ package.json manquant');
  hasErrors = true;
}

// Résumé
console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Configuration incomplète');
  console.log('\n📖 Consultez DEPLOYMENT.md pour les instructions complètes');
  console.log('📖 Consultez supabase/README_SEED.md pour les données de test');
  process.exit(1);
} else {
  console.log('✅ Configuration complète!');
  console.log('\n🚀 Vous pouvez maintenant lancer l\'application avec: npm run dev');
  console.log('🌐 Ou déployer sur Vercel avec: vercel --prod');
}