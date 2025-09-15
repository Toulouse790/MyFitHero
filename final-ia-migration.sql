-- ============================================================================
-- SCRIPT DE MIGRATION FINAL - AJOUT DES COLONNES IA
-- Version adaptée à votre structure existante Supabase
-- ============================================================================

BEGIN;

-- ============================================================================
-- ANALYSE DE LA STRUCTURE EXISTANTE
-- ============================================================================

-- Afficher les colonnes actuelles pour référence
DO $$
BEGIN
    RAISE NOTICE '========== STRUCTURE ACTUELLE ==========';
END $$;

-- Lister les colonnes de workout_sessions
SELECT 
    'workout_sessions' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'workout_sessions' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Lister les colonnes de workout_sets
SELECT 
    'workout_sets' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'workout_sets' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- ÉTAPE 1: AJOUTER LES COLONNES IA DANS WORKOUT_SESSIONS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Ajout des colonnes IA dans workout_sessions...';
    
    -- Métriques adaptatifs IA
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'fatigue_level') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN fatigue_level numeric DEFAULT 0 CHECK (fatigue_level >= 0 AND fatigue_level <= 1);
        RAISE NOTICE 'Ajouté: fatigue_level';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'performance_score') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN performance_score numeric DEFAULT 1 CHECK (performance_score >= 0 AND performance_score <= 1);
        RAISE NOTICE 'Ajouté: performance_score';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'heart_rate_zone') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN heart_rate_zone integer DEFAULT 2 CHECK (heart_rate_zone >= 1 AND heart_rate_zone <= 5);
        RAISE NOTICE 'Ajouté: heart_rate_zone';
    END IF;

    -- Préférences utilisateur IA
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'auto_progress_weight') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN auto_progress_weight boolean DEFAULT true;
        RAISE NOTICE 'Ajouté: auto_progress_weight';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'smart_rest_timers') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN smart_rest_timers boolean DEFAULT true;
        RAISE NOTICE 'Ajouté: smart_rest_timers';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'real_time_coaching') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN real_time_coaching boolean DEFAULT true;
        RAISE NOTICE 'Ajouté: real_time_coaching';
    END IF;

    -- Support mode offline et sync
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'session_state') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN session_state jsonb DEFAULT '{}';
        RAISE NOTICE 'Ajouté: session_state';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'pending_changes') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN pending_changes jsonb DEFAULT '[]';
        RAISE NOTICE 'Ajouté: pending_changes';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'last_sync') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN last_sync timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Ajouté: last_sync';
    END IF;

    -- Métriques de volume et durée si elles n'existent pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'total_volume') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN total_volume numeric DEFAULT 0;
        RAISE NOTICE 'Ajouté: total_volume';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'workout_duration_minutes') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN workout_duration_minutes integer DEFAULT 0;
        RAISE NOTICE 'Ajouté: workout_duration_minutes';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'calories_burned') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN calories_burned integer DEFAULT 0;
        RAISE NOTICE 'Ajouté: calories_burned';
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 2: AJOUTER LES COLONNES IA DANS WORKOUT_SETS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Ajout des colonnes IA dans workout_sets...';
    
    -- Poids et répétitions (adaptés au nom existant)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'weight') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'weight_kg') THEN
            ALTER TABLE public.workout_sets ADD COLUMN weight numeric DEFAULT 0;
            RAISE NOTICE 'Ajouté: weight';
        END IF;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'reps') THEN
        ALTER TABLE public.workout_sets ADD COLUMN reps integer DEFAULT 0;
        RAISE NOTICE 'Ajouté: reps';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'rpe') THEN
        ALTER TABLE public.workout_sets ADD COLUMN rpe integer CHECK (rpe >= 1 AND rpe <= 10);
        RAISE NOTICE 'Ajouté: rpe';
    END IF;

    -- Métadonnées IA prédictives
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'predicted_rpe') THEN
        ALTER TABLE public.workout_sets ADD COLUMN predicted_rpe numeric;
        RAISE NOTICE 'Ajouté: predicted_rpe';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'actual_vs_predicted_performance') THEN
        ALTER TABLE public.workout_sets ADD COLUMN actual_vs_predicted_performance numeric;
        RAISE NOTICE 'Ajouté: actual_vs_predicted_performance';
    END IF;

    -- Timing détaillé des sets
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'set_start_time') THEN
        ALTER TABLE public.workout_sets ADD COLUMN set_start_time timestamp with time zone;
        RAISE NOTICE 'Ajouté: set_start_time';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'set_end_time') THEN
        ALTER TABLE public.workout_sets ADD COLUMN set_end_time timestamp with time zone;
        RAISE NOTICE 'Ajouté: set_end_time';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'rest_time_seconds') THEN
        ALTER TABLE public.workout_sets ADD COLUMN rest_time_seconds integer;
        RAISE NOTICE 'Ajouté: rest_time_seconds';
    END IF;

    -- État avancé des sets
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'is_dropset') THEN
        ALTER TABLE public.workout_sets ADD COLUMN is_dropset boolean DEFAULT false;
        RAISE NOTICE 'Ajouté: is_dropset';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'is_failure') THEN
        ALTER TABLE public.workout_sets ADD COLUMN is_failure boolean DEFAULT false;
        RAISE NOTICE 'Ajouté: is_failure';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'technique_score') THEN
        ALTER TABLE public.workout_sets ADD COLUMN technique_score integer CHECK (technique_score >= 1 AND technique_score <= 10);
        RAISE NOTICE 'Ajouté: technique_score';
    END IF;

    -- Colonnes standard si elles n'existent pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'updated_at') THEN
        ALTER TABLE public.workout_sets ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Ajouté: updated_at';
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 3: CRÉER LES INDEX POUR LES PERFORMANCES
-- ============================================================================

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id_status ON public.workout_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_fatigue_performance ON public.workout_sessions(fatigue_level, performance_score);
CREATE INDEX IF NOT EXISTS idx_workout_sets_session_exercise ON public.workout_sets(session_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_rpe_predicted ON public.workout_sets(rpe, predicted_rpe);

-- ============================================================================
-- ÉTAPE 4: CRÉER LES TRIGGERS POUR updated_at
-- ============================================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour workout_sessions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_workout_sessions_updated_at'
    ) THEN
        CREATE TRIGGER update_workout_sessions_updated_at 
          BEFORE UPDATE ON public.workout_sessions 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Trigger créé pour workout_sessions.updated_at';
    END IF;
