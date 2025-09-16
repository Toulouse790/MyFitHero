# 🔍 PROMPT AUDIT COMPLET - MyFitHero

## 📋 INSTRUCTIONS POUR L'AUDIT

Vous êtes un **expert senior en développement web, UX/UI et architecture logicielle**. Votre mission est de réaliser un **audit complet et approfondi** de l'application MyFitHero (React + TypeScript + Supabase + Tailwind CSS).

L'application est une **plateforme de fitness intelligente** avec reconnaissance alimentaire par IA, suivi d'entraînements, nutrition, sommeil, hydratation et fonctionnalités sociales.

## 🎯 OBJECTIFS DE L'AUDIT

1. **Qualité du Code** : Architecture, bonnes pratiques, performance
2. **Routes & Navigation** : Structure, logique, expérience de navigation
3. **Parcours Utilisateur** : UX, conversion, engagement, rétention
4. **Sécurité & Performance** : Vulnérabilités, optimisations
5. **Accessibilité & Inclusivité** : WCAG, usabilité universelle

---

## 🔧 1. AUDIT TECHNIQUE & CODE

### **Architecture & Structure**
```
Analysez la structure du projet MyFitHero :
- Organisation des dossiers (/src/features, /components, /shared)
- Séparation des responsabilités (hooks, services, types)
- Patterns architecturaux utilisés (feature-based, atomic design)
- Cohérence des conventions de nommage
- Gestion des dépendances et imports

Points à vérifier :
✓ Modularité et réutilisabilité des composants
✓ Couplage faible entre modules
✓ Séparation logique métier / présentation
✓ Gestion d'état centralisée vs locale
✓ Configuration et variables d'environnement
```

### **Qualité du Code TypeScript**
```
Examinez le code TypeScript pour :
- Typage strict et cohérent
- Interfaces et types bien définis
- Gestion d'erreurs robuste
- Patterns React modernes (hooks, memo, suspense)
- Performance (re-renders inutiles, optimisations)

Fichiers critiques à analyser :
📁 src/features/*/hooks/
📁 src/features/*/services/
📁 src/shared/types/
📁 src/core/api/
📁 src/store/

Questions clés :
• Les types sont-ils exhaustifs et précis ?
• Y a-t-il des any/unknown non justifiés ?
• La gestion d'erreur est-elle uniforme ?
• Les hooks sont-ils optimisés (dependencies, callbacks) ?
• Existe-t-il du code mort ou dupliqué ?
```

### **Performance & Optimisations**
```
Analysez les performances :
- Bundle size et code splitting
- Lazy loading des composants
- Memoization (React.memo, useMemo, useCallback)
- Gestion des images et assets
- Service Worker et caching

Métriques à vérifier :
🚀 Core Web Vitals (LCP, FID, CLS)
🚀 First Contentful Paint
🚀 Time to Interactive
🚀 Bundle size < 1MB
🚀 Network requests optimisées
```

### **Sécurité**
```
Audit de sécurité :
- Authentification Supabase (JWT, sessions)
- Validation côté client/serveur
- Protection XSS/CSRF
- Gestion des secrets et variables sensibles
- Permissions et autorisations

Vérifications :
🔐 Row Level Security (RLS) Supabase
🔐 Validation des inputs utilisateur
🔐 Headers de sécurité
🔐 Gestion des erreurs (pas d'exposition d'infos sensibles)
🔐 Rate limiting et protection DDoS
```

---

## 🗺️ 2. AUDIT ROUTES & NAVIGATION

### **Architecture de Routage**
```
Analysez la structure de navigation :
- Configuration des routes (React Router, Wouter)
- Routes publiques vs privées
- Guards d'authentification
- Gestion des redirections
- URLs et SEO-friendly paths

Structure attendue :
📍 / (Landing/Dashboard)
📍 /auth (Login/Signup)
📍 /onboarding (Première configuration)
📍 /dashboard (Tableau de bord principal)
📍 /workout (Entraînements)
📍 /nutrition (Nutrition + scan photo)
📍 /hydration (Suivi hydratation)
📍 /sleep (Suivi sommeil)
📍 /profile (Profil utilisateur)
📍 /social (Communauté)
📍 /analytics (Statistiques)
```

### **Expérience de Navigation**
```
Évaluez l'expérience utilisateur :
- Cohérence de la navigation
- Breadcrumbs et orientation
- États de chargement
- Gestion des erreurs 404/500
- Navigation mobile vs desktop

Points critiques :
🧭 Navigation intuitive et prévisible
🧭 Retour en arrière fonctionnel
🧭 Deep linking (partage d'URLs)
🧭 Progressive Web App (PWA) navigation
🧭 Accessibilité clavier (tab navigation)
```

