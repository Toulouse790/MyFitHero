-- ============================================================================
-- SCRIPT SQL SIMPLIFIÉ POUR MYFITHERO WORKOUT SYSTEM
-- Créer les tables une par une sans dépendances circulaires
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: CRÉER LA TABLE WORKOUT_PLANS EN PREMIER
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations de base
  name text NOT NULL,
  description text,
  
  -- Structure des exercices (JSON structuré)
  exercises jsonb NOT NULL DEFAULT '[]',
  
  -- Métadonnées du plan
  estimated_duration_minutes integer,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  tags text[] DEFAULT '{}',
  
  -- Catégorisation
  workout_type text CHECK (workout_type IN ('strength', 'cardio', 'power', 'endurance', 'flexibility', 'mixed')),
  muscle_groups text[] DEFAULT '{}',
  equipment_required text[] DEFAULT '{}',
  
  -- Statuts
  is_template boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_public boolean DEFAULT false,
  
  -- Usage et stats
  times_used integer DEFAULT 0,
  average_rating numeric DEFAULT 0,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- ÉTAPE 2: CRÉER LA TABLE WORKOUT_SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_plan_id uuid REFERENCES public.workout_plans(id),
  
  -- Informations de base
  name text NOT NULL,
  description text,
  
  -- État de la session
  status text DEFAULT 'idle' CHECK (status IN (
    'idle', 'warming-up', 'working', 'resting', 
    'transitioning', 'paused', 'completed', 'emergency-stop'
  )),
  
  -- Position actuelle dans le workout
  current_exercise_index integer DEFAULT 0,
  current_set_index integer DEFAULT 0,
  
  -- Métriques de session
  total_volume numeric DEFAULT 0,
  total_sets integer DEFAULT 0,
  average_rpe numeric DEFAULT 0,
  workout_duration_minutes integer DEFAULT 0,
  calories_burned integer DEFAULT 0,
  
  -- Facteurs adaptatifs pour l'IA
  fatigue_level numeric DEFAULT 0 CHECK (fatigue_level >= 0 AND fatigue_level <= 1),
  performance_score numeric DEFAULT 1 CHECK (performance_score >= 0 AND performance_score <= 1),
  heart_rate_zone integer DEFAULT 2 CHECK (heart_rate_zone >= 1 AND heart_rate_zone <= 5),
  
  -- Préférences utilisateur
  auto_progress_weight boolean DEFAULT true,
  smart_rest_timers boolean DEFAULT true,
  real_time_coaching boolean DEFAULT true,
  offline_mode boolean DEFAULT false,
  
  -- Timestamps
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  paused_at timestamp with time zone,
  last_sync timestamp with time zone DEFAULT now(),
  
  -- Support mode offline
  session_state jsonb DEFAULT '{}',
  pending_changes jsonb DEFAULT '[]',
  sync_status text DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error')),
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- ÉTAPE 3: CRÉER LA TABLE WORKOUT_SETS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workout_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises_library(id),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Position dans la session
  set_order integer NOT NULL,
  exercise_order integer NOT NULL,
  set_number integer NOT NULL,
  
  -- Données de performance
  weight numeric,
  reps integer,
  rpe integer CHECK (rpe >= 1 AND rpe <= 10),
  tempo text,
  distance_meters numeric,
  duration_seconds integer,
  
  -- Contexte et notes
  notes text,
  exercise_variation text,
  equipment_used text,
  
  -- Timing
  rest_duration_seconds integer,
  set_start_time timestamp with time zone,
  set_end_time timestamp with time zone,
  
  -- État
  is_completed boolean DEFAULT false,
  is_warmup boolean DEFAULT false,
  is_dropset boolean DEFAULT false,
  is_failure boolean DEFAULT false,
  
  -- Données physiologiques
  heart_rate_avg integer,
  heart_rate_max integer,
  
  -- Métadonnées IA
  predicted_rpe numeric,
  actual_vs_predicted_performance numeric,
  
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- ÉTAPE 4: CRÉER LA TABLE SESSION_METRICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.session_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid UNIQUE NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Métriques de volume et intensité
  total_volume numeric DEFAULT 0,
  volume_load numeric DEFAULT 0,
  training_stress_score numeric DEFAULT 0,
  intensity_load numeric DEFAULT 0,
  
  -- Métriques de fatigue
  fatigue_index numeric DEFAULT 0,
  readiness_score numeric DEFAULT 0,
  recovery_recommendation text,
  
  -- Données physiologiques
  average_heart_rate integer,
  max_heart_rate integer,
  heart_rate_zones jsonb DEFAULT '{}',
  calories_burned integer,
  estimated_vo2_max numeric,
  
  -- Analyse temporelle
  total_work_time_seconds integer,
  total_rest_time_seconds integer,
  work_rest_ratio numeric,
  workout_efficiency_score numeric,
  
  -- Analyse par muscle
  muscle_group_distribution jsonb DEFAULT '{}',
  movement_pattern_analysis jsonb DEFAULT '{}',
  exercise_type_breakdown jsonb DEFAULT '{}',
  
  -- Comparaisons
  compared_to_last_session jsonb DEFAULT '{}',
  personal_records jsonb DEFAULT '[]',
  performance_trends jsonb DEFAULT '{}',
  
  -- Recommandations IA
  ai_recommendations jsonb DEFAULT '[]',
  adaptation_suggestions jsonb DEFAULT '{}',
  next_session_preview jsonb DEFAULT '{}',
  
  calculation_version text DEFAULT '1.0',
  last_calculated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- ÉTAPE 5: CRÉER LA TABLE SYNC_QUEUE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  item_id text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('set', 'session', 'metrics', 'plan')),
  
  data jsonb NOT NULL,
  operation text DEFAULT 'upsert' CHECK (operation IN ('insert', 'update', 'upsert', 'delete')),
  
  sync_status text DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'completed', 'failed')),
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  
  last_error text,
  last_sync_attempt timestamp with time zone,
  
  priority integer DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  batch_id uuid,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- ÉTAPE 6: CRÉER LES INDEX POUR LES PERFORMANCES
