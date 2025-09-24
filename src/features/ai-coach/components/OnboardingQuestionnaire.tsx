import React from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import ConversationalOnboarding from './ConversationalOnboarding';
import { OnboardingData } from '@/shared/types/conversationalOnboarding';

interface OnboardingQuestionnaireProps {
  user: any;
  onComplete: (data?: any) => void; // Rendre data optionnel car déjà sauvegardé
}

const OnboardingQuestionnaire: React.FC<OnboardingQuestionnaireProps> = ({ user, onComplete }) => {
  const { toast } = useToast();

  // Gérer la finalisation du nouvel onboarding
  const handleConversationalComplete = async (data: OnboardingData) => {
    // 🎯 Ajouter feedback visuel immédiat
    toast({
      title: 'Finalisation de votre profil...',
      description: 'Sauvegarde en cours, veuillez patienter.',
    });

    try {
      const { error: _error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          profile_type: 'complete',
          modules: data.selectedModules || ['sport', 'nutrition', 'sleep', 'hydration'],
          active_modules: data.selectedModules || ['sport', 'nutrition', 'sleep', 'hydration'],
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (_error) {
        console.error('🔴 Erreur Supabase lors de la mise à jour:', _error);
        console.error("🔴 Détails de l'erreur:", _error.message);
        console.error("🔴 Code d'erreur:", _error.code);
        console.error('🔴 User ID utilisé:', user.id);

        // ⚠️ MÊME EN CAS D'ERREUR, on continue vers le dashboard
        // L'essentiel est que le profil de base existe déjà
        toast({
          title: 'Profil partiellement sauvegardé',
          description:
            "Certaines données n'ont pas pu être sauvegardées, mais vous pouvez continuer.",
          variant: 'destructive',
        });

        // ✅ TOUJOURS appeler onComplete pour éviter de bloquer l'utilisateur
        onComplete();
        return;
      }


      // 🎉 FEEDBACK SUCCÈS AMÉLIORE
      toast({
        title: '🎉 Bienvenue dans MyFitHero !',
        description: 'Votre profil a été créé avec succès. Découvrez votre tableau de bord personnalisé.',
      });

      onComplete();
    } catch (error: any) {
      // Erreur silencieuse
      console.error('🔴 Erreur lors de la finalisation:', error);

      // ⚠️ MÊME EN CAS D'ERREUR CRITIQUE, on redirige
      // Mieux vaut avoir un utilisateur sur le dashboard qu'en boucle d'inscription
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Une erreur est survenue, mais vous pouvez accéder à votre compte.',
        variant: 'destructive',
      });

      // ✅ TOUJOURS rediriger pour éviter la boucle infinie
      onComplete();
    }
  };

  return (
    <div className="hero-container">
      <ConversationalOnboarding onComplete={handleConversationalComplete} />
    </div>
  );
};

export default OnboardingQuestionnaire;
