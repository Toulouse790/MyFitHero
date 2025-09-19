#!/usr/bin/env node
/**
 * Script de test pour vérifier la validation stricte des variables Supabase
 */

console.log('🧪 Test de validation des variables d\'environnement Supabase\n');

// Test 1: Variables manquantes
console.log('Test 1: Variables d\'environnement manquantes');
try {
  // Simuler l'absence de variables
  process.env.VITE_SUPABASE_URL = undefined;
  process.env.VITE_SUPABASE_ANON_KEY = undefined;
  
  // Note: Ce test ne peut pas être exécuté directement car import.meta.env
  // n'est disponible que dans le contexte Vite
  console.log('❌ Ce test nécessite un environnement Vite pour être exécuté');
} catch (error) {
  console.log('✅ Erreur capturée comme attendu:', error.message);
}

// Test 2: Variables avec valeurs factices
console.log('\nTest 2: Variables avec valeurs factices');
console.log('❌ Devrait échouer avec: https://your-project.supabase.co');
console.log('❌ Devrait échouer avec: your-anon-key');

// Test 3: Variables valides
console.log('\nTest 3: Variables valides');
console.log('✅ Devrait réussir avec les vraies valeurs du .env');

console.log('\n📝 Note: Pour tester complètement, il faut:');
console.log('1. Modifier temporairement le .env');
console.log('2. Démarrer l\'application avec npm run dev');
console.log('3. Observer si l\'application refuse de démarrer');