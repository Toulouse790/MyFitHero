// Analyse des tables nutrition, sommeil et hydratation pour l'IA
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeNutritionSleepHydration() {
  console.log('🔍 Analyse des tables nutrition, sommeil et hydratation...\n');
  
  try {
    // Tables potentielles pour chaque pilier
    const nutritionTables = [
      'meals', 'nutrition_logs', 'food_items', 'nutrition_entries', 
      'meal_plans', 'recipes', 'ingredients', 'nutrition_tracking'
    ];
    
    const sleepTables = [
      'sleep_sessions', 'sleep_logs', 'sleep_tracking', 'sleep_data',
      'sleep_metrics', 'sleep_quality', 'sleep_analysis'
    ];
    
    const hydrationTables = [
      'hydration_logs', 'hydration_tracking', 'water_intake', 'hydration_entries',
      'hydration_data', 'drink_logs', 'fluid_intake'
    ];
    
    // 1. Tester toutes les tables de nutrition
    console.log('1️⃣ NUTRITION - Tables disponibles:');
    for (const table of nutritionTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`✅ ${table}: ${count} lignes`);
          
          // Analyser la structure de la première table trouvée
          if (count >= 0) {
            const { data, error: structError } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (!structError && data) {
              if (data.length > 0) {
                console.log(`   📋 Colonnes: ${Object.keys(data[0]).join(', ')}`);
              } else {
                console.log(`   📋 Table vide, analysons la structure...`);
              }
            }
          }
        }
      } catch (err) {
        // Table n'existe pas
      }
    }
    
    // 2. Tester toutes les tables de sommeil
    console.log('\n2️⃣ SOMMEIL - Tables disponibles:');
    for (const table of sleepTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`✅ ${table}: ${count} lignes`);
          
          if (count >= 0) {
            const { data, error: structError } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (!structError && data) {
              if (data.length > 0) {
                console.log(`   📋 Colonnes: ${Object.keys(data[0]).join(', ')}`);
              } else {
                console.log(`   📋 Table vide, analysons la structure...`);
              }
            }
          }
        }
      } catch (err) {
        // Table n'existe pas
      }
    }
    
    // 3. Tester toutes les tables d'hydratation
    console.log('\n3️⃣ HYDRATATION - Tables disponibles:');
    for (const table of hydrationTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`✅ ${table}: ${count} lignes`);
          
          if (count >= 0) {
            const { data, error: structError } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (!structError && data) {
              if (data.length > 0) {
                console.log(`   📋 Colonnes: ${Object.keys(data[0]).join(', ')}`);
              } else {
                console.log(`   📋 Table vide, analysons la structure...`);
              }
            }
          }
        }
      } catch (err) {
        // Table n'existe pas
      }
    }
    
    // 4. Chercher des tables génériques qui pourraient contenir ces données
    console.log('\n4️⃣ TABLES GÉNÉRIQUES - Recherche...');
    const genericTables = [
      'user_data', 'health_metrics', 'daily_logs', 'tracking_data',
      'health_data', 'wellness_data', 'lifestyle_data', 'biometrics'
    ];
    
    for (const table of genericTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`✅ ${table}: ${count} lignes (peut contenir nutrition/sommeil/hydratation)`);
          
          const { data, error: structError } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (!structError && data && data.length > 0) {
            console.log(`   📋 Colonnes: ${Object.keys(data[0]).join(', ')}`);
          }
        }
      } catch (err) {
        // Table n'existe pas
      }
    }
    
    // 5. Identifier les colonnes IA nécessaires pour chaque pilier
    console.log('\n5️⃣ COLONNES IA NÉCESSAIRES:');
    
    console.log('\n🍎 NUTRITION - Colonnes IA recommandées:');
    const nutritionAIColumns = [
      'calories_consumed', 'macros_protein', 'macros_carbs', 'macros_fat',
      'meal_quality_score', 'nutrition_ai_analysis', 'meal_timing_score',
      'hydration_linked', 'dietary_adherence_score', 'ai_recommendations'
    ];
    nutritionAIColumns.forEach(col => console.log(`   - ${col}`));
    
    console.log('\n😴 SOMMEIL - Colonnes IA recommandées:');
    const sleepAIColumns = [
      'sleep_duration_minutes', 'sleep_quality_score', 'deep_sleep_minutes',
      'rem_sleep_minutes', 'sleep_efficiency', 'bedtime_consistency_score',
      'sleep_ai_analysis', 'recovery_score', 'sleep_debt_minutes'
    ];
    sleepAIColumns.forEach(col => console.log(`   - ${col}`));
    
    console.log('\n💧 HYDRATATION - Colonnes IA recommandées:');
    const hydrationAIColumns = [
      'water_intake_ml', 'hydration_goal_ml', 'hydration_percentage',
      'drink_frequency_score', 'hydration_quality_score', 'electrolyte_balance',
      'hydration_ai_analysis', 'dehydration_risk_score'
    ];
    hydrationAIColumns.forEach(col => console.log(`   - ${col}`));
    
    console.log('\n📊 RÉSUMÉ POUR IA:');
    console.log('L\'orchestrateur IA aura besoin d\'accès à ces 3 piliers pour:');
    console.log('- Analyser les corrélations entre nutrition/sommeil/hydratation/workout');
    console.log('- Fournir des recommandations holistiques');
    console.log('- Optimiser la récupération et la performance');
    console.log('- Détecter les patterns et anomalies');
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

analyzeNutritionSleepHydration();