END $$;

-- Trigger pour workout_sets
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_workout_sets_updated_at'
    ) THEN
        CREATE TRIGGER update_workout_sets_updated_at 
          BEFORE UPDATE ON public.workout_sets 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Trigger créé pour workout_sets.updated_at';
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 5: VÉRIFICATION FINALE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========== MIGRATION TERMINÉE ==========';
    RAISE NOTICE 'Vérification des nouvelles colonnes...';
END $$;

-- Compter les nouvelles colonnes IA
SELECT 
    'workout_sessions' as table_name,
    COUNT(*) as total_columns,
    COUNT(CASE WHEN column_name IN ('fatigue_level', 'performance_score', 'heart_rate_zone', 'auto_progress_weight', 'smart_rest_timers', 'real_time_coaching', 'session_state', 'pending_changes', 'last_sync') THEN 1 END) as ai_columns_added
FROM information_schema.columns 
WHERE table_name = 'workout_sessions' AND table_schema = 'public';

SELECT 
    'workout_sets' as table_name,
    COUNT(*) as total_columns,
    COUNT(CASE WHEN column_name IN ('weight', 'reps', 'rpe', 'predicted_rpe', 'actual_vs_predicted_performance', 'set_start_time', 'set_end_time', 'rest_time_seconds', 'is_dropset', 'is_failure', 'technique_score', 'updated_at') THEN 1 END) as ai_columns_added
FROM information_schema.columns 
WHERE table_name = 'workout_sets' AND table_schema = 'public';

COMMIT;

-- Message final
SELECT 
    '🎉 MIGRATION IA TERMINÉE AVEC SUCCÈS !' as status,
    'Les composants sophistiqués peuvent maintenant utiliser toutes les fonctionnalités IA' as message;