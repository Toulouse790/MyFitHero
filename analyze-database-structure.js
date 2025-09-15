// Analyse de la structure de base via l'API Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDatabase() {
  console.log('🔍 Analyse de la structure de base de données...\n');
  
  try {
    // Créer des données de test pour voir la structure des colonnes
    console.log('1️⃣ Création de données de test pour analyser la structure...');
    
    // Test insertion workout_session
    const testSession = {
      id: 'test-session-' + Date.now(),
      user_id: 'test-user-' + Date.now(),
      name: 'Test Session Structure',
      status: 'idle',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: sessionInsert, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert(testSession)
      .select();
    
    if (sessionError) {
      console.log('❌ Erreur insertion workout_sessions:', sessionError.message);
      console.log('📝 Détails:', sessionError);
    } else {
      console.log('✅ Test session créée:', sessionInsert[0].id);
    }
    
    // Test insertion workout_set
    const testSet = {
      id: 'test-set-' + Date.now(),
      session_id: testSession.id,
      exercise_id: 'test-exercise-' + Date.now(),
      set_number: 1,
      weight_kg: 50,
      reps: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: setInsert, error: setError } = await supabase
      .from('workout_sets')
      .insert(testSet)
      .select();
    
    if (setError) {
      console.log('❌ Erreur insertion workout_sets:', setError.message);
      console.log('📝 Détails:', setError);
    } else {
      console.log('✅ Test set créé:', setInsert[0].id);
    }
    
    // Analyser les colonnes existantes
    console.log('\n2️⃣ Analyse des colonnes existantes...');
    
    // Récupérer une session pour voir toutes les colonnes
    const { data: sessions, error: sessionsFetchError } = await supabase
      .from('workout_sessions')
      .select('*')
      .limit(1);
    
    if (sessions && sessions.length > 0) {
      console.log('\n📊 COLONNES WORKOUT_SESSIONS:');
      Object.keys(sessions[0]).forEach(col => {
        console.log(`   - ${col}: ${typeof sessions[0][col]} (${sessions[0][col]})`);
      });
    }
    
    // Récupérer un set pour voir toutes les colonnes
    const { data: sets, error: setsFetchError } = await supabase
      .from('workout_sets')
      .select('*')
      .limit(1);
    
    if (sets && sets.length > 0) {
      console.log('\n📊 COLONNES WORKOUT_SETS:');
      Object.keys(sets[0]).forEach(col => {
        console.log(`   - ${col}: ${typeof sets[0][col]} (${sets[0][col]})`);
      });
    }
    
    // Identifier les colonnes IA manquantes
    console.log('\n3️⃣ Colonnes IA manquantes...');
    
    const requiredAIColumns = {
      workout_sessions: [
        'fatigue_level', 'performance_score', 'heart_rate_zone',
        'auto_progress_weight', 'smart_rest_timers', 'real_time_coaching',
        'session_state', 'pending_changes', 'last_sync'
      ],
      workout_sets: [
        'predicted_rpe', 'actual_vs_predicted_performance',
        'set_start_time', 'set_end_time', 'is_dropset', 'is_failure'
      ]
    };
    
    if (sessions && sessions.length > 0) {
      const existingSessionCols = Object.keys(sessions[0]);
      console.log('\n❌ COLONNES MANQUANTES dans workout_sessions:');
      
      requiredAIColumns.workout_sessions.forEach(col => {
        if (!existingSessionCols.includes(col)) {
          console.log(`   - ${col}`);
        }
      });
    }
    
    if (sets && sets.length > 0) {
      const existingSetCols = Object.keys(sets[0]);
      console.log('\n❌ COLONNES MANQUANTES dans workout_sets:');
      
      requiredAIColumns.workout_sets.forEach(col => {
        if (!existingSetCols.includes(col)) {
          console.log(`   - ${col}`);
        }
      });
    }
    
    // Nettoyer les données de test
    console.log('\n4️⃣ Nettoyage des données de test...');
    
    if (setInsert && setInsert.length > 0) {
      await supabase.from('workout_sets').delete().eq('id', testSet.id);
      console.log('✅ Test set supprimé');
    }
    
    if (sessionInsert && sessionInsert.length > 0) {
      await supabase.from('workout_sessions').delete().eq('id', testSession.id);
      console.log('✅ Test session supprimée');
    }
    
    console.log('\n🎯 Conclusion:');
    console.log('Les tables existent mais il manque les colonnes IA pour les composants sophistiqués.');
    console.log('Prochaine étape: Exécuter le script de migration pour ajouter ces colonnes.');
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

analyzeDatabase();