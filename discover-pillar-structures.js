// Découverte de la structure détaillée des tables existantes
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverPillarStructures() {
  console.log('🔍 Découverte des structures existantes...\n');
  
  try {
    // 1. Structure MEALS (Nutrition)
    console.log('1️⃣ STRUCTURE MEALS (Nutrition):');
    
    const testMeal = {
      id: randomUUID(),
      user_id: randomUUID(),
      name: 'Test Structure Meal',
      created_at: new Date().toISOString()
    };
    
    const { data: mealData, error: mealError } = await supabase
      .from('meals')
      .insert(testMeal)
      .select();
    
    if (mealError) {
      console.log('❌ Erreur meals:', mealError.message);
      
      // Essayer structure étendue
      const extendedMeal = {
        id: randomUUID(),
        user_id: randomUUID(),
        name: 'Test Meal',
        meal_type: 'breakfast',
        calories: 500,
        created_at: new Date().toISOString()
      };
      
      const { data: mealData2, error: mealError2 } = await supabase
        .from('meals')
        .insert(extendedMeal)
        .select();
      
      if (mealError2) {
        console.log('❌ Erreur meals étendue:', mealError2.message);
      } else {
        console.log('✅ Structure meals découverte:', Object.keys(mealData2[0]));
      }
    } else {
      console.log('✅ Structure meals basique:', Object.keys(mealData[0]));
    }
    
    // 2. Structure SLEEP_SESSIONS (Sommeil)
    console.log('\n2️⃣ STRUCTURE SLEEP_SESSIONS (Sommeil):');
    
    const testSleep = {
      id: randomUUID(),
      user_id: randomUUID(),
      sleep_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    
    const { data: sleepData, error: sleepError } = await supabase
      .from('sleep_sessions')
      .insert(testSleep)
      .select();
    
    if (sleepError) {
      console.log('❌ Erreur sleep_sessions:', sleepError.message);
      
      // Essayer structure étendue
      const extendedSleep = {
        id: randomUUID(),
        user_id: randomUUID(),
        sleep_date: new Date().toISOString().split('T')[0],
        bedtime: '23:00:00',
        wake_time: '07:00:00',
        sleep_duration_minutes: 480,
        created_at: new Date().toISOString()
      };
      
      const { data: sleepData2, error: sleepError2 } = await supabase
        .from('sleep_sessions')
        .insert(extendedSleep)
        .select();
      
      if (sleepError2) {
        console.log('❌ Erreur sleep_sessions étendue:', sleepError2.message);
      } else {
        console.log('✅ Structure sleep_sessions découverte:', Object.keys(sleepData2[0]));
      }
    } else {
      console.log('✅ Structure sleep_sessions basique:', Object.keys(sleepData[0]));
    }
    
    // 3. Structure HYDRATION_LOGS (Hydratation)
    console.log('\n3️⃣ STRUCTURE HYDRATION_LOGS (Hydratation):');
    
    const testHydration = {
      id: randomUUID(),
      user_id: randomUUID(),
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    const { data: hydrationData, error: hydrationError } = await supabase
      .from('hydration_logs')
      .insert(testHydration)
      .select();
    
    if (hydrationError) {
      console.log('❌ Erreur hydration_logs:', hydrationError.message);
      
      // Essayer structure étendue
      const extendedHydration = {
        id: randomUUID(),
        user_id: randomUUID(),
        amount_ml: 250,
        drink_type: 'water',
        logged_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      const { data: hydrationData2, error: hydrationError2 } = await supabase
        .from('hydration_logs')
        .insert(extendedHydration)
        .select();
      
      if (hydrationError2) {
        console.log('❌ Erreur hydration_logs étendue:', hydrationError2.message);
      } else {
        console.log('✅ Structure hydration_logs découverte:', Object.keys(hydrationData2[0]));
      }
    } else {
      console.log('✅ Structure hydration_logs basique:', Object.keys(hydrationData[0]));
    }
    
    // 4. Analyser les colonnes manquantes pour l'IA
    console.log('\n4️⃣ COLONNES IA MANQUANTES:');
    
    const requiredColumns = {
      meals: [
        'calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g',
        'meal_quality_score', 'nutrition_ai_analysis', 'meal_timing_score',
        'dietary_adherence_score', 'ai_recommendations'
      ],
      sleep_sessions: [
        'sleep_duration_minutes', 'sleep_quality_score', 'deep_sleep_minutes',
        'rem_sleep_minutes', 'sleep_efficiency', 'bedtime_consistency_score',
        'sleep_ai_analysis', 'recovery_score', 'sleep_debt_minutes'
      ],
      hydration_logs: [
        'amount_ml', 'hydration_goal_ml', 'hydration_percentage',
        'drink_frequency_score', 'hydration_quality_score', 'electrolyte_balance',
        'hydration_ai_analysis', 'dehydration_risk_score'
      ]
    };
    
    // Tester l'existence des colonnes
    for (const [table, columns] of Object.entries(requiredColumns)) {
      console.log(`\n📊 ${table.toUpperCase()} - Colonnes IA:`)
      
      for (const col of columns) {
        try {
          const { error } = await supabase
            .from(table)
            .select(col)
            .limit(0);
          
          if (error) {
            console.log(`   ❌ ${col} - MANQUANTE`);
          } else {
            console.log(`   ✅ ${col} - EXISTE`);
          }
        } catch (err) {
          console.log(`   ❌ ${col} - MANQUANTE`);
        }
      }
    }
    
    console.log('\n🎯 CONCLUSION:');
    console.log('Nous devons créer un script de migration pour ajouter les colonnes IA');
    console.log('à chaque table (meals, sleep_sessions, hydration_logs)');
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

discoverPillarStructures();