-- MIGRATION MULTI-PILIERS : NUTRITION + SOMMEIL + HYDRATATION
-- Cette migration rend TOUS les piliers prêts pour l'orchestrateur IA

-- ================================
-- 1. PILIER NUTRITION (meals table)
-- ================================

-- Ajout des colonnes nutritionnelles avancées
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS protein_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS carbs_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS fat_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS sugar_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS sodium_mg INTEGER,
ADD COLUMN IF NOT EXISTS meal_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS portion_size DECIMAL(6,2);

-- Ajout des colonnes IA pour nutrition
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS meal_quality_score INTEGER DEFAULT 0 CHECK (meal_quality_score >= 0 AND meal_quality_score <= 100),
ADD COLUMN IF NOT EXISTS nutrition_ai_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS meal_timing_score INTEGER DEFAULT 0 CHECK (meal_timing_score >= 0 AND meal_timing_score <= 100),
ADD COLUMN IF NOT EXISTS dietary_adherence_score INTEGER DEFAULT 0 CHECK (dietary_adherence_score >= 0 AND dietary_adherence_score <= 100),
ADD COLUMN IF NOT EXISTS ai_recommendations JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS macro_balance_score INTEGER DEFAULT 0 CHECK (macro_balance_score >= 0 AND macro_balance_score <= 100),
ADD COLUMN IF NOT EXISTS nutritional_density_score INTEGER DEFAULT 0 CHECK (nutritional_density_score >= 0 AND nutritional_density_score <= 100),
ADD COLUMN IF NOT EXISTS satiety_prediction_score INTEGER DEFAULT 0 CHECK (satiety_prediction_score >= 0 AND satiety_prediction_score <= 100);

-- Index pour améliorer les performances des requêtes IA nutrition
CREATE INDEX IF NOT EXISTS idx_meals_ai_scores ON meals (meal_quality_score, macro_balance_score, nutritional_density_score);
CREATE INDEX IF NOT EXISTS idx_meals_ai_analysis ON meals USING GIN (nutrition_ai_analysis);

-- ================================
-- 2. PILIER SOMMEIL (sleep_sessions table)  
-- ================================

-- Ajout des colonnes de données sommeil détaillées
ALTER TABLE sleep_sessions 
ADD COLUMN IF NOT EXISTS sleep_duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS bedtime TIME,
ADD COLUMN IF NOT EXISTS wake_time TIME,
ADD COLUMN IF NOT EXISTS deep_sleep_minutes INTEGER,
ADD COLUMN IF NOT EXISTS rem_sleep_minutes INTEGER,
ADD COLUMN IF NOT EXISTS light_sleep_minutes INTEGER,
ADD COLUMN IF NOT EXISTS awake_minutes INTEGER,
ADD COLUMN IF NOT EXISTS sleep_onset_minutes INTEGER,
ADD COLUMN IF NOT EXISTS night_awakenings INTEGER DEFAULT 0;

-- Ajout des colonnes IA pour sommeil
ALTER TABLE sleep_sessions 
ADD COLUMN IF NOT EXISTS sleep_quality_score INTEGER DEFAULT 0 CHECK (sleep_quality_score >= 0 AND sleep_quality_score <= 100),
ADD COLUMN IF NOT EXISTS sleep_ai_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS recovery_score INTEGER DEFAULT 0 CHECK (recovery_score >= 0 AND recovery_score <= 100),
ADD COLUMN IF NOT EXISTS bedtime_consistency_score INTEGER DEFAULT 0 CHECK (bedtime_consistency_score >= 0 AND bedtime_consistency_score <= 100),
ADD COLUMN IF NOT EXISTS sleep_debt_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS circadian_rhythm_score INTEGER DEFAULT 0 CHECK (circadian_rhythm_score >= 0 AND circadian_rhythm_score <= 100),
ADD COLUMN IF NOT EXISTS sleep_environment_score INTEGER DEFAULT 0 CHECK (sleep_environment_score >= 0 AND sleep_environment_score <= 100),
ADD COLUMN IF NOT EXISTS stress_impact_score INTEGER DEFAULT 0 CHECK (stress_impact_score >= 0 AND stress_impact_score <= 100);

