-- =============================================================================
-- MIGRATION SQL CORRIGÉE POUR ALIGNER SUPABASE AVEC L'APPLICATION TYPESCRIPT
-- Version 2.0 - Erreurs corrigées et optimisations ajoutées
-- =============================================================================

-- Début de transaction pour rollback en cas d'erreur
BEGIN;

-- 1. CORRECTION DU GENRE DANS user_profiles (supprimer 'other')
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    -- Supprimer l'ancienne contrainte si elle existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_gender_check' 
        AND table_name = 'user_profiles'
    ) THEN
        ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_gender_check;
    END IF;
    
    -- Ajouter la nouvelle contrainte
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_gender_check 
    CHECK (gender IS NULL OR gender IN ('male', 'female'));
    
    RAISE NOTICE 'Contrainte gender mise à jour avec succès';
END $$;

-- Mise à jour des données existantes avec 'other' → NULL
UPDATE user_profiles 
SET gender = NULL 
WHERE gender = 'other';

-- 2. CORRECTION DES STATUTS DANS workout_sessions
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    -- Supprimer l'ancienne contrainte si elle existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'workout_sessions_status_check' 
        AND table_name = 'workout_sessions'
    ) THEN
        ALTER TABLE workout_sessions DROP CONSTRAINT workout_sessions_status_check;
    END IF;
    
    -- Ajouter la nouvelle contrainte avec tous les statuts
    ALTER TABLE workout_sessions 
    ADD CONSTRAINT workout_sessions_status_check 
    CHECK (status IN (
        'idle', 'active', 'paused', 'completed', 'cancelled',
        'warming-up', 'working', 'resting', 'transitioning', 'emergency-stop'
    ));
    
    RAISE NOTICE 'Contrainte status mise à jour avec succès';
END $$;

-- 3. AJOUT D'INDEX POUR OPTIMISER LES PERFORMANCES
-- -----------------------------------------------------------------------------

-- Index pour les requêtes fréquentes de WorkoutDetailPage
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_status 
ON workout_sessions (user_id, status) 
WHERE status IN ('active', 'paused', 'idle');

CREATE INDEX IF NOT EXISTS idx_workout_sets_session_exercise 
ON workout_sets (session_id, exercise_id, exercise_order);

-- Index pour ExerciseDetailPage
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_user_date 
ON workout_sets (exercise_id, user_id, created_at DESC) 
WHERE is_completed = true;

CREATE INDEX IF NOT EXISTS idx_exercises_library_search 
ON exercises_library (category, difficulty, equipment);

-- Index pour les statistiques et métriques
CREATE INDEX IF NOT EXISTS idx_session_metrics_user_date 
ON session_metrics (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date 
ON daily_stats (user_id, stat_date DESC);

-- Index pour améliorer les performances des vues
CREATE INDEX IF NOT EXISTS idx_workout_sets_performance 
ON workout_sets (exercise_id, weight, reps, created_at) 
WHERE is_completed = true AND weight IS NOT NULL;

RAISE NOTICE 'Index créés avec succès';

-- 4. VUES POUR SIMPLIFIER LES REQUÊTES COMPLEXES
-- -----------------------------------------------------------------------------

-- Vue pour les détails d'exercice avec historique personnel (corrigée)
CREATE OR REPLACE VIEW exercise_details_with_history AS
SELECT 
    e.id,
    e.name,
    e.description,
    e.category,
    e.muscle_groups,
    e.equipment,
    e.difficulty,
    e.instructions,
    e.notes,
    e.image_url,
    e.video_url,
    e.created_at,
    COALESCE(stats.total_sessions, 0) as total_sessions,
    stats.max_weight,
    stats.avg_weight,
    stats.last_session_date
FROM exercises_library e
LEFT JOIN (
    SELECT 
        exercise_id,
        COUNT(DISTINCT session_id) as total_sessions,
        MAX(weight) as max_weight,
        AVG(weight) as avg_weight,
        MAX(created_at) as last_session_date
    FROM workout_sets 
    WHERE is_completed = true AND weight IS NOT NULL
    GROUP BY exercise_id
) stats ON e.id = stats.exercise_id;

-- Vue pour les sessions de workout avec métriques (corrigée)
CREATE OR REPLACE VIEW workout_sessions_with_metrics AS
SELECT 
    ws.id,
    ws.user_id,
    ws.workout_plan_id,
    ws.name,
    ws.description,
    ws.status,
    ws.current_exercise_index,
    ws.current_set_index,
    ws.total_volume,
    ws.total_sets,
    ws.average_rpe,
    ws.workout_duration_minutes,
    ws.calories_burned,
    ws.started_at,
    ws.completed_at,
    ws.created_at,
    ws.updated_at,
    -- Métriques de session_metrics
    sm.training_stress_score,
    sm.fatigue_index,
    sm.readiness_score,
    sm.recovery_recommendation,
    -- Statistiques calculées des sets
    set_stats.total_sets_count,
    set_stats.average_rpe_calculated,
    set_stats.total_volume_calculated
FROM workout_sessions ws
LEFT JOIN session_metrics sm ON ws.id = sm.session_id
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as total_sets_count,
        AVG(rpe) as average_rpe_calculated,
        SUM(COALESCE(weight, 0) * COALESCE(reps, 0)) as total_volume_calculated
    FROM workout_sets 
    WHERE is_completed = true
    GROUP BY session_id
) set_stats ON ws.id = set_stats.session_id;

