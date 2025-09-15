// Test de connexion Supabase via l'API REST
import { createClient } from '@supabase/supabase-js';

// Configuration depuis les variables d'environnement
const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔗 Test de connexion Supabase...\n');
  
  try {
    // 1. Test de base - récupérer les tables publiques
    console.log('1️⃣ Test de connexion de base...');
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return;
    }
    
    console.log('✅ Connexion réussie !');
    
    // 2. Vérifier les tables workout existantes
    console.log('\n2️⃣ Vérification des tables workout...');
    
    const tables = ['workout_sessions', 'workout_sets', 'workout_plans', 'session_metrics', 'exercises_library'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} lignes`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Erreur d'accès`);
      }
    }
    
    // 3. Tester la structure des colonnes workout_sessions
    console.log('\n3️⃣ Analyse des colonnes workout_sessions...');
    
    const { data: sessions, error: sessionsError } = await supabase
      .from('workout_sessions')
      .select('*')
      .limit(1);
    
    if (sessionsError) {
      console.log('❌ Impossible de lire workout_sessions:', sessionsError.message);
    } else if (sessions && sessions.length > 0) {
      console.log('✅ Colonnes disponibles:', Object.keys(sessions[0]).join(', '));
    } else {
      console.log('⚠️ Aucune donnée dans workout_sessions');
    }
    
    // 4. Tester la structure des colonnes workout_sets
    console.log('\n4️⃣ Analyse des colonnes workout_sets...');
    
    const { data: sets, error: setsError } = await supabase
      .from('workout_sets')
      .select('*')
      .limit(1);
    
    if (setsError) {
      console.log('❌ Impossible de lire workout_sets:', setsError.message);
    } else if (sets && sets.length > 0) {
      console.log('✅ Colonnes disponibles:', Object.keys(sets[0]).join(', '));
    } else {
      console.log('⚠️ Aucune donnée dans workout_sets');
    }
    
    // 5. Identifier les colonnes IA manquantes
    console.log('\n5️⃣ Vérification des colonnes IA...');
    
    const aiColumns = {
      workout_sessions: ['fatigue_level', 'performance_score', 'heart_rate_zone', 'auto_progress_weight', 'smart_rest_timers', 'real_time_coaching'],
      workout_sets: ['predicted_rpe', 'actual_vs_predicted_performance', 'set_start_time', 'set_end_time', 'is_dropset', 'is_failure']
    };
    
    for (const [table, expectedColumns] of Object.entries(aiColumns)) {
      console.log(`\n📊 Colonnes IA requises pour ${table}:`);
      
      const { data: testData, error: testError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (testData && testData.length > 0) {
        const existingColumns = Object.keys(testData[0]);
        
        expectedColumns.forEach(col => {
          if (existingColumns.includes(col)) {
            console.log(`   ✅ ${col} - EXISTE`);
          } else {
            console.log(`   ❌ ${col} - MANQUANTE`);
          }
        });
      }
    }
    
    console.log('\n🎉 Test terminé !');
    
  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le test
testSupabaseConnection();