-- Index pour améliorer les performances des requêtes IA sommeil
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_ai_scores ON sleep_sessions (sleep_quality_score, recovery_score, circadian_rhythm_score);
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_ai_analysis ON sleep_sessions USING GIN (sleep_ai_analysis);

-- ================================
-- 3. PILIER HYDRATATION (hydration_logs table)
-- ================================

-- Ajout des colonnes hydratation avancées
ALTER TABLE hydration_logs 
ADD COLUMN IF NOT EXISTS drink_type VARCHAR(50) DEFAULT 'water',
ADD COLUMN IF NOT EXISTS hydration_goal_ml INTEGER DEFAULT 2000,
ADD COLUMN IF NOT EXISTS temperature VARCHAR(20),
ADD COLUMN IF NOT EXISTS caffeine_content_mg INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS electrolyte_content JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ph_level DECIMAL(3,2);

-- Ajout des colonnes IA pour hydratation  
ALTER TABLE hydration_logs 
ADD COLUMN IF NOT EXISTS hydration_percentage DECIMAL(5,2) DEFAULT 0.0 CHECK (hydration_percentage >= 0 AND hydration_percentage <= 150),
ADD COLUMN IF NOT EXISTS hydration_ai_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS drink_frequency_score INTEGER DEFAULT 0 CHECK (drink_frequency_score >= 0 AND drink_frequency_score <= 100),
ADD COLUMN IF NOT EXISTS hydration_quality_score INTEGER DEFAULT 0 CHECK (hydration_quality_score >= 0 AND hydration_quality_score <= 100),
ADD COLUMN IF NOT EXISTS electrolyte_balance_score INTEGER DEFAULT 0 CHECK (electrolyte_balance_score >= 0 AND electrolyte_balance_score <= 100),
ADD COLUMN IF NOT EXISTS dehydration_risk_score INTEGER DEFAULT 0 CHECK (dehydration_risk_score >= 0 AND dehydration_risk_score <= 100),
ADD COLUMN IF NOT EXISTS optimal_timing_score INTEGER DEFAULT 0 CHECK (optimal_timing_score >= 0 AND optimal_timing_score <= 100),
ADD COLUMN IF NOT EXISTS beverage_quality_score INTEGER DEFAULT 0 CHECK (beverage_quality_score >= 0 AND beverage_quality_score <= 100);

-- Index pour améliorer les performances des requêtes IA hydratation
CREATE INDEX IF NOT EXISTS idx_hydration_logs_ai_scores ON hydration_logs (hydration_quality_score, electrolyte_balance_score, dehydration_risk_score);
CREATE INDEX IF NOT EXISTS idx_hydration_logs_ai_analysis ON hydration_logs USING GIN (hydration_ai_analysis);

-- ================================
-- 4. TRIGGERS AUTOMATIQUES IA
-- ================================

