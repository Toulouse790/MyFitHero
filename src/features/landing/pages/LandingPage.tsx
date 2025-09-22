import React from 'react';
import { 
  HeroSection,
  FeatureSection,
  TestimonialsSection,
  PricingSection,
  CTASection
} from '@/features/landing/components';
import { useLandingContent, useLandingAnalytics } from '@/features/landing/hooks';
import { Dumbbell, TrendingUp, Users, Award, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { content, loading: contentLoading } = useLandingContent();
  const { trackCTAClick } = useLandingAnalytics();

  // Sample data for components (replace with actual content when available)
  const heroData = {
    title: 'Transformez votre condition physique avec MyFitHero',
    subtitle: 'Rejoignez plus de 10 000 utilisateurs qui ont atteint leurs objectifs fitness',
    description: 'L\'application de fitness nouvelle génération qui s\'adapte à votre rythme de vie. Entraînements personnalisés, suivi intelligent et communauté motivante.',
    primaryAction: {
      text: 'Commencer gratuitement',
      onClick: () => trackCTAClick('hero'),
    },
    secondaryAction: {
      text: 'Voir la démo',
      onClick: () => console.log('Demo clicked'),
    },
    videoUrl: '/videos/hero-demo.mp4',
    trustIndicators: [
      { text: '10 000+ utilisateurs actifs' },
      { text: '4.8/5 étoiles sur les stores' },
      { text: 'Certifié par des experts' },
    ],
  };

  const featuresData = [
    {
      id: 'workout-ai',
      title: 'IA d\'entraînement personnalisé',
      description: 'Notre intelligence artificielle adapte vos séances selon vos progrès, votre niveau et vos objectifs.',
      icon: <Dumbbell className="w-6 h-6" />,
      benefits: ['Plans adaptatifs', 'Progression optimisée', 'Recommandations intelligentes'],
    },
    {
      id: 'analytics',
      title: 'Analyses avancées',
      description: 'Visualisez vos progrès avec des graphiques détaillés et des insights personnalisés.',
      icon: <TrendingUp className="w-6 h-6" />,
      benefits: ['Métriques détaillées', 'Tendances de performance', 'Rapports hebdomadaires'],
    },
    {
      id: 'community',
      title: 'Communauté motivante',
      description: 'Connectez-vous avec d\'autres passionnés de fitness pour rester motivé et partager vos succès.',
      icon: <Users className="w-6 h-6" />,
      benefits: ['Défis communautaires', 'Support mutuel', 'Partage de réussites'],
    },
    {
      id: 'expert-support',
      title: 'Support d\'experts',
      description: 'Accès à des coachs certifiés et nutritionnistes pour un accompagnement professionnel.',
      icon: <Award className="w-6 h-6" />,
      benefits: ['Consultations en ligne', 'Plans nutritionnels', 'Conseils personnalisés'],
    },
  ];

  const testimonialsData = [
    {
      id: '1',
      name: 'Marie Dupont',
      role: 'Manager',
      content: 'MyFitHero a complètement transformé ma routine fitness. J\'ai perdu 15kg en 6 mois !',
      rating: 5,
      avatar: '/images/avatars/marie.jpg',
      verified: true,
      location: 'Paris, France',
    },
    {
      id: '2',
      name: 'Thomas Martin',
      role: 'Développeur',
      content: 'L\'IA d\'entraînement s\'adapte parfaitement à mon emploi du temps chargé. Excellent !',
      rating: 5,
      avatar: '/images/avatars/thomas.jpg',
      verified: true,
      location: 'Lyon, France',
    },
    {
      id: '3',
      name: 'Sophie Bernard',
      role: 'Étudiante',
      content: 'La communauté est incroyable, toujours là pour motiver. Je recommande vivement !',
      rating: 5,
      avatar: '/images/avatars/sophie.jpg',
      verified: true,
      location: 'Marseille, France',
    },
  ];

  const pricingPlans = [
    {
      id: 'free',
      name: 'Gratuit',
      description: 'Pour découvrir MyFitHero',
      price: { monthly: 0, yearly: 0, currency: '€' },
      features: [
        { name: 'Entraînements de base', included: true },
        { name: 'Suivi des progrès', included: true },
        { name: 'Accès communauté', included: true },
        { name: 'Support par chat', included: false },
        { name: 'Plans nutritionnels', included: false },
      ],
      cta: { text: 'Commencer gratuitement', variant: 'outline' as const },
      limits: { workouts: 10, storage: '100MB' },
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour les sportifs réguliers',
      price: { monthly: 9.99, yearly: 99.99, currency: '€' },
      features: [
        { name: 'Tous les entraînements', included: true },
        { name: 'IA personnalisée', included: true },
        { name: 'Analyses avancées', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Plans nutritionnels', included: true },
      ],
      popular: true,
      cta: { text: 'Essayer Pro', variant: 'primary' as const },
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Pour les athlètes exigeants',
      price: { monthly: 19.99, yearly: 199.99, currency: '€' },
      features: [
        { name: 'Tout de Pro', included: true },
        { name: 'Coach personnel', included: true },
        { name: 'Consultations illimitées', included: true },
        { name: 'Accès prioritaire aux nouveautés', included: true },
        { name: 'Support 24/7', included: true },
      ],
      badge: 'Le plus complet',
      cta: { text: 'Devenir Premium', variant: 'secondary' as const },
    },
  ];

  const ctaData = {
    title: 'Prêt à transformer votre vie ?',
    description: 'Rejoignez des milliers d\'utilisateurs qui ont déjà atteint leurs objectifs fitness avec MyFitHero.',
    primaryAction: {
      text: 'Commencer maintenant',
      onClick: () => trackCTAClick('final-cta'),
    },
    secondaryAction: {
      text: 'En savoir plus',
      onClick: () => console.log('Learn more clicked'),
    },
    trustIndicators: [
      { text: 'Essai gratuit 14 jours', icon: <Shield className="w-5 h-5" /> },
      { text: 'Aucun engagement', icon: <Zap className="w-5 h-5" /> },
      { text: 'Support 24/7', icon: <Award className="w-5 h-5" /> },
    ],
    socialProof: {
      text: 'Noté 4.8/5 par nos utilisateurs',
      count: 10000,
    },
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        description={heroData.description}
        primaryAction={heroData.primaryAction}
        secondaryAction={heroData.secondaryAction}
        videoUrl={heroData.videoUrl}
        trustIndicators={heroData.trustIndicators}
        variant="gradient"
      />

      {/* Features Section */}
      <FeatureSection
        features={featuresData}
        title="Pourquoi choisir MyFitHero ?"
        subtitle="Des fonctionnalités pensées pour votre réussite"
        layout="grid"
        showHighlights={true}
        className="py-20"
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        testimonials={testimonialsData}
        layout="grid"
        showRatings={true}
        maxVisible={6}
        className="bg-gray-50"
      />

      {/* Pricing Section */}
      <PricingSection
        plans={pricingPlans}
        billingPeriod="monthly"
        className="py-20"
      />

      {/* Final CTA Section */}
      <CTASection
        data={ctaData}
        variant="gradient"
        className="py-24"
      />
    </div>
  );
};

export default LandingPage;