### **Performance de Navigation**
```
Optimisations de navigation :
- Preloading des routes critiques
- Code splitting par route
- Lazy loading des pages lourdes
- Prefetching intelligent
- Cache de navigation

Métriques :
⚡ Temps de transition entre pages < 200ms
⚡ Lazy loading des composants lourds
⚡ Préchargement des routes probables
⚡ Navigation offline (PWA)
```

---

## 👤 3. AUDIT PARCOURS UTILISATEUR

### **Onboarding & Première Expérience**
```
Analysez le parcours d'acquisition :

1. **Landing Page** :
   - Message de valeur clair
   - Call-to-action efficace
   - Preuve sociale (témoignages, stats)
   - Performance et temps de chargement

2. **Inscription/Connexion** :
   - Simplicité du processus
   - Options de connexion (email, social)
   - Validation en temps réel
   - Gestion des erreurs user-friendly

3. **Onboarding** :
   - Collecte d'informations progressive
   - Personnalisation initiale (sport, objectifs)
   - Configuration première utilisation
   - Introduction aux fonctionnalités clés

4. **Première utilisation** :
   - Tutorial interactif
   - Quick wins immédiats
   - Configuration des données de base
   - Motivation initiale

Métriques d'engagement :
📈 Taux de conversion inscription
📈 Taux de complétion onboarding
📈 Time to first value
📈 Rétention J1, J7, J30
```

### **Parcours Fonctionnels Principaux**

#### **🏋️ Parcours Workout**
```
Auditez le flux d'entraînement :
1. Sélection/création programme
2. Démarrage session
3. Suivi exercices en temps réel
4. Enregistrement performances
5. Feedback et progression

UX à évaluer :
• Interface pendant l'effort (lisibilité, simplicité)
• Gestion du temps et des repos
• Historique et progression visible
• Motivation et gamification
• Synchronisation avec wearables
```

#### **🍎 Parcours Nutrition**
```
Analysez le flux nutritionnel :
1. Scan photo d'aliment (feature star)
2. Validation/ajustement reconnaissance IA
3. Ajout manual si besoin
4. Suivi calories et macros
5. Recommandations personnalisées

Points critiques :
• Précision reconnaissance IA
• Simplicité d'usage scan photo
• Feedback immédiat utilisateur
• Base de données aliments complète
• Conseils nutritionnels personnalisés
```

#### **💧 Parcours Hydratation & 😴 Sommeil**
```
Évaluez les parcours de suivi :
- Simplicité d'ajout données
- Rappels et notifications
- Visualisation tendances
- Objectifs personnalisés
- Corrélations avec performance

Engagement :
• Fréquence d'utilisation
• Gamification (streaks, objectifs)
• Notifications pertinentes
• Impact sur motivation globale
```

#### **👥 Parcours Social**
```
Analysez l'engagement communautaire :
1. Découverte de la communauté
2. Partage de réussites
3. Défis et challenges
4. Interaction avec autres utilisateurs
5. Motivation par les pairs

Métriques sociales :
🤝 Taux d'adoption fonctionnalités sociales
🤝 Engagement posts/commentaires
🤝 Rétention via aspect social
🤝 Viralité et invitations
```

### **Rétention & Engagement Long Terme**
```
Stratégies de fidélisation :
- Système de progression visible
- Objectifs personnalisés évolutifs
- Récompenses et achievements
- Contenu personnalisé
- Notifications intelligentes

Analytics comportementaux :
📊 Session duration moyenne
📊 Feature adoption rate
📊 Churn rate et causes
📊 Lifetime value utilisateur
📊 Net Promoter Score (NPS)
```

---

## 📱 4. AUDIT UX/UI & DESIGN

### **Design System & Cohérence**
```
Évaluez la cohérence visuelle :
- Respect du design system
- Couleurs et typographie cohérentes
- Spacing et layout uniformes
- Components réutilisables
- Responsive design

Fichiers à analyser :
🎨 src/shared/theme.ts
🎨 src/components/ui/
🎨 tailwind.config.ts
🎨 Design tokens et variables CSS
```

### **Accessibilité (WCAG)**
```
Audit accessibilité complet :
- Contraste des couleurs (4.5:1 minimum)
- Navigation clavier complète
- ARIA labels et roles
- Screen readers compatibility
- Focus management

Tests requis :
♿ Lighthouse accessibility score
♿ axe-core automated testing
♿ Manual keyboard navigation
♿ Screen reader testing (NVDA/JAWS)
♿ Color blindness simulation
```

### **Mobile-First & Responsive**
```
Responsive design audit :
- Mobile-first approach
- Breakpoints cohérents
- Touch targets appropriés (44px min)
- Performance mobile
- PWA capabilities

Devices à tester :
📱 iPhone (Safari)
📱 Android (Chrome)
📱 Tablet (iPad, Android)
💻 Desktop (Chrome, Firefox, Safari, Edge)
```

