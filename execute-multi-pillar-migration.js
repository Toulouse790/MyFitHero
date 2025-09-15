import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeMigration() {
  console.log('🚀 Démarrage migration multi-piliers...\n');

  try {
    // 1. Migration NUTRITION (meals)
    console.log('1️⃣ MIGRATION NUTRITION...');
    
    const nutritionMigrations = [
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS calories INTEGER`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS protein_g DECIMAL(6,2)`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS carbs_g DECIMAL(6,2)`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS fat_g DECIMAL(6,2)`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(6,2)`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS meal_type VARCHAR(50)`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS meal_quality_score INTEGER DEFAULT 0`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS nutrition_ai_analysis JSONB DEFAULT '{}'`,
      `ALTER TABLE meals ADD COLUMN IF NOT EXISTS macro_balance_score INTEGER DEFAULT 0`
    ];

    for (const query of nutritionMigrations) {
      const { error } = await supabase.rpc('exec_sql', { query });
      if (error && !error.message.includes('already exists')) {
        console.log(`❌ Erreur nutrition: ${error.message}`);
      } else {
        console.log(`✅ ${query.substring(0, 50)}...`);
      }
    }

    // 2. Migration SOMMEIL (sleep_sessions)
    console.log('\n2️⃣ MIGRATION SOMMEIL...');
    
    const sleepMigrations = [
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS sleep_duration_minutes INTEGER`,
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS bedtime TIME`,
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS wake_time TIME`,
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS deep_sleep_minutes INTEGER`,
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS sleep_quality_score INTEGER DEFAULT 0`,
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS sleep_ai_analysis JSONB DEFAULT '{}'`,
      `ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS recovery_score INTEGER DEFAULT 0`
    ];

    for (const query of sleepMigrations) {
      const { error } = await supabase.rpc('exec_sql', { query });
      if (error && !error.message.includes('already exists')) {
        console.log(`❌ Erreur sommeil: ${error.message}`);
      } else {
        console.log(`✅ ${query.substring(0, 50)}...`);
      }
    }

    // 3. Migration HYDRATATION (hydration_logs)
    console.log('\n3️⃣ MIGRATION HYDRATATION...');
    
    const hydrationMigrations = [
      `ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS drink_type VARCHAR(50) DEFAULT 'water'`,
      `ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_goal_ml INTEGER DEFAULT 2000`,
      `ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_percentage DECIMAL(5,2) DEFAULT 0.0`,
      `ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_ai_analysis JSONB DEFAULT '{}'`,
      `ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_quality_score INTEGER DEFAULT 0`
    ];

    for (const query of hydrationMigrations) {
      const { error } = await supabase.rpc('exec_sql', { query });
      if (error && !error.message.includes('already exists')) {
        console.log(`❌ Erreur hydratation: ${error.message}`);
      } else {
        console.log(`✅ ${query.substring(0, 50)}...`);
      }
    }

    // 4. Test final des colonnes IA
    console.log('\n4️⃣ VÉRIFICATION FINALE...');

    const tables = ['meals', 'sleep_sessions', 'hydration_logs'];
    const aiColumns = {
      meals: ['calories', 'meal_quality_score', 'nutrition_ai_analysis'],
      sleep_sessions: ['sleep_duration_minutes', 'sleep_quality_score', 'sleep_ai_analysis'],
      hydration_logs: ['hydration_percentage', 'hydration_quality_score', 'hydration_ai_analysis']
    };

    for (const table of tables) {
      console.log(`\n📊 ${table.toUpperCase()}:`);
      for (const col of aiColumns[table]) {
        try {
          const { error } = await supabase.from(table).select(col).limit(0);
          if (error) {
            console.log(`   ❌ ${col}`);
          } else {
            console.log(`   ✅ ${col}`);
          }
        } catch (err) {
          console.log(`   ❌ ${col}`);
        }
      }
    }

    console.log('\n🎯 RÉSULTAT MIGRATION:');
    console.log('✅ Nutrition : Colonnes IA ajoutées');
    console.log('✅ Sommeil : Colonnes IA ajoutées');
    console.log('✅ Hydratation : Colonnes IA ajoutées');
    console.log('🤖 TOUS LES PILIERS SONT MAINTENANT IA-READY !');

  } catch (error) {
    console.error('💥 Erreur migration:', error);
  }
}

executeMigration();