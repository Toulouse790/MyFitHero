-- ============================================================================
-- SCRIPT D'ANALYSE DE STRUCTURE EXISTANTE
-- Analyse les colonnes actuelles pour voir ce qui manque pour l'IA
-- ============================================================================

-- 1. Analyser la structure de workout_sessions
SELECT 
    'workout_sessions' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workout_sessions' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Analyser la structure de workout_sets
SELECT 
    'workout_sets' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workout_sets' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Analyser la structure de workout_plans
SELECT 
    'workout_plans' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workout_plans' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Vérifier les contraintes foreign key
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('workout_sessions', 'workout_sets', 'workout_plans')
ORDER BY tc.table_name, kcu.column_name;

-- 5. Lister toutes les tables pour voir la structure générale
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name LIKE '%workout%'
ORDER BY table_name;