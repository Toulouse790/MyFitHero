# 🚀 Guide d'Exécution - Migration des Colonnes IA

## ✅ **ÉTAPES FINALES POUR ACTIVER L'IA**

### **1. Exécuter le Script de Migration**

Vous devez exécuter le fichier `final-ia-migration.sql` dans votre console Supabase :

#### **Option A: Via l'interface web Supabase**
1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Sélectionner votre projet `zfmlzxhxhaezdkzjanbc`
3. Aller dans **SQL Editor**
4. Copier le contenu de `final-ia-migration.sql`
5. Exécuter le script
6. Vérifier que les colonnes ont été ajoutées

#### **Option B: Via psql (si vous avez les credentials admin)**
```bash
psql -h aws-0-eu-central-1.pooler.supabase.com -p 5432 -d postgres -U postgres.zfyghriwqyupwxqdgtac -f final-ia-migration.sql
```

### **2. Colonnes IA qui seront ajoutées**

#### **Dans `workout_sessions`:**
- `fatigue_level` (numeric 0-1) - Niveau de fatigue utilisateur
- `performance_score` (numeric 0-1) - Score de performance IA  
- `heart_rate_zone` (integer 1-5) - Zone cardio actuelle
- `auto_progress_weight` (boolean) - Progression auto des poids
- `smart_rest_timers` (boolean) - Temps de repos intelligent
- `real_time_coaching` (boolean) - Coaching temps réel activé
- `session_state` (jsonb) - État de session pour sync offline
- `pending_changes` (jsonb) - Changements en attente de sync
- `last_sync` (timestamp) - Dernière synchronisation

#### **Dans `workout_sets`:**
- `weight` (numeric) - Poids utilisé
- `reps` (integer) - Nombre de répétitions
- `rpe` (integer 1-10) - Rate of Perceived Exertion
- `predicted_rpe` (numeric) - RPE prédit par l'IA
- `actual_vs_predicted_performance` (numeric) - Écart réel vs prédit
- `set_start_time` / `set_end_time` (timestamp) - Timing précis
- `rest_time_seconds` (integer) - Temps de repos
- `is_dropset` / `is_failure` (boolean) - Type d'entraînement
- `technique_score` (integer 1-10) - Score technique

### **3. Après la Migration**

Une fois le script exécuté, nos composants sophistiqués pourront :

✅ **Collecter des données IA** pour l'orchestrateur  
✅ **Analyser les performances** en temps réel  
✅ **Prédire les besoins** d'entraînement  
✅ **Synchroniser offline** les changements  
✅ **Fournir du coaching** adaptatif  

### **4. Test des Composants**

Après la migration, nous pourrons tester :

```typescript
// Test du SophisticatedWorkoutFlowManager
import { SophisticatedWorkoutFlowManager } from '@/features/workout/components/SophisticatedWorkoutFlowManager_v2';

// Test des hooks Supabase
import { useWorkoutSession, useWorkoutSets } from '@/features/workout/hooks/useSupabaseWorkout';
```

## 🎯 **RÉSULTAT ATTENDU**

Après cette migration, les **agents IA** auront accès à :

- **Données physiologiques** (fatigue, performance, cardio)
- **Préférences utilisateur** (progression auto, coaching)
- **Métriques d'entraînement** détaillées
- **Historique de performance** avec prédictions
- **État de synchronisation** pour mode offline

---

## ⚠️ **IMPORTANT**

**Exécutez le script `final-ia-migration.sql` maintenant** pour activer toutes les fonctionnalités IA !

Une fois fait, confirmez-moi et nous procéderons aux tests finaux. 🚀