---

## 🔄 5. AUDIT INTÉGRATIONS & APIs

### **Supabase Integration**
```
Analysez l'intégration base de données :
- Structure des tables optimisée
- Relations et contraintes
- Row Level Security (RLS)
- Performance des requêtes
- Real-time subscriptions

Schemas critiques :
🗄️ users, profiles
🗄️ workouts, exercises, sets
🗄️ nutrition_entries, food_items
🗄️ hydration, sleep_entries
🗄️ social_posts, challenges
```

### **APIs Externes**
```
Évaluez les intégrations :
- API reconnaissance alimentaire
- Services wearables (Fitbit, Apple Health)
- Analytics (Google Analytics)
- Notifications push
- Error tracking (Sentry)

Performance & Reliability :
🔌 Temps de réponse < 2s
🔌 Gestion des timeouts
🔌 Fallbacks en cas d'erreur
🔌 Rate limiting respect
🔌 Monitoring et alertes
```

---

## 📊 6. DELIVRABLES ATTENDUS

### **Rapport d'Audit Structuré**
```
1. EXECUTIVE SUMMARY
   - Score global (/100)
   - Points forts identifiés
   - Problèmes critiques
   - ROI des améliorations

2. AUDIT TECHNIQUE
   - Architecture et code quality
   - Performance et optimisations
   - Sécurité et vulnerabilités
   - Recommendations techniques

3. AUDIT UX/PARCOURS
   - Analyse des conversions
   - Points de friction identifiés
   - Opportunités d'amélioration
   - Priorités UX

4. PLAN D'ACTION PRIORISÉ
   - Quick wins (1-2 semaines)
   - Améliorations moyennes (1-2 mois)
   - Évolutions long terme (3-6 mois)
   - Estimation effort/impact

5. BENCHMARKS & KPIs
   - Métriques actuelles vs. industry standards
   - Objectifs recommandés
   - Méthodes de mesure
```

### **Livrables Techniques**
```
📋 Checklist des corrections prioritaires
🐛 Issues GitHub avec labels de priorité
📈 Dashboard de métriques recommandées
🧪 Plan de tests utilisateurs
📚 Documentation des bonnes pratiques
🔄 Roadmap d'améliorations
```

---

## ⚡ MÉTHODOLOGIE D'AUDIT

### **Outils Recommandés**
```
🔍 Code Analysis :
- ESLint + TypeScript strict
- SonarQube / CodeClimate
- Bundle analyzer (webpack-bundle-analyzer)
- Performance profiler (React DevTools)

🔍 UX Testing :
- Hotjar / FullStory (heatmaps, recordings)
- Google Analytics / Mixpanel
- UserTesting / Maze (user research)
- Lighthouse / PageSpeed Insights

🔍 Accessibility :
- axe-core / axe DevTools
- WAVE (Web Accessibility Evaluation Tool)
- Color contrast analyzers
- Screen reader testing
```

### **Approche Méthodologique**
```
1. PHASE DÉCOUVERTE (2-3 jours)
   - Analyse statique du code
   - Mapping des fonctionnalités
   - Identification personas/use cases

2. PHASE TECHNIQUE (3-4 jours)
   - Tests automatisés
   - Review architecture
   - Performance benchmarking
   - Security assessment

3. PHASE UX (3-4 jours)
   - Tests utilisateurs modérés
   - Analyse des parcours
   - Heatmaps et analytics
   - Accessibility audit

4. PHASE SYNTHÈSE (2-3 jours)
   - Consolidation findings
   - Priorisation recommendations
   - Estimation effort/impact
   - Présentation des résultats
```

---

## 🎯 QUESTIONS CLÉS À RÉSOUDRE

### **Business & Strategy**
- L'app répond-elle efficacement aux besoins des utilisateurs fitness ?
- La reconnaissance alimentaire est-elle un différenciateur suffisant ?
- Le modèle d'engagement (freemium, social) est-il optimal ?
- Quelles sont les opportunités de monétisation ?

### **Technique & Scalabilité**
- L'architecture peut-elle supporter 10x+ utilisateurs ?
- Les performances sont-elles optimales sur tous devices ?
- La sécurité est-elle enterprise-grade ?
- La maintenance et évolution sont-elles facilitées ?

### **UX & Adoption**
- L'onboarding maximise-t-il l'adoption ?
- Les parcours principaux sont-ils frictionless ?
- La rétention long-terme est-elle assurée ?
- L'accessibilité est-elle universelle ?

---

**🔥 MISSION : Fournir un audit actionable qui transforme MyFitHero en application fitness de référence avec des scores Lighthouse 95+ et une adoption utilisateur maximale.**

*Utilisez ce prompt avec un expert technique senior pour obtenir un audit complet et des recommandations précises pour optimiser votre application.*