-- ============================================================================

-- Index pour workout_plans  
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_active ON public.workout_plans(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_workout_plans_templates ON public.workout_plans(is_template) WHERE is_template = true;

-- Index pour workout_sessions
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_status ON public.workout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_status ON public.workout_sessions(user_id, status);

-- Index pour workout_sets
CREATE INDEX IF NOT EXISTS idx_workout_sets_session_id ON public.workout_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_user_id ON public.workout_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON public.workout_sets(exercise_id);

-- Index pour session_metrics
CREATE INDEX IF NOT EXISTS idx_session_metrics_user_id ON public.session_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_session_metrics_session_id ON public.session_metrics(session_id);

-- Index pour sync_queue
CREATE INDEX IF NOT EXISTS idx_sync_queue_user_status ON public.sync_queue(user_id, sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_priority ON public.sync_queue(priority, created_at) WHERE sync_status = 'pending';

-- ============================================================================
-- ÉTAPE 7: CRÉER LES TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER IF NOT EXISTS update_workout_sessions_updated_at 
  BEFORE UPDATE ON public.workout_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_workout_plans_updated_at 
  BEFORE UPDATE ON public.workout_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ÉTAPE 8: ACTIVER RLS ET CRÉER LES POLICIES
-- ============================================================================

-- Activer RLS
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- Policies pour workout_plans
DROP POLICY IF EXISTS "Users can view their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can view their own workout plans" ON public.workout_plans
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can manage their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can manage their own workout plans" ON public.workout_plans
    FOR ALL USING (auth.uid() = user_id);

-- Policies pour workout_sessions
DROP POLICY IF EXISTS "Users can view their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can view their own workout sessions" ON public.workout_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can manage their own workout sessions" ON public.workout_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Policies pour workout_sets
DROP POLICY IF EXISTS "Users can view their own workout sets" ON public.workout_sets;
CREATE POLICY "Users can view their own workout sets" ON public.workout_sets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own workout sets" ON public.workout_sets;
CREATE POLICY "Users can manage their own workout sets" ON public.workout_sets
    FOR ALL USING (auth.uid() = user_id);

-- Policies pour session_metrics
DROP POLICY IF EXISTS "Users can view their own session metrics" ON public.session_metrics;
CREATE POLICY "Users can view their own session metrics" ON public.session_metrics
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own session metrics" ON public.session_metrics;
CREATE POLICY "Users can manage their own session metrics" ON public.session_metrics
    FOR ALL USING (auth.uid() = user_id);

-- Policies pour sync_queue
DROP POLICY IF EXISTS "Users can view their own sync queue" ON public.sync_queue;
CREATE POLICY "Users can view their own sync queue" ON public.sync_queue
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own sync queue" ON public.sync_queue;
CREATE POLICY "Users can manage their own sync queue" ON public.sync_queue
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- ÉTAPE 9: VÉRIFICATION FINALE
-- ============================================================================

-- Vérifier que toutes les tables ont été créées
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('workout_plans', 'workout_sessions', 'workout_sets', 'session_metrics', 'sync_queue')
ORDER BY tablename;

-- Afficher un message de confirmation
SELECT 'Tables workout créées avec succès!' as status;