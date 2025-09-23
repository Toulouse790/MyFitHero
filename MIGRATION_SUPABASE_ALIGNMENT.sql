-- =============================================================================
-- MIGRATION SQL POUR ALIGNER SUPABASE AVEC L'APPLICATION TYPESCRIPT
-- =============================================================================

-- 1. CORRECTION DU GENRE DANS user_profiles (supprimer 'other')
-- -----------------------------------------------------------------------------
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_gender_check;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_gender_check 
CHECK (gender IS NULL OR gender IN ('male', 'female'));

-- Mise à jour des données existantes avec 'other' → NULL
UPDATE user_profiles 
SET gender = NULL 
WHERE gender = 'other';

-- 2. CORRECTION DES STATUTS DANS workout_sessions
-- -----------------------------------------------------------------------------
ALTER TABLE workout_sessions 
DROP CONSTRAINT IF EXISTS workout_sessions_status_check;

ALTER TABLE workout_sessions 
ADD CONSTRAINT workout_sessions_status_check 
CHECK (status IN (
    'idle', 'active', 'paused', 'completed', 'cancelled',
    'warming-up', 'working', 'resting', 'transitioning', 'emergency-stop'
));

-- 3. AJOUT D'INDEX POUR OPTIMISER LES PERFORMANCES
-- -----------------------------------------------------------------------------

-- Index pour les requêtes fréquentes de WorkoutDetailPage
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_status 
ON workout_sessions (user_id, status);

CREATE INDEX IF NOT EXISTS idx_workout_sets_session_exercise 
ON workout_sets (session_id, exercise_id);

-- Index pour ExerciseDetailPage
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_user 
ON workout_sets (exercise_id, user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exercises_library_category_difficulty 
ON exercises_library (category, difficulty);

-- Index pour les statistiques et métriques
CREATE INDEX IF NOT EXISTS idx_session_metrics_user_date 
ON session_metrics (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date 
ON daily_stats (user_id, stat_date DESC);

-- 4. VUES POUR SIMPLIFIER LES REQUÊTES COMPLEXES
-- -----------------------------------------------------------------------------

-- Vue pour les détails d'exercice avec historique personnel
CREATE OR REPLACE VIEW exercise_details_with_history AS
SELECT 
    e.*,
    COUNT(ws.id) as total_sessions,
    MAX(ws.weight) as max_weight,
    AVG(ws.weight) as avg_weight,
    MAX(ws.created_at) as last_session_date
FROM exercises_library e
LEFT JOIN workout_sets ws ON e.id = ws.exercise_id
GROUP BY e.id;

-- Vue pour les sessions de workout avec métriques
CREATE OR REPLACE VIEW workout_sessions_with_metrics AS
SELECT 
    ws.*,
    sm.total_volume,
    sm.training_stress_score,
    sm.fatigue_index,
    sm.readiness_score,
    COUNT(wst.id) as total_sets,
    AVG(wst.rpe) as average_rpe
FROM workout_sessions ws
LEFT JOIN session_metrics sm ON ws.id = sm.session_id
LEFT JOIN workout_sets wst ON ws.id = wst.session_id
GROUP BY ws.id, sm.total_volume, sm.training_stress_score, sm.fatigue_index, sm.readiness_score;

-- Vue pour les statistiques utilisateur complètes
CREATE OR REPLACE VIEW user_complete_stats AS
SELECT 
    up.*,
    ds.workouts_completed as today_workouts,
    ds.total_workout_minutes as today_minutes,
    ds.water_intake_ml as today_water,
    ms.total_workouts as month_workouts,
    ms.avg_workout_duration as month_avg_duration
FROM user_profiles up
LEFT JOIN daily_stats ds ON up.id = ds.user_id AND ds.stat_date = CURRENT_DATE
LEFT JOIN monthly_stats ms ON up.id = ms.user_id AND ms.month = DATE_TRUNC('month', CURRENT_DATE);

-- 5. FONCTIONS UTILITAIRES POUR L'APPLICATION
-- -----------------------------------------------------------------------------

-- Fonction pour calculer les records personnels d'un exercice
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
        MAX(ws.weight * ws.reps) as max_volume,
        COUNT(*) as total_sessions,
        MAX(ws.created_at) as last_session_date
    FROM workout_sets ws
    WHERE ws.user_id = p_user_id 
    AND ws.exercise_id = p_exercise_id
    AND ws.is_completed = true;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir la progression d'un exercice
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
        SUM(ws.weight * ws.reps) as total_volume,
        AVG(ws.rpe::NUMERIC) as avg_rpe
    FROM workout_sets ws
    WHERE ws.user_id = p_user_id 
    AND ws.exercise_id = p_exercise_id
    AND ws.created_at >= CURRENT_DATE - INTERVAL '%s days' % p_days_back
    AND ws.is_completed = true
    GROUP BY ws.created_at::DATE
    ORDER BY session_date DESC;
END;
$$ LANGUAGE plpgsql;

-- 6. POLITIQUES RLS (ROW LEVEL SECURITY) SI NÉCESSAIRE
-- -----------------------------------------------------------------------------

-- Activer RLS sur les tables sensibles si pas encore fait
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_metrics ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que leurs données
CREATE POLICY IF NOT EXISTS "Users can only access their own workout sessions" 
ON workout_sessions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can only access their own workout sets" 
ON workout_sets FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can only access their own session metrics" 
ON session_metrics FOR ALL 
USING (auth.uid() = user_id);

-- 7. DONNÉES DE TEST POUR LE DÉVELOPPEMENT (OPTIONNEL)
-- -----------------------------------------------------------------------------

-- Insertion d'exercices de base si la table est vide
INSERT INTO exercises_library (name, description, category, muscle_groups, equipment, difficulty, instructions)
SELECT * FROM (VALUES
    ('Développé couché', 'Exercice fondamental pour les pectoraux', 'chest', ARRAY['pectoraux', 'triceps'], 'barbell', 'intermediate', 'Allongez-vous sur le banc, saisissez la barre...'),
    ('Squat', 'Exercice roi pour les jambes', 'legs', ARRAY['quadriceps', 'fessiers'], 'barbell', 'intermediate', 'Placez la barre sur vos épaules...'),
    ('Tractions', 'Exercice pour le dos et les biceps', 'back', ARRAY['dorsaux', 'biceps'], 'bodyweight', 'intermediate', 'Suspendez-vous à la barre...')
) AS v(name, description, category, muscle_groups, equipment, difficulty, instructions)
WHERE NOT EXISTS (SELECT 1 FROM exercises_library);

-- =============================================================================
-- VALIDATION DE LA MIGRATION
-- =============================================================================

-- Vérifier que les contraintes sont correctes
SELECT 
    table_name, 
    constraint_name, 
    constraint_type 
FROM information_schema.table_constraints 
WHERE table_name IN ('user_profiles', 'workout_sessions')
AND constraint_type = 'CHECK';

-- Vérifier les index créés
SELECT 
    indexname, 
    tablename 
FROM pg_indexes 
WHERE tablename IN ('workout_sessions', 'workout_sets', 'exercises_library', 'session_metrics', 'daily_stats');

-- Compter les exercices disponibles
SELECT COUNT(*) as total_exercises FROM exercises_library;

-- Vérifier les vues créées
SELECT viewname FROM pg_views WHERE schemaname = 'public';

COMMIT;