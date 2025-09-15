-- ============================================================================
-- SCRIPT DE MISE À JOUR POUR ADAPTER À LA BASE EXISTANTE
-- Compatible avec votre schéma existant MyFitHero
-- ============================================================================

BEGIN;

-- ============================================================================
-- ÉTAPE 1: AJOUTER LES CONTRAINTES MANQUANTES
-- ============================================================================

-- Ajouter référence exercise_id vers exercises_library si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'workout_sets' 
        AND constraint_name = 'workout_sets_exercise_id_fkey'
    ) THEN
        ALTER TABLE public.workout_sets 
        ADD CONSTRAINT workout_sets_exercise_id_fkey 
        FOREIGN KEY (exercise_id) REFERENCES public.exercises_library(id);
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 2: AJOUTER LES COLONNES MANQUANTES POUR L'IA
-- ============================================================================

-- Ajouter les colonnes IA dans workout_sessions si elles n'existent pas
DO $$
BEGIN
    -- Facteurs adaptatifs pour l'IA
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'fatigue_level') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN fatigue_level numeric DEFAULT 0 CHECK (fatigue_level >= 0 AND fatigue_level <= 1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'performance_score') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN performance_score numeric DEFAULT 1 CHECK (performance_score >= 0 AND performance_score <= 1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'heart_rate_zone') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN heart_rate_zone integer DEFAULT 2 CHECK (heart_rate_zone >= 1 AND heart_rate_zone <= 5);
    END IF;

    -- Préférences utilisateur pour l'IA
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'auto_progress_weight') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN auto_progress_weight boolean DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'smart_rest_timers') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN smart_rest_timers boolean DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'real_time_coaching') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN real_time_coaching boolean DEFAULT true;
    END IF;

    -- Support mode offline
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'session_state') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN session_state jsonb DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'pending_changes') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN pending_changes jsonb DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sessions' AND column_name = 'last_sync') THEN
        ALTER TABLE public.workout_sessions ADD COLUMN last_sync timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Ajouter les colonnes IA dans workout_sets si elles n'existent pas
DO $$
BEGIN
    -- Métadonnées IA
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'predicted_rpe') THEN
        ALTER TABLE public.workout_sets ADD COLUMN predicted_rpe numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'actual_vs_predicted_performance') THEN
        ALTER TABLE public.workout_sets ADD COLUMN actual_vs_predicted_performance numeric;
    END IF;

    -- Timing détaillé
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'set_start_time') THEN
        ALTER TABLE public.workout_sets ADD COLUMN set_start_time timestamp with time zone;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'set_end_time') THEN
        ALTER TABLE public.workout_sets ADD COLUMN set_end_time timestamp with time zone;
    END IF;

    -- État avancé
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'is_dropset') THEN
        ALTER TABLE public.workout_sets ADD COLUMN is_dropset boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'is_failure') THEN
        ALTER TABLE public.workout_sets ADD COLUMN is_failure boolean DEFAULT false;
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 3: METTRE À JOUR LES INDEX EXISTANTS
-- ============================================================================

-- Créer les index pour performances s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON public.workout_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_status ON public.workout_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_session_metrics_session_id ON public.session_metrics(session_id);

-- ============================================================================
-- ÉTAPE 4: METTRE À JOUR LES TRIGGERS
-- ============================================================================

-- Créer la fonction de mise à jour si elle n'existe pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ajouter les triggers pour updated_at s'ils n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_workout_sessions_updated_at'
    ) THEN
        CREATE TRIGGER update_workout_sessions_updated_at 
          BEFORE UPDATE ON public.workout_sessions 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_workout_plans_updated_at'
    ) THEN
        CREATE TRIGGER update_workout_plans_updated_at 
          BEFORE UPDATE ON public.workout_plans 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ============================================================================
-- ÉTAPE 5: SYNCHRONISER LES DONNÉES WORKOUT -> WORKOUT_SESSIONS
-- ============================================================================

-- Fonction pour migrer les données de la table workouts vers workout_sessions
CREATE OR REPLACE FUNCTION migrate_workouts_to_sessions()
RETURNS integer AS $$
DECLARE
    migrated_count integer := 0;
    workout_record RECORD;
BEGIN
    FOR workout_record IN 
        SELECT * FROM public.workouts 
        WHERE id NOT IN (
            SELECT w.id FROM public.workouts w 
            INNER JOIN public.workout_sessions ws ON w.id = ws.id
        )
    LOOP
        INSERT INTO public.workout_sessions (
            id,
            user_id,
            name,
            description,
            status,
            total_volume,
            workout_duration_minutes,
            calories_burned,
            started_at,
            completed_at,
            created_at,
            updated_at
        ) VALUES (
            workout_record.id,
            workout_record.user_id,
            workout_record.name,
            COALESCE(workout_record.description, ''),
            CASE 
                WHEN workout_record.completed_at IS NOT NULL THEN 'completed'
                WHEN workout_record.started_at IS NOT NULL THEN 'paused'
                ELSE 'idle'
            END,
            0, -- total_volume sera calculé
            COALESCE(workout_record.duration_minutes, 0),
            COALESCE(workout_record.calories_burned, 0),
            workout_record.started_at,
            workout_record.completed_at,
            workout_record.created_at,
            NOW()
        ) ON CONFLICT (id) DO NOTHING;
        
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration (optionnel)
-- SELECT migrate_workouts_to_sessions() as workouts_migrated;

COMMIT;

-- ============================================================================
-- VÉRIFICATION FINALE
-- ============================================================================

-- Vérifier que les nouvelles colonnes existent
SELECT 
    'workout_sessions' as table_name,
    COUNT(*) as total_columns,
    COUNT(CASE WHEN column_name IN ('fatigue_level', 'performance_score', 'heart_rate_zone', 'smart_rest_timers') THEN 1 END) as ai_columns
FROM information_schema.columns 
WHERE table_name = 'workout_sessions' AND table_schema = 'public';

-- Vérifier les contraintes
SELECT 
    'Contraintes vérifiées' as status,
    COUNT(*) as foreign_keys_count
FROM information_schema.table_constraints 
WHERE table_name IN ('workout_sets', 'workout_sessions', 'session_metrics')
  AND constraint_type = 'FOREIGN KEY';

SELECT 'Migration terminée avec succès!' as final_status;