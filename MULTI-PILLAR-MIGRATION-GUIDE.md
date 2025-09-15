# 🎯 GUIDE DE MIGRATION MULTI-PILIERS

## Status Actuel
✅ **WORKOUT** : 100% IA-Ready (workouts_sessions avec ai_performance_score, ai_progress_score, etc.)  
❌ **NUTRITION** : Besoin de colonnes IA  
❌ **SOMMEIL** : Besoin de colonnes IA  
❌ **HYDRATATION** : Besoin de colonnes IA  

## 🚀 PLAN D'ACTION SUPABASE

### 1. NUTRITION (table `meals`)
**Via Supabase Dashboard → SQL Editor :**

```sql
-- Colonnes nutritionnelles de base
ALTER TABLE meals ADD COLUMN IF NOT EXISTS calories INTEGER;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS protein_g DECIMAL(6,2);
ALTER TABLE meals ADD COLUMN IF NOT EXISTS carbs_g DECIMAL(6,2);
ALTER TABLE meals ADD COLUMN IF NOT EXISTS fat_g DECIMAL(6,2);
ALTER TABLE meals ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(6,2);
ALTER TABLE meals ADD COLUMN IF NOT EXISTS meal_type VARCHAR(50);

-- Colonnes IA NUTRITION
ALTER TABLE meals ADD COLUMN IF NOT EXISTS meal_quality_score INTEGER DEFAULT 0;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS nutrition_ai_analysis JSONB DEFAULT '{}';
ALTER TABLE meals ADD COLUMN IF NOT EXISTS macro_balance_score INTEGER DEFAULT 0;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS nutritional_density_score INTEGER DEFAULT 0;
```

### 2. SOMMEIL (table `sleep_sessions`)
**Via Supabase Dashboard → SQL Editor :**

```sql
-- Colonnes sommeil détaillées
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS sleep_duration_minutes INTEGER;
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS bedtime TIME;
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS wake_time TIME;
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS deep_sleep_minutes INTEGER;
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS rem_sleep_minutes INTEGER;

-- Colonnes IA SOMMEIL
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS sleep_quality_score INTEGER DEFAULT 0;
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS sleep_ai_analysis JSONB DEFAULT '{}';
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS recovery_score INTEGER DEFAULT 0;
ALTER TABLE sleep_sessions ADD COLUMN IF NOT EXISTS circadian_rhythm_score INTEGER DEFAULT 0;
```

### 3. HYDRATATION (table `hydration_logs`)
**Via Supabase Dashboard → SQL Editor :**

```sql
-- Colonnes hydratation avancées
ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS drink_type VARCHAR(50) DEFAULT 'water';
ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_goal_ml INTEGER DEFAULT 2000;

-- Colonnes IA HYDRATATION
ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_percentage DECIMAL(5,2) DEFAULT 0.0;
ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_ai_analysis JSONB DEFAULT '{}';
ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS hydration_quality_score INTEGER DEFAULT 0;
ALTER TABLE hydration_logs ADD COLUMN IF NOT EXISTS electrolyte_balance_score INTEGER DEFAULT 0;
```

## 🤖 RÉSULTAT ATTENDU

Après migration, l'**ORCHESTRATEUR IA** aura accès à :

### NUTRITION 📊
- `calories`, `protein_g`, `carbs_g`, `fat_g`
- `meal_quality_score` (0-100)
- `nutrition_ai_analysis` (JSONB)
- `macro_balance_score` (0-100)

### SOMMEIL 😴
- `sleep_duration_minutes`, `deep_sleep_minutes`, `rem_sleep_minutes`
- `sleep_quality_score` (0-100)
- `sleep_ai_analysis` (JSONB)
- `recovery_score` (0-100)

### HYDRATATION 💧
- `amount_ml` (existant), `hydration_goal_ml`
- `hydration_quality_score` (0-100)
- `hydration_ai_analysis` (JSONB)
- `hydration_percentage` (0-150%)

## 📈 VISION ORCHESTRATEUR

```typescript
interface UserHealthProfile {
  // WORKOUT (✅ déjà prêt)
  avgWorkoutPerformance: number;
  workoutConsistency: number;
  
  // NUTRITION (🔄 après migration)
  avgMealQuality: number;
  macroBalance: number;
  calorieAdherence: number;
  
  // SOMMEIL (🔄 après migration)
  avgSleepQuality: number;
  recoveryScore: number;
  sleepConsistency: number;
  
  // HYDRATATION (🔄 après migration)
  hydrationAdherence: number;
  waterQuality: number;
  
  // SCORE GLOBAL
  overallHealthScore: number; // Calculé à partir des 4 piliers
}
```

## 🎯 PROCHAINES ÉTAPES

1. **Exécuter les migrations SQL via Supabase Dashboard**
2. **Créer les interfaces TypeScript pour les 3 nouveaux piliers**
3. **Implémenter les hooks database-mapping pour nutrition/sommeil/hydratation**
4. **Créer les composants sophistiqués pour chaque pilier**
5. **Développer l'orchestrateur IA multi-piliers**

Cette architecture permettra à vos **agents IA** d'avoir une **vision 360°** de la santé utilisateur ! 🚀