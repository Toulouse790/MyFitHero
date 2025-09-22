// src/features/analytics/components/SmartDashboardRefactored.tsx
import React from 'react';
import { User as SupabaseAuthUserType } from '@supabase/supabase-js';

// Composants modulaires
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { SmartChat } from './SmartChat';
import { PersonalizedWidgets } from './PersonalizedWidgets';

// Hook personnalisé
import { useSmartDashboard } from '@/features/analytics/hooks/useSmartDashboard';

interface SmartDashboardRefactoredProps {
  userProfile?: SupabaseAuthUserType;
  onNavigate?: (path: string) => void;
  className?: string;
}

export const SmartDashboardRefactored: React.FC<SmartDashboardRefactoredProps> = ({
  userProfile,
  onNavigate,
  className = '',
}) => {
  
  // Hook principal pour toute la logique
  const {
    state,
    setInputMessage,
    sendMessage,
    toggleListening,
    personalizedGreeting,
    personalizedMotivation,
    smartReminders,
    personalizedWorkout,
    personalizedExercises,
  } = useSmartDashboard(userProfile);

  // Gestion de la navigation
  const handleNavigate = (path: string) => onNavigate?.(path);
  const handleStartWorkout = () => onNavigate?.(personalizedExercises.length > 0 ? '/workout/start' : '/workout');
  const handleSettingsClick = () => onNavigate?.('/settings');
  const handleProfileClick = () => onNavigate?.(userProfile ? '/profile' : '/auth');

  // Données mockées pour l'interface
  const mockWeatherInfo = {
    condition: 'sunny' as const,
    temperature: 22,
    description: 'Parfait pour un entraînement outdoor'
  };

  const mockWeeklyGoals = {
    workouts: { current: 3, target: 5 },
    nutrition: { current: 4, target: 7 },
    hydration: { current: 6, target: 7 }
  };

  const mockUpcomingEvents = [
    {
      id: '1',
      title: 'HIIT Session',
      date: new Date(Date.now() + 2 * 60 * 60 * 1000),
      type: 'workout' as const
    }
  ];

  const mockAchievements = [
    {
      id: '1',
      title: 'Série de 7 jours',
      description: 'Entraînement quotidien pendant une semaine',
      icon: '🔥',
      unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 ${className}`}>
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Header principal */}
        <DashboardHeader
          personalizedGreeting={personalizedGreeting}
          personalizedMotivation={personalizedMotivation}
          userProfile={userProfile}
          currentStreak={7}
          totalPoints={2450}
          todayGoalsCompleted={3}
          todayGoalsTotal={5}
          weatherInfo={mockWeatherInfo}
          notifications={2}
          onSettingsClick={handleSettingsClick}
          onProfileClick={handleProfileClick}
        />

        {/* Layout principal en grille */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne gauche - Statistiques et Chat */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Statistiques */}
            <DashboardStats
              dailyStats={state.dailyStats}
              isLoading={state.loadingDailyStats}
              personalizedWorkout={personalizedWorkout}
              onNavigate={handleNavigate}
            />

            {/* Chat IA */}
            <SmartChat
              messages={state.messages}
              inputMessage={state.inputMessage}
              isListening={state.isListening}
              isLoading={state.isLoading}
              onInputChange={setInputMessage}
              onSendMessage={sendMessage}
              onToggleListening={toggleListening}
              userProfile={userProfile}
            />
          </div>

          {/* Colonne droite - Widgets personnalisés */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PersonalizedWidgets
                smartReminders={smartReminders}
                personalizedExercises={personalizedExercises}
                userProfile={userProfile}
                currentStreak={7}
                weeklyGoals={mockWeeklyGoals}
                upcomingEvents={mockUpcomingEvents}
                achievements={mockAchievements}
                onNavigate={handleNavigate}
                onStartWorkout={handleStartWorkout}
              />
            </div>
          </div>
        </div>

        {/* Actions flottantes pour mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={handleStartWorkout}
            className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
            </svg>
          </button>
        </div>

        {/* Indicateur de rafraîchissement */}
        {state.loadingDailyStats && (
          <div className="fixed top-20 right-6 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
              <span className="text-sm">Actualisation...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDashboardRefactored;