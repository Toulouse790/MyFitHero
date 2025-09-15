-- ============================================================================
-- SCRIPT DE VÉRIFICATION DES TABLES WORKOUT
-- À exécuter après setup-workout-tables.sql
-- ============================================================================

-- Vérifier l'existence des tables
SELECT 'Vérification des tables...' as etape;

SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ Existe'
    ELSE '❌ Manquante'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue')
ORDER BY table_name;

-- Vérifier les colonnes importantes
SELECT 'Vérification des colonnes workout_plans...' as etape;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'workout_plans'
ORDER BY ordinal_position;

-- Vérifier les index
SELECT 'Vérification des index...' as etape;
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('workout_plans', 'workout_sessions', 'workout_sets')
ORDER BY tablename, indexname;

-- Vérifier les policies RLS
SELECT 'Vérification des policies RLS...' as etape;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('workout_plans', 'workout_sessions', 'workout_sets')
ORDER BY tablename, policyname;

-- Test d'insertion (nécessite un utilisateur authentifié)
SELECT 'Test d''insertion...' as etape;

-- Insérer un plan de test si un utilisateur existe
INSERT INTO public.workout_plans (
  user_id,
  name,
  description,
  exercises,
  estimated_duration_minutes,
  difficulty,
  workout_type
)
SELECT 
  u.id,
  'Plan de Test - Débutant',
  'Plan d''entraînement de test pour vérifier le système',
  '[
    {
      "exerciseId": "push-ups",
      "name": "Pompes",
      "targetSets": 3,
      "targetReps": [8, 12],
      "restTime": 60,
      "type": "strength"
    }
  ]'::jsonb,
  30,
  'beginner',
  'strength'
FROM auth.users u
LIMIT 1
ON CONFLICT DO NOTHING;

-- Vérifier l'insertion
SELECT 
  name,
  difficulty,
  workout_type,
  created_at
FROM public.workout_plans 
WHERE name = 'Plan de Test - Débutant'
LIMIT 1;

-- Résumé final
SELECT 
  'Tables workout prêtes pour MyFitHero!' as message,
  COUNT(*) as tables_creees
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue');