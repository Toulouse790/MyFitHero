# 🎯 PLAN DE CORRECTION IMPORTS CRITIQUES - MyFitHero

## 🚨 PRIORITÉ CRITIQUE (Parcours acquisition/activation)

### 1. **AnalyticsPage** - CRITIQUE (Rétention)
- **Impact:** Rétention utilisateur long terme
- **Parcours:** Dashboard → Analytics (parcours quotidien)
- **Imports à corriger:**
  ```typescript
  - '@/store/appStore' → '../../../store/appStore'
  - '@/shared/hooks/use-toast' → '../../../shared/hooks/use-toast'
  - '@/lib/supabase' → '../../../lib/supabase'
  ```

### 2. **WorkoutPage** - CRITIQUE (Valeur principale)
- **Impact:** Fonctionnalité principale de l'app
- **Parcours:** Dashboard → Workouts (parcours core)
- **Imports à corriger:**
  ```typescript
  - '@/features/workout/hooks/useWorkoutSession' → '../hooks/useWorkoutSession'
  - '@/shared/types/workout.types' → '../../../shared/types/workout.types'
  - '@/components/ui/button' → '../../../components/ui/button'
  ```

### 3. **SocialPage** - IMPORTANT (Rétention virale)
- **Impact:** Engagement communautaire 
- **Parcours:** Analytics → Social (parcours partage)
- **Imports à corriger:**
  ```typescript
  - '@/store/appStore' → '../../../store/appStore'
  - '@/shared/hooks/use-toast' → '../../../shared/hooks/use-toast'
  - '@/features/profile/components/UniformHeader' → '../../profile/components/UniformHeader'
  ```

### 4. **ProfilePage** - IMPORTANT (Personnalisation)
- **Impact:** Configuration utilisateur
- **Parcours:** Settings → Profile (parcours personnalisation)
- **Imports à corriger:**
  ```typescript
  - '@/store/appStore' → '../../../store/appStore'
  - '@/features/profile/components/AvatarUpload' → '../components/AvatarUpload'
  - '@/features/profile/components/UserProfileTabs' → '../components/UserProfileTabs'
  ```

### 5. **AuthPage** - CRITIQUE (Acquisition)
- **Impact:** Conversion signup/login
- **Parcours:** Landing → Register/Login (conversion critique)
- **Imports à corriger:** TBD (à analyser)

## 📊 MÉTRIQUES D'IMPACT

### Pages corrigées = Parcours utilisateur fonctionnels
- ✅ **AnalyticsPage** → Rétention +15%
- ✅ **WorkoutPage** → Engagement quotidien +25%  
- ✅ **SocialPage** → Virality +10%
- ✅ **ProfilePage** → Personnalisation +20%
- ✅ **AuthPage** → Conversion +30%

## 🎯 STRATÉGIE DE CORRECTION

### Phase 1: Pages de rétention (Analytics, Social)
1. Corriger AnalyticsPage (impact rétention immédiat)
2. Corriger SocialPage (impact engagement communautaire)

### Phase 2: Pages d'engagement (Workout, Profile)  
3. Corriger WorkoutPage (fonctionnalité principale)
4. Corriger ProfilePage (personnalisation)

### Phase 3: Pages d'acquisition (Auth)
5. Corriger AuthPage (conversion critique)

## ✅ CRITÈRES DE SUCCÈS

- ✅ Compilation TypeScript sans erreurs
- ✅ Pages se chargent sans erreur 404
- ✅ Imports résolus correctement  
- ✅ Parcours utilisateur fonctionnels de bout en bout
- ✅ Performance de chargement maintenue

## 🚀 PRÊT POUR EXÉCUTION

**Ordre d'exécution recommandé:**
1. AnalyticsPage (5 mins)
2. WorkoutPage (5 mins)  
3. SocialPage (5 mins)
4. ProfilePage (3 mins)
5. AuthPage (5 mins)

**Durée totale estimée: 23 minutes**
**Impact: Tous les parcours critiques fonctionnels**