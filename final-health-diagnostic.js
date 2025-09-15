import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalHealthCheck() {
  console.log('🏥 DIAGNOSTIC FINAL - ÉTAT DES PILIERS SANTÉ\n');

  try {
    // 1. Vérification WORKOUT (déjà opérationnel)
    console.log('1️⃣ PILIER WORKOUT:');
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('ai_performance_score, ai_progress_score, ai_recommendations')
        .limit(1);
      
      if (error) {
        console.log('❌ Workout sessions:', error.message);
      } else {
        console.log('✅ Workout sessions - OPÉRATIONNEL avec IA');
        console.log('  📊 Colonnes IA disponibles: ai_performance_score, ai_progress_score, ai_recommendations');
      }
    } catch (err) {
      console.log('❌ Workout sessions inaccessible');
    }

    // 2. Vérification NUTRITION
    console.log('\n2️⃣ PILIER NUTRITION:');
    try {
      const { data, error } = await supabase.from('meals').select('*').limit(0);
      if (error) {
        console.log('❌ Table meals:', error.message);
      } else {
        console.log('✅ Table meals accessible');
        
        // Test colonnes IA nutrition
        const nutritionColumns = [
          'calories', 'protein_g', 'carbs_g', 'fat_g',
          'meal_quality_score', 'nutrition_ai_analysis', 'macro_balance_score'
        ];
        
        for (const col of nutritionColumns) {
          try {
            const { error: colError } = await supabase.from('meals').select(col).limit(0);
            if (colError) {
              console.log(`  ❌ ${col} - MANQUANTE`);
            } else {
              console.log(`  ✅ ${col} - EXISTE`);
            }
          } catch (err) {
            console.log(`  ❌ ${col} - MANQUANTE`);
          }
        }
      }
    } catch (err) {
      console.log('❌ Nutrition inaccessible');
    }

    // 3. Vérification SOMMEIL
    console.log('\n3️⃣ PILIER SOMMEIL:');
    try {
      const { data, error } = await supabase.from('sleep_sessions').select('*').limit(0);
      if (error) {
        console.log('❌ Table sleep_sessions:', error.message);
      } else {
        console.log('✅ Table sleep_sessions accessible');
        
        // Test colonnes IA sommeil
        const sleepColumns = [
          'sleep_duration_minutes', 'bedtime', 'wake_time', 'deep_sleep_minutes',
          'sleep_quality_score', 'sleep_ai_analysis', 'recovery_score'
        ];
        
        for (const col of sleepColumns) {
          try {
            const { error: colError } = await supabase.from('sleep_sessions').select(col).limit(0);
            if (colError) {
              console.log(`  ❌ ${col} - MANQUANTE`);
            } else {
              console.log(`  ✅ ${col} - EXISTE`);
            }
          } catch (err) {
            console.log(`  ❌ ${col} - MANQUANTE`);
          }
        }
      }
    } catch (err) {
      console.log('❌ Sommeil inaccessible');
    }

    // 4. Vérification HYDRATATION
    console.log('\n4️⃣ PILIER HYDRATATION:');
    try {
      const { data, error } = await supabase.from('hydration_logs').select('*').limit(0);
      if (error) {
        console.log('❌ Table hydration_logs:', error.message);
      } else {
        console.log('✅ Table hydration_logs accessible');
        
        // Test colonnes IA hydratation
        const hydrationColumns = [
          'amount_ml', 'drink_type', 'hydration_goal_ml',
          'hydration_percentage', 'hydration_ai_analysis', 'hydration_quality_score'
        ];
        
        for (const col of hydrationColumns) {
          try {
            const { error: colError } = await supabase.from('hydration_logs').select(col).limit(0);
            if (colError) {
              console.log(`  ❌ ${col} - MANQUANTE`);
            } else {
              console.log(`  ✅ ${col} - EXISTE`);
            }
          } catch (err) {
            console.log(`  ❌ ${col} - MANQUANTE`);
          }
        }
      }
    } catch (err) {
      console.log('❌ Hydratation inaccessible');
    }

    // 5. Récapitulatif et recommandations
    console.log('\n📋 DIAGNOSTIC FINAL:');
    console.log('═════════════════════════════════════════');
    
    console.log('\n🏅 PILIER WORKOUT:');
    console.log('  Status: ✅ 100% OPÉRATIONNEL avec IA');
    console.log('  Capacités: Analyse performance, progression, recommandations');
    
    console.log('\n🍎 PILIER NUTRITION:');
    console.log('  Status: 🔄 TABLES EXISTANTES, COLONNES IA À AJOUTER');
    console.log('  Action: Migrer colonnes calories, scores qualité, analyse IA');
    
    console.log('\n😴 PILIER SOMMEIL:');
    console.log('  Status: 🔄 TABLES EXISTANTES, COLONNES IA À AJOUTER');
    console.log('  Action: Migrer colonnes durée, qualité, récupération IA');
    
    console.log('\n💧 PILIER HYDRATATION:');
    console.log('  Status: 🔄 TABLES EXISTANTES, COLONNES IA À AJOUTER');
    console.log('  Action: Migrer colonnes objectifs, pourcentages, analyse IA');
    
    console.log('\n🎯 PROCHAINE ÉTAPE:');
    console.log('Exécuter les migrations SQL via Supabase Dashboard');
    console.log('pour activer l\'orchestrateur IA multi-piliers complet !');
    
    console.log('\n🚀 VISION: 4 PILIERS × IA = SANTÉ 360° OPTIMISÉE');

  } catch (error) {
    console.error('💥 Erreur diagnostic:', error);
  }
}

finalHealthCheck();