-- ============================================================================
-- MIGRATION FINALE SIMPLIFIÉE - SEULEMENT LES 3 COLONNES MANQUANTES
-- ============================================================================

BEGIN;

-- Ajouter les 3 colonnes manquantes dans workout_sets
DO $$
BEGIN
    RAISE NOTICE 'Ajout des colonnes manquantes dans workout_sets...';
    
    -- Temps de repos entre les sets
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'rest_time_seconds') THEN
        ALTER TABLE public.workout_sets ADD COLUMN rest_time_seconds integer;
        RAISE NOTICE '✅ Ajouté: rest_time_seconds';
    ELSE
        RAISE NOTICE '⚠️ rest_time_seconds existe déjà';
    END IF;
    
    -- Score technique (1-10)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'technique_score') THEN
        ALTER TABLE public.workout_sets ADD COLUMN technique_score integer CHECK (technique_score >= 1 AND technique_score <= 10);
        RAISE NOTICE '✅ Ajouté: technique_score';
    ELSE
        RAISE NOTICE '⚠️ technique_score existe déjà';
    END IF;
    
    -- Timestamp de mise à jour
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workout_sets' AND column_name = 'updated_at') THEN
        ALTER TABLE public.workout_sets ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE '✅ Ajouté: updated_at';
    ELSE
        RAISE NOTICE '⚠️ updated_at existe déjà';
    END IF;
END $$;

-- Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

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
        RAISE NOTICE '✅ Trigger créé pour workout_sets.updated_at';
    ELSE
        RAISE NOTICE '⚠️ Trigger update_workout_sets_updated_at existe déjà';
    END IF;
END $$;

COMMIT;

-- Vérification finale
SELECT 
    '🎉 MIGRATION FINALE TERMINÉE !' as status,
    'Toutes les colonnes IA sont maintenant disponibles' as message;

-- Lister toutes les colonnes workout_sets pour confirmation
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'workout_sets' 
  AND table_schema = 'public'
ORDER BY ordinal_position;