-- Fonction pour calculer automatiquement les scores IA nutrition
CREATE OR REPLACE FUNCTION calculate_meal_ai_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcul automatique du score qualité repas
    IF NEW.calories IS NOT NULL AND NEW.protein_g IS NOT NULL AND NEW.carbs_g IS NOT NULL AND NEW.fat_g IS NOT NULL THEN
        NEW.meal_quality_score := LEAST(100, GREATEST(0, 
            (CASE 
                WHEN NEW.calories BETWEEN 300 AND 800 THEN 30
                WHEN NEW.calories BETWEEN 150 AND 1200 THEN 20
                ELSE 10
            END) +
            (CASE 
                WHEN NEW.protein_g >= 15 THEN 25
                WHEN NEW.protein_g >= 8 THEN 15
                ELSE 5
            END) +
            (CASE 
                WHEN NEW.fiber_g >= 5 THEN 20
                WHEN NEW.fiber_g >= 2 THEN 10
                ELSE 0
            END) +
            (CASE 
                WHEN NEW.sugar_g <= 10 THEN 15
                WHEN NEW.sugar_g <= 25 THEN 8
                ELSE 0
            END) +
            10 -- Score de base
        ));
        
        -- Calcul score équilibre macro
        NEW.macro_balance_score := LEAST(100, GREATEST(0,
            50 + 
            (CASE WHEN (NEW.protein_g * 4 / NULLIF(NEW.calories, 0)) BETWEEN 0.15 AND 0.35 THEN 20 ELSE -10 END) +
            (CASE WHEN (NEW.carbs_g * 4 / NULLIF(NEW.calories, 0)) BETWEEN 0.45 AND 0.65 THEN 20 ELSE -10 END) +
            (CASE WHEN (NEW.fat_g * 9 / NULLIF(NEW.calories, 0)) BETWEEN 0.20 AND 0.35 THEN 10 ELSE -5 END)
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer automatiquement les scores IA sommeil
CREATE OR REPLACE FUNCTION calculate_sleep_ai_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcul automatique du score qualité sommeil
    IF NEW.sleep_duration_minutes IS NOT NULL THEN
        NEW.sleep_quality_score := LEAST(100, GREATEST(0,
            (CASE 
                WHEN NEW.sleep_duration_minutes BETWEEN 420 AND 540 THEN 40 -- 7-9h optimal
                WHEN NEW.sleep_duration_minutes BETWEEN 360 AND 600 THEN 30 -- 6-10h acceptable
                ELSE 15
            END) +
            (CASE 
                WHEN NEW.deep_sleep_minutes >= (NEW.sleep_duration_minutes * 0.15) THEN 25 -- 15%+ sommeil profond
                WHEN NEW.deep_sleep_minutes >= (NEW.sleep_duration_minutes * 0.10) THEN 15
                ELSE 5
            END) +
            (CASE 
                WHEN NEW.night_awakenings <= 1 THEN 20
                WHEN NEW.night_awakenings <= 3 THEN 10
                ELSE 0
            END) +
            15 -- Score de base
        ));
        
        -- Calcul score récupération
        NEW.recovery_score := LEAST(100, GREATEST(0,
            (NEW.sleep_quality_score * 0.6) + 
            (CASE WHEN NEW.sleep_efficiency >= 85 THEN 25 WHEN NEW.sleep_efficiency >= 75 THEN 15 ELSE 5 END) +
            (CASE WHEN NEW.rem_sleep_minutes >= (NEW.sleep_duration_minutes * 0.20) THEN 15 ELSE 5 END)
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer automatiquement les scores IA hydratation
CREATE OR REPLACE FUNCTION calculate_hydration_ai_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcul automatique du pourcentage hydratation
    IF NEW.amount_ml IS NOT NULL AND NEW.hydration_goal_ml IS NOT NULL THEN
        -- Obtenir le total journalier (simplifié pour cette démo)
        NEW.hydration_percentage := LEAST(150.0, (NEW.amount_ml::DECIMAL / NEW.hydration_goal_ml * 100));
        
        NEW.hydration_quality_score := LEAST(100, GREATEST(0,
            (CASE 
                WHEN NEW.drink_type = 'water' THEN 30
                WHEN NEW.drink_type IN ('herbal_tea', 'coconut_water') THEN 25
                WHEN NEW.drink_type IN ('green_tea', 'black_tea') THEN 20
                ELSE 10
            END) +
            (CASE 
                WHEN NEW.caffeine_content_mg = 0 THEN 25
                WHEN NEW.caffeine_content_mg <= 50 THEN 15
                ELSE 5
            END) +
            (CASE 
                WHEN NEW.amount_ml BETWEEN 200 AND 500 THEN 25 -- Quantité optimale par prise
                WHEN NEW.amount_ml BETWEEN 100 AND 750 THEN 15
                ELSE 5
            END) +
            20 -- Score de base
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Application des triggers
DROP TRIGGER IF EXISTS trigger_meal_ai_scores ON meals;
CREATE TRIGGER trigger_meal_ai_scores
    BEFORE INSERT OR UPDATE ON meals
    FOR EACH ROW EXECUTE FUNCTION calculate_meal_ai_scores();

DROP TRIGGER IF EXISTS trigger_sleep_ai_scores ON sleep_sessions;
CREATE TRIGGER trigger_sleep_ai_scores
    BEFORE INSERT OR UPDATE ON sleep_sessions
    FOR EACH ROW EXECUTE FUNCTION calculate_sleep_ai_scores();

DROP TRIGGER IF EXISTS trigger_hydration_ai_scores ON hydration_logs;
CREATE TRIGGER trigger_hydration_ai_scores
    BEFORE INSERT OR UPDATE ON hydration_logs
    FOR EACH ROW EXECUTE FUNCTION calculate_hydration_ai_scores();

-- ================================
-- 5. VUES AGRÉGÉES POUR ORCHESTRATEUR IA
-- ================================

-- Vue complète pour l'orchestrateur IA multi-piliers
CREATE OR REPLACE VIEW user_health_ai_dashboard AS
SELECT 
    u.id as user_id,
    -- Données workout (déjà prêtes)
    COALESCE(AVG(ws.ai_performance_score), 0) as avg_workout_performance,
    COALESCE(AVG(ws.ai_progress_score), 0) as avg_workout_progress,
    COALESCE(COUNT(ws.id), 0) as total_workouts,
    
    -- Données nutrition
    COALESCE(AVG(m.meal_quality_score), 0) as avg_meal_quality,
    COALESCE(AVG(m.macro_balance_score), 0) as avg_macro_balance,
    COALESCE(AVG(m.calories), 0) as avg_daily_calories,
    
    -- Données sommeil
    COALESCE(AVG(ss.sleep_quality_score), 0) as avg_sleep_quality,
    COALESCE(AVG(ss.recovery_score), 0) as avg_recovery_score,
    COALESCE(AVG(ss.sleep_duration_minutes), 0) as avg_sleep_duration,
    
    -- Données hydratation
    COALESCE(AVG(hl.hydration_quality_score), 0) as avg_hydration_quality,
    COALESCE(AVG(hl.hydration_percentage), 0) as avg_hydration_percentage,
    COALESCE(SUM(hl.amount_ml), 0) as total_daily_hydration,
    
    -- Score global santé (moyenne pondérée)
    ROUND(
        (COALESCE(AVG(ws.ai_performance_score), 0) * 0.3 + 
         COALESCE(AVG(m.meal_quality_score), 0) * 0.25 +
         COALESCE(AVG(ss.sleep_quality_score), 0) * 0.25 +
         COALESCE(AVG(hl.hydration_quality_score), 0) * 0.20)
    ) as overall_health_score,
    
    -- Dernière mise à jour
    GREATEST(
        COALESCE(MAX(ws.updated_at), '1970-01-01'::timestamp),
        COALESCE(MAX(m.updated_at), '1970-01-01'::timestamp),
        COALESCE(MAX(ss.updated_at), '1970-01-01'::timestamp),
        COALESCE(MAX(hl.updated_at), '1970-01-01'::timestamp)
    ) as last_activity
    
FROM users u
LEFT JOIN workout_sessions ws ON u.id = ws.user_id AND ws.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN meals m ON u.id = m.user_id AND m.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN sleep_sessions ss ON u.id = ss.user_id AND ss.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN hydration_logs hl ON u.id = hl.user_id AND hl.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id;

-- Commentaire final
COMMENT ON TABLE meals IS 'Table nutrition avec colonnes IA : meal_quality_score, macro_balance_score, nutrition_ai_analysis';
COMMENT ON TABLE sleep_sessions IS 'Table sommeil avec colonnes IA : sleep_quality_score, recovery_score, sleep_ai_analysis';
COMMENT ON TABLE hydration_logs IS 'Table hydratation avec colonnes IA : hydration_quality_score, hydration_percentage, hydration_ai_analysis';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '🎯 MIGRATION MULTI-PILIERS TERMINÉE !';
    RAISE NOTICE '✅ Nutrition : % colonnes IA ajoutées', 8;
    RAISE NOTICE '✅ Sommeil : % colonnes IA ajoutées', 8;
    RAISE NOTICE '✅ Hydratation : % colonnes IA ajoutées', 8;
    RAISE NOTICE '🤖 Triggers automatiques activés pour tous les piliers';
    RAISE NOTICE '📊 Vue orchestrateur IA créée : user_health_ai_dashboard';
END $$;