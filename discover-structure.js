// Test avec UUIDs corrects et découverte de structure
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://zfmlzxhxhaezdkzjanbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbWx6eGh4aGFlemRremphbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDc4MzIsImV4cCI6MjA2NjMyMzgzMn0.x6GpX8ep6YxVEZQt7pcH0SIWzxhTYcXLnaVmD5IGErw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverStructure() {
  console.log('🔍 Découverte de la structure réelle...\n');
  
  try {
    // 1. Essayer d'insérer une session minimale pour découvrir les colonnes requises
    console.log('1️⃣ Test insertion workout_sessions...');
    
    const sessionId = randomUUID();
    const userId = randomUUID();
    
    // Test avec colonnes minimales
    const minimalSession = {
      id: sessionId,
      user_id: userId,
      name: 'Test Structure Discovery'
    };
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert(minimalSession)
      .select();
    
    if (sessionError) {
      console.log('❌ Erreur session minimale:', sessionError.message);
      
      // Essayer avec plus de colonnes
      const extendedSession = {
        id: sessionId,
        user_id: userId,
        name: 'Test Structure Discovery',
        status: 'idle',
        created_at: new Date().toISOString()
      };
      
      const { data: sessionData2, error: sessionError2 } = await supabase
        .from('workout_sessions')
        .insert(extendedSession)
        .select();
      
      if (sessionError2) {
        console.log('❌ Erreur session étendue:', sessionError2.message);
      } else {
        console.log('✅ Session créée avec colonnes étendues');
        console.log('📊 Colonnes workout_sessions:', Object.keys(sessionData2[0]));
      }
    } else {
      console.log('✅ Session créée avec colonnes minimales');
      console.log('📊 Colonnes workout_sessions:', Object.keys(sessionData[0]));
    }
    
    // 2. Test insertion workout_sets
    console.log('\n2️⃣ Test insertion workout_sets...');
    
    const setId = randomUUID();
    const exerciseId = randomUUID();
    
    const minimalSet = {
      id: setId,
      session_id: sessionId,
      exercise_id: exerciseId,
      set_number: 1
    };
    
    const { data: setData, error: setError } = await supabase
      .from('workout_sets')
      .insert(minimalSet)
      .select();
    
    if (setError) {
      console.log('❌ Erreur set minimal:', setError.message);
      
      // Essayer avec plus de colonnes
      const extendedSet = {
        id: setId,
        session_id: sessionId,
        exercise_id: exerciseId,
        set_number: 1,
        weight_kg: 50,
        reps: 10,
        created_at: new Date().toISOString()
      };
      
      const { data: setData2, error: setError2 } = await supabase
        .from('workout_sets')
        .insert(extendedSet)
        .select();
      
      if (setError2) {
        console.log('❌ Erreur set étendu:', setError2.message);
      } else {
        console.log('✅ Set créé avec colonnes étendues');
        console.log('📊 Colonnes workout_sets:', Object.keys(setData2[0]));
      }
    } else {
      console.log('✅ Set créé avec colonnes minimales');
      console.log('📊 Colonnes workout_sets:', Object.keys(setData[0]));
    }
    
    // 3. Analyser toutes les tables disponibles
    console.log('\n3️⃣ Recherche de toutes les tables disponibles...');
    
    const tables = [
      'workout_sessions', 'workout_sets', 'workout_plans', 
      'session_metrics', 'exercises_library', 'users',
      'workouts', 'exercises', 'plans'
    ];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`✅ ${table}: disponible (${count} lignes)`);
        }
      } catch (err) {
        // Table n'existe pas, on ignore
      }
    }
    
    // 4. Créer le script de migration basé sur les découvertes
    console.log('\n4️⃣ Génération du script de migration...');
    
    // Récupérer les données créées pour voir la structure exacte
    const { data: finalSession } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    const { data: finalSet } = await supabase
      .from('workout_sets')
      .select('*')
      .eq('id', setId)
      .single();
    
    if (finalSession) {
      console.log('\n📋 Structure actuelle workout_sessions:');
      Object.keys(finalSession).forEach(col => {
        console.log(`   ${col}: ${typeof finalSession[col]}`);
      });
    }
    
    if (finalSet) {
      console.log('\n📋 Structure actuelle workout_sets:');
      Object.keys(finalSet).forEach(col => {
        console.log(`   ${col}: ${typeof finalSet[col]}`);
      });
    }
    
    // Nettoyer
    await supabase.from('workout_sets').delete().eq('id', setId);
    await supabase.from('workout_sessions').delete().eq('id', sessionId);
    
    console.log('\n✅ Découverte terminée ! Données de test nettoyées.');
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

discoverStructure();