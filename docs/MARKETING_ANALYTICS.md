# Marketing Analytics - Guide d'utilisation

## Vue d'ensemble

Le système d'analytics marketing de MyFitHero permet de suivre précisément l'efficacité de la page d'accueil, les conversions, et l'engagement des utilisateurs.

## Architecture

### Services
- **`marketing-analytics.service.ts`** : Service principal pour la collecte et l'analyse des métriques
- **`useLandingAnalytics.ts`** : Hook React pour l'intégration dans les composants

### Composants
- **`LandingAnalyticsDashboard.tsx`** : Dashboard en temps réel pour visualiser les métriques

## Métriques collectées

### 1. Métriques de base
- **Vues de page** : Nombre total de visites
- **Temps passé** : Durée moyenne sur la page
- **Taux de rebond** : Pourcentage d'utilisateurs qui quittent immédiatement
- **Scroll depth** : Profondeur de défilement (25%, 50%, 75%, 100%)

### 2. Événements d'engagement
- **Clics sur CTA** : Suivi de tous les boutons d'action
- **Interactions vidéo** : Play, pause, fin de lecture
- **Navigation sections** : Temps passé par section
- **Clics externes** : Liens vers réseaux sociaux, support

### 3. Funnel de conversion
- **Page vue** → **Engagement** → **Intention** → **Action** → **Conversion**
- Taux de conversion par étape
- Identification des points de friction

### 4. Données démographiques
- **Localisation** : Pays, région
- **Appareil** : Desktop, mobile, tablet
- **Navigateur** : Chrome, Safari, Firefox, etc.
- **Source de trafic** : Direct, organique, payant, social

## Utilisation

### Hook useLandingAnalytics

```typescript
const {
  trackPageView,
  trackCTAClick,
  trackScroll,
  trackTimeSpent,
  trackVideoPlay,
  trackSectionView,
  analytics
} = useLandingAnalytics();

// Exemple d'utilisation
const handleCTAClick = (ctaType: string, placement: string) => {
  trackCTAClick(ctaType, placement);
  // Logique de l'action...
};
```

### Dashboard Analytics

```typescript
import { LandingAnalyticsDashboard } from '@/features/landing/components';

// Dans un composant admin
<LandingAnalyticsDashboard />
```

## Événements personnalisés

### Suivi d'une section
```typescript
trackSectionView('hero', 15000); // Section hero, 15 secondes
```

### Suivi d'une conversion
```typescript
trackCTAClick('signup', 'hero-primary'); // Inscription depuis le héro
```

### Suivi d'engagement vidéo
```typescript
trackVideoPlay('hero-video', 0.75); // 75% de la vidéo regardée
```

## Configuration Supabase

### Table : landing_analytics
```sql
CREATE TABLE landing_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  user_session UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  page_url TEXT,
  user_agent TEXT,
  ip_address INET
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_landing_analytics_type_time ON landing_analytics(event_type, timestamp);
CREATE INDEX idx_landing_analytics_session ON landing_analytics(user_session);
```

### Row Level Security (RLS)
```sql
-- Lecture publique pour le dashboard
CREATE POLICY "Public read access" ON landing_analytics
  FOR SELECT USING (true);

-- Écriture pour les événements analytics
CREATE POLICY "Insert analytics events" ON landing_analytics
  FOR INSERT WITH CHECK (true);
```

## Métriques calculées

### 1. Taux de conversion
- **Visiteur → Lead** : Pourcentage d'utilisateurs qui s'inscrivent à la newsletter
- **Lead → Inscription** : Pourcentage de leads qui créent un compte
- **Inscription → Activation** : Pourcentage d'utilisateurs qui complètent l'onboarding

### 2. Engagement par section
- **Temps moyen par section**
- **Taux de scroll par section**
- **Clics par section**

### 3. Performance des CTA
- **CTR par placement** : Hero, features, pricing, footer
- **Conversion par type** : Inscription, essai gratuit, contact

## Optimisations recommandées

### 1. A/B Testing
- Tester différentes versions des CTA
- Optimiser les messages du héro
- Tester les prix et offres

### 2. Personnalisation
- Adapter le contenu selon la source de trafic
- Personnaliser les CTA selon l'appareil
- Modifier les messages selon l'heure/jour

### 3. Performance
- Optimiser les sections avec faible engagement
- Réduire les points de friction identifiés
- Améliorer le contenu des sections peu consultées

## Alertes et monitoring

### Alertes automatiques
- Chute du taux de conversion (-20%)
- Augmentation du taux de rebond (+30%)
- Temps de chargement > 3 secondes
- Erreurs JavaScript critiques

### Rapports quotidiens
- Résumé des métriques clés
- Comparaison avec la période précédente
- Identification des tendances

## Intégration avec d'autres services

### Google Analytics 4
```typescript
// Envoi parallèle vers GA4
gtag('event', 'landing_cta_click', {
  cta_type: ctaType,
  placement: placement,
  timestamp: Date.now()
});
```

### Facebook Pixel
```typescript
// Suivi des conversions Facebook
fbq('track', 'Lead', {
  content_name: 'landing_signup',
  content_category: 'registration'
});
```

## Conformité RGPD

- Consentement explicite pour le tracking
- Anonymisation des données personnelles
- Droit à l'effacement respecté
- Durée de conservation limitée (12 mois)

## Maintenance

### Nettoyage automatique
- Suppression des données > 12 mois
- Agrégation des métriques anciennes
- Archivage des données importantes

### Tests de performance
- Monitoring de l'impact sur les performances
- Tests de charge du dashboard
- Optimisation des requêtes analytics