-- Vue pour les statistiques utilisateur complètes (corrigée)
CREATE OR REPLACE VIEW user_complete_stats AS
SELECT 
    up.id,
    up.username,
    up.full_name,
    up.age,
    up.height_cm,
    up.weight_kg,
    up.gender,
    up.activity_level,
    up.fitness_goal,
    up.sport,
    up.sport_level,
    up.active_modules,
    up.profile_type,
    up.created_at,
    up.updated_at,
    -- Statistiques du jour
    ds.workouts_completed as today_workouts,
    ds.total_workout_minutes as today_minutes,
    ds.calories_burned as today_calories,
    ds.water_intake_ml as today_water,
    -- Statistiques du mois
    ms.total_workouts as month_workouts,
    ms.avg_workout_duration as month_avg_duration,
    ms.total_calories_burned as month_calories
FROM user_profiles up
LEFT JOIN daily_stats ds ON up.id = ds.user_id AND ds.stat_date = CURRENT_DATE
LEFT JOIN monthly_stats ms ON up.id = ms.user_id 
    AND ms.month = DATE_TRUNC('month', CURRENT_DATE)::DATE;

RAISE NOTICE 'Vues créées avec succès';

-- 5. FONCTIONS UTILITAIRES POUR L'APPLICATION (corrigées)
-- -----------------------------------------------------------------------------

