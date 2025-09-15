-- ============================================================================
-- SCRIPT DE VÉRIFICATION DE COHÉRENCE
-- Analyse les tables existantes vs nos composants TypeScript
-- ============================================================================

-- ============================================================================
-- 1. VÉRIFIER LES TABLES REQUISES PAR NOS COMPOSANTS
-- ============================================================================

SELECT 
    'Tables requises' as category,
    table_name,
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN '✅ EXISTE'
        ELSE '❌ MANQUANTE'
    END as status
FROM (
    VALUES 
        ('workout_sessions'),
        ('workout_sets'), 
        ('workout_plans'),
        ('session_metrics'),
        ('exercises_library'),
        ('users')
) AS required_tables(table_name);

-- ============================================================================
-- 2. VÉRIFIER LES COLONNES POUR workout_sessions (SophisticatedWorkoutFlowManager)
-- ============================================================================

SELECT 
    'workout_sessions' as table_name,
    required_column,
    CASE 
        WHEN required_column IN (
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'workout_sessions' AND table_schema = 'public'
        ) THEN '✅ EXISTE'
        ELSE '❌ MANQUANTE'
    END as status,
    expected_type
FROM (
    VALUES 
        ('id', 'uuid'),
        ('user_id', 'uuid'),
        ('workout_plan_id', 'uuid'),
        ('name', 'text'),
        ('status', 'text'),
        ('total_volume', 'numeric'),
        ('workout_duration_minutes', 'integer'),
        ('calories_burned', 'integer'),
        ('started_at', 'timestamp'),
        ('completed_at', 'timestamp'),
        ('created_at', 'timestamp'),
        ('updated_at', 'timestamp'),
        -- Colonnes IA requises
        ('fatigue_level', 'numeric'),
        ('performance_score', 'numeric'),
        ('heart_rate_zone', 'integer'),
        ('auto_progress_weight', 'boolean'),
        ('smart_rest_timers', 'boolean'),
        ('real_time_coaching', 'boolean'),
        ('session_state', 'jsonb'),
        ('pending_changes', 'jsonb'),
        ('last_sync', 'timestamp')
) AS required_columns(required_column, expected_type);

-- ============================================================================
-- 3. VÉRIFIER LES COLONNES POUR workout_sets (VolumeAnalyticsEngine)
-- ============================================================================

SELECT 
    'workout_sets' as table_name,
    required_column,
    CASE 
        WHEN required_column IN (
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'workout_sets' AND table_schema = 'public'
        ) THEN '✅ EXISTE'
        ELSE '❌ MANQUANTE'
    END as status,
    expected_type
FROM (
    VALUES 
        ('id', 'uuid'),
        ('session_id', 'uuid'),
        ('exercise_id', 'uuid'),
        ('set_number', 'integer'),
        ('weight_kg', 'numeric'),
        ('reps', 'integer'),
        ('rpe', 'integer'),
        ('rest_time_seconds', 'integer'),
        ('created_at', 'timestamp'),
        ('updated_at', 'timestamp'),
        -- Colonnes IA requises
        ('predicted_rpe', 'numeric'),
        ('actual_vs_predicted_performance', 'numeric'),
        ('set_start_time', 'timestamp'),
        ('set_end_time', 'timestamp'),
        ('is_dropset', 'boolean'),
        ('is_failure', 'boolean')
) AS required_columns(required_column, expected_type);

-- ============================================================================
-- 4. ANALYSER LES TYPES DE DONNÉES EXISTANTS
-- ============================================================================

SELECT 
    'Types existants workout_sessions' as analysis,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workout_sessions' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    'Types existants workout_sets' as analysis,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workout_sets' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- 5. VÉRIFIER LES CONTRAINTES FOREIGN KEY
-- ============================================================================

SELECT 
    'Contraintes FK' as category,
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
  AND tc.table_name IN ('workout_sessions', 'workout_sets', 'session_metrics')
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- 6. ANALYSER LES CONFLITS POTENTIELS
-- ============================================================================

-- Vérifier si workout_sessions.status a les bonnes valeurs
SELECT 
    'Status Values' as check_type,
    status,
    COUNT(*) as count
FROM public.workout_sessions 
GROUP BY status
ORDER BY count DESC;

-- Vérifier les données existantes
SELECT 
    'Data Summary' as summary,
    'workout_sessions' as table_name,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
    COUNT(CASE WHEN fatigue_level IS NOT NULL THEN 1 END) as sessions_with_ai_data
FROM public.workout_sessions;

SELECT 
    'Data Summary' as summary,
    'workout_sets' as table_name,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN rpe IS NOT NULL THEN 1 END) as sets_with_rpe,
    COUNT(CASE WHEN predicted_rpe IS NOT NULL THEN 1 END) as sets_with_ai_predictions
FROM public.workout_sets;

-- ============================================================================
-- 7. RECOMMANDATIONS
-- ============================================================================

SELECT 
    'RECOMMANDATIONS' as category,
    '1. Exécuter update-existing-workout-tables.sql pour ajouter les colonnes IA manquantes' as action
UNION ALL
SELECT 
    'RECOMMANDATIONS',
    '2. Vérifier que exercise_id référence bien exercises_library' 
UNION ALL
SELECT 
    'RECOMMANDATIONS',
    '3. Mettre à jour les interfaces TypeScript si nécessaire'
UNION ALL
SELECT 
    'RECOMMANDATIONS',
    '4. Tester les composants avec la structure existante';