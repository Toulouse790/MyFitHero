import React from 'react';
import { 
  HeroSection,
  FeatureSection,
  TestimonialsSection,
  PricingSection,
  CTASection
} from '@/features/landing/components';
import { useLandingContent, useLandingAnalytics } from '@/features/landing/hooks';
import { marketingAnalytics } from '@/features/landing/services/marketing-analytics.service';
import { Dumbbell, TrendingUp, Users, Award, Shield, Zap, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { content, loading: contentLoading } = useLandingContent();
  const { trackCTAClick } = useLandingAnalytics();

  // Sample data for components (replace with actual content when available)
  const heroData = {
    title: 'Transformez votre corps en 30 jours avec l\'IA',
    subtitle: 'Rejoignez plus de 25 000 utilisateurs qui ont atteint leurs objectifs fitness',
    description: 'MyFitHero utilise l\'intelligence artificielle pour créer votre programme d\'entraînement personnalisé. Résultats garantis ou remboursé.',
    primaryAction: {
      text: 'Démarrer gratuitement',
      onClick: () => {
        marketingAnalytics.trackCTAClick('hero', 'Démarrer gratuitement');
        window.location.href = '/auth';
      },
    },
    secondaryAction: {
      text: 'Voir comment ça marche',
      onClick: () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    videoUrl: '/videos/hero-demo.mp4',
    trustIndicators: [
      { text: 'Gratuit 14 jours', icon: <Shield className="w-5 h-5 text-green-500" /> },
      { text: 'Sans engagement', icon: <Zap className="w-5 h-5 text-blue-500" /> },
      { text: 'Résultats garantis', icon: <Award className="w-5 h-5 text-yellow-500" /> },
      { text: '10 000+ utilisateurs actifs' },
      { text: '4.8/5 étoiles sur les stores' },
      { text: 'Certifié par des experts' },
    ],
  };

  const featuresData = [
    {
      id: '1',
      title: 'IA Coach Personnel',
      description: 'Notre intelligence artificielle analyse vos performances et adapte vos entraînements en temps réel pour des résultats optimaux.',
      icon: <Sparkles className="w-8 h-8" />,
      highlight: true,
      benefits: ['Progression 3x plus rapide', 'Plans adaptatifs', 'Corrections automatiques'],
    },
    {
      id: '2',
      title: 'Suivi Complet',
      description: 'Nutrition, sommeil, récupération : suivez tous les aspects de votre forme physique avec des métriques précises.',
      icon: <TrendingUp className="w-8 h-8" />,
      highlight: false,
      benefits: ['Tableaux de bord avancés', 'Analyses prédictives', 'Recommandations personnalisées'],
    },
    {
      id: '3',
      title: 'Communauté Active',
      description: 'Rejoignez une communauté motivante de +25k membres. Défis, groupes et support mutuel inclus.',
      icon: <Users className="w-8 h-8" />,
      highlight: false,
      benefits: ['Défis hebdomadaires', 'Groupes thématiques', 'Coaching communautaire'],
    },
    {
      id: '4',
      title: 'Résultats Garantis',
      description: 'Atteignez vos objectifs en 30 jours ou récupérez votre argent. Notre méthode a fait ses preuves.',
      icon: <Award className="w-8 h-8" />,
      highlight: true,
      benefits: ['Garantie 30 jours', 'Suivi personnalisé', 'Support premium'],
    },
  ];  const testimonialsData = [
    {
      id: '1',
      name: 'Marie Dubois',
      role: 'Entrepreneuse',
      content: 'J\'ai perdu 18kg en 4 mois avec MyFitHero ! L\'IA s\'adapte parfaitement à mon planning chargé. Je recommande à 100% !',
      rating: 5,
      avatar: '/images/avatars/marie.jpg',
      verified: true,
      location: 'Paris, France',
      results: '-18kg en 4 mois',
    },
    {
      id: '2',
      name: 'Thomas Leroy',
      role: 'Cadre IT',
      content: 'Incroyable ! J\'ai pris 8kg de muscle en 6 mois. Le suivi nutrition + sport est parfait. Enfin une app qui fonctionne vraiment.',
      rating: 5,
      avatar: '/images/avatars/thomas.jpg',
      verified: true,
      location: 'Lyon, France',
      results: '+8kg muscle en 6 mois',
    },
    {
      id: '3',
      name: 'Sophie Martin',
      role: 'Maman de 2 enfants',
      content: 'Même avec mes enfants, j\'ai réussi à retrouver la forme ! 15 minutes par jour suffisent. Merci MyFitHero pour cette liberté !',
      rating: 5,
      avatar: '/images/avatars/sophie.jpg',
      verified: true,
      location: 'Marseille, France',
      results: 'Forme retrouvée en 2 mois',
    },
    {
      id: '4',
      name: 'Alexandre Petit',
      role: 'Étudiant',
      content: 'Budget étudiant respecté ! Pour 7€/mois j\'ai un coach personnel IA. J\'ai gagné en force et confiance en moi.',
      rating: 5,
      avatar: '/images/avatars/alex.jpg',
      verified: true,
      location: 'Toulouse, France',
      results: '+40% force en 3 mois',
    },
    {
      id: '5',
      name: 'Caroline Dubois',
      role: 'Médecin',
      content: 'En tant que médecin, je valide l\'approche scientifique de MyFitHero. Les résultats de mes patients parlent d\'eux-mêmes.',
      rating: 5,
      avatar: '/images/avatars/caroline.jpg',
      verified: true,
      location: 'Nice, France',
      results: 'Approche validée médicalement',
    },
    {
      id: '6',
      name: 'David Moreau',
      role: 'Commercial',
      content: 'Plus de mal de dos ! MyFitHero a transformé ma posture et ma énergie. Je cours des marathons maintenant !',
      rating: 5,
      avatar: '/images/avatars/david.jpg',
      verified: true,
      location: 'Bordeaux, France',
      results: '1er marathon en 8 mois',
    },
  ];

    const pricingPlans = [
    {
      id: 'free',
      name: 'Découverte',
      description: 'Parfait pour commencer votre transformation',
      price: { monthly: 0, yearly: 0, currency: '€' },
      features: [
        { name: '3 entraînements par semaine', included: true },
        { name: 'Suivi de base', included: true },
        { name: 'Communauté', included: true },
        { name: 'IA Coach basique', included: true },
        { name: 'Plans nutritionnels', included: false },
        { name: 'Support prioritaire', included: false },
        { name: 'Analyses avancées', included: false },
      ],
      cta: { text: 'Commencer gratuitement', variant: 'outline' as const },
      badge: '14 jours gratuits',
      limits: { workouts: 3, storage: '100MB', support: 'Communauté' },
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour des résultats rapides et durables',
      price: { monthly: 7.99, yearly: 79.99, currency: '€' },
      features: [
        { name: 'Entraînements illimités', included: true },
        { name: 'IA Coach avancée', included: true },
        { name: 'Plans nutritionnels personnalisés', included: true },
        { name: 'Analyses détaillées', included: true },
        { name: 'Support par email', included: true },
        { name: 'Programmes spécialisés', included: true },
        { name: 'Défis premium', included: true },
      ],
      popular: true,
      cta: { text: 'Devenir Pro maintenant', variant: 'primary' as const },
      badge: 'Le plus populaire',
      limits: { workouts: 999, storage: '5GB', support: 'Email 24h' },
    },
    {
      id: 'premium',
      name: 'Elite',
      description: 'L\'excellence absolue pour athlètes ambitieux',
      price: { monthly: 14.99, yearly: 149.99, currency: '€' },
      features: [
        { name: 'Tout du plan Pro', included: true },
        { name: 'Coach personnel dédié', included: true },
        { name: 'Consultations vidéo illimitées', included: true },
        { name: 'Programmes sur mesure', included: true },
        { name: 'Support téléphone 24/7', included: true },
        { name: 'Accès anticipé aux nouveautés', included: true },
        { name: 'Garantie résultats 30 jours', included: true },
      ],
      badge: 'Garantie résultats',
      cta: { text: 'Devenir Elite', variant: 'secondary' as const },
      limits: { workouts: 999, storage: 'illimité', support: 'Téléphone 24/7' },
    },
  ];

  const ctaData = {
    title: 'Transformez votre vie dès aujourd\'hui',
    description: 'Rejoignez plus de 25 000 personnes qui ont déjà transformé leur corps et leur mental avec MyFitHero. Votre transformation commence maintenant.',
    primaryAction: {
      text: 'Commencer ma transformation',
      onClick: () => {
        marketingAnalytics.trackCTAClick('final-cta', 'Commencer ma transformation');
        window.location.href = '/auth';
      },
    },
    secondaryAction: {
      text: 'Programmer une démo',
      onClick: () => {
        marketingAnalytics.trackCTAClick('demo-request', 'Programmer une démo');
        window.open('https://calendly.com/myfithero-demo', '_blank');
      },
    },
    trustIndicators: [
      { text: '14 jours gratuits', icon: <Shield className="w-5 h-5" /> },
      { text: 'Sans engagement', icon: <Zap className="w-5 h-5" /> },
      { text: 'Garantie résultats', icon: <Award className="w-5 h-5" /> },
    ],
    socialProof: {
      text: 'Noté 4.9/5 par 25 000+ utilisateurs',
      count: 25000,
    },
    urgency: {
      text: 'Offre limitée : -50% les 7 premiers jours',
      expires: '2024-12-31',
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
      <section id="features">
        <FeatureSection
          features={featuresData}
          title="Pourquoi 25 000+ personnes nous font confiance ?"
          subtitle="4 raisons qui font la différence"
          layout="grid"
          showHighlights={true}
          className="py-20"
        />
      </section>

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