-- Fonction pour calculer les records personnels d'un exercice (corrigée)
CREATE OR REPLACE FUNCTION get_exercise_personal_records(
    p_user_id UUID,
    p_exercise_id UUID
)
RETURNS TABLE (
    max_weight NUMERIC,
    max_reps INTEGER,
    max_volume NUMERIC,
    total_sessions BIGINT,
    last_session_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        MAX(ws.weight) as max_weight,
        MAX(ws.reps) as max_reps,
        MAX(COALESCE(ws.weight, 0) * COALESCE(ws.reps, 0)) as max_volume,
        COUNT(DISTINCT ws.session_id) as total_sessions,
        MAX(ws.created_at) as last_session_date
    FROM workout_sets ws
    WHERE ws.user_id = p_user_id 
    AND ws.exercise_id = p_exercise_id
    AND ws.is_completed = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir la progression d'un exercice (corrigée)
CREATE OR REPLACE FUNCTION get_exercise_progression(
    p_user_id UUID,
    p_exercise_id UUID,
    p_days_back INTEGER DEFAULT 90
)
RETURNS TABLE (
    session_date DATE,
    max_weight NUMERIC,
    total_volume NUMERIC,
    avg_rpe NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ws.created_at::DATE as session_date,
        MAX(ws.weight) as max_weight,
        SUM(COALESCE(ws.weight, 0) * COALESCE(ws.reps, 0)) as total_volume,
        AVG(ws.rpe::NUMERIC) as avg_rpe
    FROM workout_sets ws
    WHERE ws.user_id = p_user_id 
    AND ws.exercise_id = p_exercise_id
    AND ws.created_at >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
    AND ws.is_completed = true
    GROUP BY ws.created_at::DATE
    ORDER BY session_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les exercices les plus populaires
CREATE OR REPLACE FUNCTION get_popular_exercises(
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    exercise_id UUID,
    exercise_name TEXT,
    category TEXT,
    total_sessions BIGINT,
    avg_rating NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as exercise_id,
        e.name as exercise_name,
        e.category::TEXT as category,
        COUNT(DISTINCT ws.session_id) as total_sessions,
        AVG(ws.rpe::NUMERIC) as avg_rating
    FROM exercises_library e
    INNER JOIN workout_sets ws ON e.id = ws.exercise_id
    WHERE ws.is_completed = true
    GROUP BY e.id, e.name, e.category
    ORDER BY total_sessions DESC, avg_rating DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE 'Fonctions créées avec succès';

-- 6. POLITIQUES RLS (ROW LEVEL SECURITY) SÉCURISÉES
-- -----------------------------------------------------------------------------

-- Activer RLS sur les tables sensibles
DO $$
BEGIN
    -- Activer RLS si pas déjà fait
    ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
    ALTER TABLE session_metrics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'RLS activé sur les tables sensibles';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'RLS déjà activé ou erreur: %', SQLERRM;
END $$;

-- Politiques sécurisées pour l'accès aux données
CREATE POLICY IF NOT EXISTS "Users can only access their own workout sessions" 
ON workout_sessions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can only access their own workout sets" 
ON workout_sets FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can only access their own session metrics" 
ON session_metrics FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can only access their own profile" 
ON user_profiles FOR ALL 
USING (auth.uid() = id);

-- Politique pour permettre la lecture publique des exercices
CREATE POLICY IF NOT EXISTS "Exercises are publicly readable" 
ON exercises_library FOR SELECT 
USING (true);

RAISE NOTICE 'Politiques RLS créées avec succès';

-- 7. DONNÉES DE TEST POUR LE DÉVELOPPEMENT (corrigées)
-- -----------------------------------------------------------------------------

-- Insertion d'exercices de base si la table est vide
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM exercises_library LIMIT 1) THEN
        INSERT INTO exercises_library (
            name, description, category, muscle_groups, equipment, difficulty, 
            instructions, movement_type, exercise_mechanic
        ) VALUES
        (
            'Développé couché', 
            'Exercice fondamental pour développer la force et la masse des pectoraux', 
            'chest', 
            ARRAY['pectoraux', 'triceps', 'deltoïdes antérieurs'], 
            'barbell', 
            'intermediate',
            'Allongez-vous sur le banc, pieds au sol. Saisissez la barre avec une prise légèrement plus large que les épaules. Descendez la barre vers la poitrine en contrôlant, puis poussez vers le haut.',
            'push',
            'compound'
        ),
        (
            'Squat', 
            'Exercice roi pour développer la puissance et la masse des membres inférieurs', 
            'legs', 
            ARRAY['quadriceps', 'fessiers', 'ischio-jambiers'], 
            'barbell', 
            'intermediate',
            'Placez la barre sur vos épaules. Descendez en fléchissant hanches et genoux jusqu''à ce que les cuisses soient parallèles au sol. Remontez en poussant sur les talons.',
            'legs',
            'compound'
        ),
        (
            'Tractions', 
            'Exercice au poids du corps pour développer la force du dos et des bras', 
            'back', 
            ARRAY['dorsaux', 'biceps', 'rhomboïdes'], 
            'bodyweight', 
            'intermediate',
            'Suspendez-vous à la barre, bras tendus. Tirez votre corps vers le haut jusqu''à ce que votre menton dépasse la barre. Descendez lentement.',
            'pull',
            'compound'
        ),
        (
            'Pompes', 
            'Exercice au poids du corps pour les pectoraux et triceps', 
            'chest', 
            ARRAY['pectoraux', 'triceps', 'deltoïdes'], 
            'bodyweight', 
            'beginner',
            'En position de planche, descendez en fléchissant les bras jusqu''à frôler le sol. Poussez pour revenir en position haute.',
            'push',
            'compound'
        );
        
        RAISE NOTICE 'Exercices de base insérés avec succès';
    ELSE
        RAISE NOTICE 'Des exercices existent déjà, insertion ignorée';
    END IF;
END $$;

-- 8. VALIDATION DE LA MIGRATION
-- -----------------------------------------------------------------------------

-- Vérifier que les contraintes sont correctes
DO $$
DECLARE
    constraint_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO constraint_count
    FROM information_schema.table_constraints 
    WHERE table_name IN ('user_profiles', 'workout_sessions')
    AND constraint_type = 'CHECK';
    
    RAISE NOTICE 'Nombre de contraintes CHECK trouvées: %', constraint_count;
END $$;

-- Vérifier les index créés
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE tablename IN ('workout_sessions', 'workout_sets', 'exercises_library', 'session_metrics', 'daily_stats')
    AND schemaname = 'public'
    AND indexname LIKE 'idx_%';
    
    RAISE NOTICE 'Nombre d''index créés: %', index_count;
END $$;

-- Compter les exercices disponibles
DO $$
DECLARE
    exercise_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO exercise_count FROM exercises_library;
    RAISE NOTICE 'Nombre d''exercices disponibles: %', exercise_count;
END $$;

-- Vérifier les vues créées
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count
    FROM pg_views 
    WHERE schemaname = 'public'
    AND viewname IN ('exercise_details_with_history', 'workout_sessions_with_metrics', 'user_complete_stats');
    
    RAISE NOTICE 'Nombre de vues créées: %', view_count;
END $$;

-- Vérifier les fonctions créées
DO $$
DECLARE
    function_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('get_exercise_personal_records', 'get_exercise_progression', 'get_popular_exercises');
    
    RAISE NOTICE 'Nombre de fonctions créées: %', function_count;
END $$;

RAISE NOTICE '=== MIGRATION TERMINÉE AVEC SUCCÈS ===';

-- Valider la transaction
COMMIT;