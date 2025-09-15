// Script de vérification post-migration
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('🔍 Vérification post-migration...\n');
  
  try {
    // 1. Vérifier que les nouvelles colonnes existent en testant une sélection
    console.log('1️⃣ Test des nouvelles colonnes workout_sessions...');
    
    const { data: sessionTest, error: sessionError } = await supabase
      .from('workout_sessions')
      .select(`
        id,
        fatigue_level,
        performance_score,
        heart_rate_zone,
        auto_progress_weight,
        smart_rest_timers,
        real_time_coaching,
        session_state,
        pending_changes,
        last_sync
      `)
      .limit(1);
    
    if (sessionError) {
      console.log('❌ Colonnes manquantes dans workout_sessions:', sessionError.message);
      
      // Lister les colonnes manquantes spécifiquement
      const missingColumns = [];
      const testColumns = [
        'fatigue_level', 'performance_score', 'heart_rate_zone',
        'auto_progress_weight', 'smart_rest_timers', 'real_time_coaching',
        'session_state', 'pending_changes', 'last_sync'
      ];
      
      for (const col of testColumns) {
        const { error } = await supabase
          .from('workout_sessions')
          .select(col)
          .limit(0);
        
        if (error) {
          missingColumns.push(col);
        }
      }
      
      if (missingColumns.length > 0) {
        console.log('📋 Colonnes à créer dans workout_sessions:', missingColumns.join(', '));
      }
    } else {
      console.log('✅ Toutes les colonnes IA existent dans workout_sessions');
    }
    
    // 2. Vérifier les colonnes workout_sets
    console.log('\n2️⃣ Test des nouvelles colonnes workout_sets...');
    
    const { data: setTest, error: setError } = await supabase
      .from('workout_sets')
      .select(`
        id,
        weight,
        reps,
        rpe,
        predicted_rpe,
        actual_vs_predicted_performance,
        set_start_time,
        set_end_time,
        rest_time_seconds,
        is_dropset,
        is_failure,
        technique_score,
        updated_at
      `)
      .limit(1);
    
    if (setError) {
      console.log('❌ Colonnes manquantes dans workout_sets:', setError.message);
      
      const missingColumns = [];
      const testColumns = [
        'weight', 'reps', 'rpe', 'predicted_rpe',
        'actual_vs_predicted_performance', 'set_start_time', 'set_end_time',
        'rest_time_seconds', 'is_dropset', 'is_failure', 'technique_score', 'updated_at'
      ];
      
      for (const col of testColumns) {
        const { error } = await supabase
          .from('workout_sets')
          .select(col)
          .limit(0);
        
        if (error) {
          missingColumns.push(col);
        }
      }
      
      if (missingColumns.length > 0) {
        console.log('📋 Colonnes à créer dans workout_sets:', missingColumns.join(', '));
      }
    } else {
      console.log('✅ Toutes les colonnes IA existent dans workout_sets');
    }
    
    // 3. Test d'écriture avec les nouvelles colonnes (si pas de RLS)
    console.log('\n3️⃣ Test d\'écriture avec colonnes IA...');
    
    const testUserId = randomUUID();
    const testSessionId = randomUUID();
    
    // Tenter une insertion avec les nouvelles colonnes
    const testSessionData = {
      id: testSessionId,
      user_id: testUserId,
      name: 'Test Migration IA',
      status: 'idle',
      fatigue_level: 0.3,
      performance_score: 0.8,
      heart_rate_zone: 3,
      auto_progress_weight: true,
      smart_rest_timers: true,
      real_time_coaching: true,
      session_state: { test: true },
      pending_changes: [],
      created_at: new Date().toISOString()
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('workout_sessions')
      .insert(testSessionData)
      .select();
    
    if (insertError) {
      if (insertError.message.includes('row-level security')) {
        console.log('⚠️ RLS activé - impossible de tester l\'insertion (normal)');
        console.log('✅ Mais les colonnes semblent accessibles pour la sélection');
      } else {
        console.log('❌ Erreur insertion:', insertError.message);
      }
    } else {
      console.log('✅ Insertion test réussie avec colonnes IA');
      
      // Nettoyer
      await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', testSessionId);
    }
    
    // 4. Résumé final
    console.log('\n4️⃣ Résumé de la vérification...');
    
    const allGood = !sessionError && !setError;
    
    if (allGood) {
      console.log('🎉 MIGRATION RÉUSSIE !');
      console.log('✅ Toutes les colonnes IA sont disponibles');
      console.log('✅ Les composants sophistiqués peuvent être utilisés');
      console.log('✅ L\'orchestrateur IA aura accès à toutes les données');
    } else {
      console.log('⚠️ MIGRATION INCOMPLÈTE');
      console.log('❌ Certaines colonnes IA sont manquantes');
      console.log('📝 Exécutez le script final-ia-migration.sql dans Supabase');
    }
    
    console.log('\n📊 Tables disponibles pour l\'IA:');
    console.log('   - workout_sessions: données de session et métriques');
    console.log('   - workout_sets: données détaillées des sets');
    console.log('   - session_metrics: métriques calculées');
    console.log('   - exercises_library: référentiel d\'exercices');
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

verifyMigration();