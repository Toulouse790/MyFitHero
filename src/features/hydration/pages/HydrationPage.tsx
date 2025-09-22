import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  Droplets,
  Plus,
  Target,
  Clock,
  Zap,
  Sun,
  Dumbbell,
  Thermometer,
  Coffee,
  Minus,
  RotateCcw,
  Footprints,
  Shield,
  Trophy,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Bell,
  Settings,
  ChevronRight,
  Brain,
  Info,
} from 'lucide-react';
import { appStore } from '@/store/appStore';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useRealtimeSync } from '../../workout/hooks/useRealtimeSync';
import UniformHeader from '../../profile/components/UniformHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Database } from '../../workout/types/database';
import { getSportCategoryForHydration, HydrationSportCategory } from '@/shared/utils/sportMapping';
import { getHydrationPersonalizedMessage } from '@/shared/utils/personalizedMessages';
import { useDataLoader } from '@/shared/hooks/useDataLoader';
import { AIModal } from '@/shared/components/AIModal';

// Import des sous-composants
import {
  HydrationHeader,
  HydrationProgress,
  HydrationQuickActions,
  HydrationCustomInput,
  HydrationMessage,
} from '../components';

// --- TYPES & INTERFACES ---
type DrinkType = Database['public']['Tables']['hydration_logs']['Row']['drink_type'];
type HydrationContext = Database['public']['Tables']['hydration_logs']['Row']['hydration_context'];

interface RecommendedDrink {
  type: DrinkType;
  name: string;
  icon: React.ElementType;
  amount: number;
  color: string;
}

interface SportHydrationConfig {
  emoji: string;
  goalModifierMl: number;
  contextualReminder: string;
  recommendedDrink: RecommendedDrink;
  tips: {
    icon: React.ElementType;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

type HydrationLog = Database['public']['Tables']['hydration_logs']['Row'];
type DailyStats = Database['public']['Tables']['daily_stats']['Row'];

// --- CONFIGURATION HYDRATATION PAR SPORT ---
const sportsHydrationData: Record<HydrationSportCategory, SportHydrationConfig> = {
  endurance: {
    emoji: '🏃‍♂️',
    goalModifierMl: 1000,
    contextualReminder:
      "Hydratez-vous toutes les 15-20 minutes pendant l'effort pour maintenir vos performances.",
    recommendedDrink: {
      type: 'sports_drink',
      name: 'Boisson Sport',
      icon: Zap,
      amount: 250,
      color: 'bg-orange-500',
    },
    tips: [
      {
        icon: Footprints,
        title: 'Pré-hydratation',
        // Utilisation de guillemets doubles pour encapsuler l'apostrophe dans "l'effort"
        description: "Buvez 500ml 2-3h avant l'effort et 250ml 15min avant le départ.",
        priority: 'high',
      },
      {
        icon: Clock,
        // Utilisation de guillemets doubles pour encapsuler l'apostrophe
        title: "Pendant l'effort",
        description: "150-250ml toutes les 15-20min selon l'intensité et la température.",
        priority: 'high',
      },
      {
        icon: Thermometer,
        title: 'Post-effort',
        // Utilisation de guillemets doubles pour encapsuler l'apostrophe
        description: "Buvez 150% du poids perdu en sueur dans les 6h suivant l'effort.",
        priority: 'medium',
      },
    ],
  },
  contact: {
    emoji: '🏈',
    goalModifierMl: 750,
    contextualReminder: 'Compensez les pertes intenses en sels minéraux avec des électrolytes.',
    recommendedDrink: {
      type: 'electrolytes',
      name: 'Électrolytes',
      icon: Shield,
      amount: 500,
      color: 'bg-purple-500',
    },
    tips: [
      {
        icon: Shield,
        // Utilisation de guillemets doubles pour encapsuler l'apostrophe dans "l'équipement"
        title: 'Électrolytes cruciaux',
        description:
          "La sueur sous l'équipement fait perdre beaucoup de sodium. Compensez avec des boissons enrichies.",
        priority: 'high',
      },
      {
        icon: Dumbbell,
        title: 'Récupération accélérée',
        description:
          'Une hydratation optimale réduit les courbatures et accélère la réparation musculaire.',
        priority: 'medium',
      },
    ],
  },
  court: {
    emoji: '🎾',
    goalModifierMl: 500,
    contextualReminder: 'Profitez de chaque pause pour boire 150-200ml et maintenir votre niveau.',
    recommendedDrink: {
      type: 'water',
      name: 'Eau Pure',
      icon: Droplets,
      amount: 250,
      color: 'bg-blue-500',
    },
    tips: [
      {
        icon: Trophy,
        title: 'Concentration optimale',
        description:
          'Même 2% de déshydratation réduit significativement vos réflexes et votre précision.',
        priority: 'high',
      },
      {
        icon: Zap,
        title: 'Énergie constante',
        description:
          'Pour les matchs >1h, alternez eau pure et boisson isotonique toutes les 2 pauses.',
        priority: 'medium',
      },
    ],
  },
  strength: {
    emoji: '💪',
    goalModifierMl: 250,
    contextualReminder: 'Hydratez-vous entre chaque série pour maintenir force et concentration.',
    recommendedDrink: {
      type: 'water',
      name: 'Eau Fraîche',
      icon: Droplets,
      amount: 300,
      color: 'bg-blue-600',
    },
    tips: [
      {
        icon: Dumbbell,
        title: 'Performance musculaire',
        description:
          '3% de déshydratation = 10-15% de perte de force. Hydratez-vous régulièrement.',
        priority: 'high',
      },
      {
        icon: Coffee,
        title: 'Pré-workout et caféine',
        description: 'Si vous prenez des stimulants, augmentez votre apport hydrique de 500ml.',
        priority: 'medium',
      },
    ],
  },
};

// --- COMPOSANT PRINCIPAL ---
const Hydration: React.FC = () => {
  // --- HOOKS ET STATE ---
  const [, navigate] = useLocation();
  const { appStoreUser } = appStore();
  const { toast } = useToast();
  const { isLoading, withLoader, setIsLoading } = useDataLoader({
    onError: (title, description) => toast({ title, description, variant: 'destructive' })
  });

  const [currentMl, setCurrentMl] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [dailyLogs, setDailyLogs] = useState<HydrationLog[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [lastDrinkTime, setLastDrinkTime] = useState<Date | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const todayDate = new Date().toISOString().split('T')[0];

  // --- LOGIQUE DE PERSONNALISATION ---
  const userSportCategory = getSportCategoryForHydration(appStoreUser?.sport);
  const sportConfig = sportsHydrationData[userSportCategory];

  // --- CALCUL OBJECTIF PERSONNALISÉ ---
  const personalizedGoalMl = useMemo(() => {
    const weight = appStoreUser?.weight ?? 70;
    const baseGoalMl = weight * 35;

    let adjustments = 0;
    adjustments += sportConfig.goalModifierMl;

    if (appStoreUser?.age) {
      if (appStoreUser.age > 50) adjustments += 200;
      if (appStoreUser.age < 25) adjustments += 300;
    }

    if (appStoreUser?.gender === 'male') {
      adjustments += 300;
    }

    if (appStoreUser?.primary_goals?.includes('weight_loss')) {
      adjustments += 500;
    }

    if (appStoreUser?.primary_goals?.includes('muscle_gain')) {
      adjustments += 300;
    }

    const activityLevel = appStoreUser?.activity_level;
    if (activityLevel === 'extremely_active') adjustments += 500;
    else if (activityLevel === 'moderately_active') adjustments += 300;

    return Math.round(baseGoalMl + adjustments);
  }, [appStoreUser, sportConfig.goalModifierMl]);

  // --- FONCTIONS DE DONNÉES ---
  const loadHydrationData = useCallback(async () => {
    if (!appStoreUser?.id) return;

    try {
      setIsLoading(true);

      const today = new Date().toISOString().split('T')[0];

      const { data: statsData, error: statsError } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', appStoreUser.id)
        .eq('stat_date', today)
        .single();

      const { data: logsData, error: logsError } = await supabase
        .from('hydration_logs')
        .select('*')
        .eq('user_id', appStoreUser.id)
        .eq('log_date', today)
        .order('logged_at', { ascending: false });

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching daily stats:', statsError);
        toast({ title: 'Erreur de chargement des stats', variant: 'destructive' });
      }

      if (logsError) {
        console.error('Error fetching hydration logs:', logsError);
        toast({ title: 'Erreur de chargement des logs', variant: 'destructive' });
      }

      const currentStats = statsData as DailyStats | null;
      const currentLogs = logsData as HydrationLog[] | null;

      setDailyStats(currentStats);
      setDailyLogs(currentLogs || []);

      if (currentStats) {
        setCurrentMl(currentStats.water_intake_ml ?? 0);
      } else {
        setCurrentMl(0);
      }

      if (currentLogs && currentLogs.length > 0) {
        setLastDrinkTime(currentLogs[0].logged_at ? new Date(currentLogs[0].logged_at) : null);
      }
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur chargement hydratation:', error);
      toast({
        title: 'Erreur inattendue',
        description: "Impossible de charger les données d'hydratation.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [appStoreUser?.id, toast]);

  // --- HANDLERS ---
  const handleAddWater = useCallback(
    async (amount: number, type: DrinkType = 'water', context: HydrationContext = 'normal') => {
      if (!appStoreUser?.id) return;

      try {
        const newTotal = currentMl + amount;
        const now = new Date();

        setCurrentMl(newTotal);
        setLastDrinkTime(now);

        const { error: logError } = await (supabase as any).from('hydration_logs').insert({
          user_id: appStoreUser.id,
          amount_ml: amount,
          drink_type: type,
          logged_at: now.toISOString(),
          log_date: todayDate,
          hydration_context: context,
        });

        if (logError) throw logError;

        const { error: statsError } = await (supabase as any).from('daily_stats').upsert(
          {
            user_id: appStoreUser.id,
            stat_date: todayDate,
            water_intake_ml: newTotal,
            hydration_goal_ml: personalizedGoalMl,
            updated_at: now.toISOString(),
          },
          {
            onConflict: 'user_id,stat_date',
          }
        );

        if (statsError) throw statsError;

        const userName = appStoreUser.first_name || appStoreUser.username || 'Champion';
        const progress = (newTotal / personalizedGoalMl) * 100;

        let message = `+${amount}ml ajoutés ! `;
        if (progress >= 100) {
          message += `🎉 Objectif atteint ${userName} !`;
        } else if (progress >= 75) {
          message += `💪 Excellent ${userName}, presque fini !`;
        } else {
          message += `Continue ${userName} !`;
        }

        toast({
          title: 'Hydratation ajoutée',
          description: message,
        });

        await loadHydrationData();
      } catch (error) {
      // Erreur silencieuse
        console.error('Erreur ajout hydratation:', error);
        setCurrentMl(prev => prev - amount);
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder. Réessayez.',
          variant: 'destructive',
        });
      }
    },
    [appStoreUser?.id, currentMl, personalizedGoalMl, todayDate, loadHydrationData, toast]
  );

  const handleRemoveLast = useCallback(async () => {
    if (dailyLogs.length === 0) return;

    const lastLog = dailyLogs[0];
    const newTotal = currentMl - lastLog.amount_ml;

    try {
      setCurrentMl(newTotal);

      const { error: deleteError } = await supabase
        .from('hydration_logs')
        .delete()
        .eq('id', lastLog.id);

      if (deleteError) throw deleteError;

      const { error: statsError } = await (supabase as any).from('daily_stats').upsert({
        user_id: appStoreUser?.id!,
        stat_date: todayDate,
        water_intake_ml: newTotal,
        hydration_goal_ml: personalizedGoalMl,
        updated_at: new Date().toISOString(),
      });

      if (statsError) throw statsError;

      toast({
        title: 'Dernière entrée supprimée',
        description: `-${lastLog.amount_ml}ml`,
      });

      await loadHydrationData();
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur suppression:', error);
      setCurrentMl(prev => prev + lastLog.amount_ml);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'entrée",
        variant: 'destructive',
      });
    }
  }, [
    dailyLogs,
    currentMl,
    appStoreUser?.id,
    personalizedGoalMl,
    todayDate,
    loadHydrationData,
    toast,
  ]);

  // --- SYNCHRONISATION TEMPS RÉEL ---
  const {} = useRealtimeSync({
    pillar: 'hydration',
    onUpdate: payload => {
      if (
        payload.userId === appStoreUser?.id &&
        (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE')
      ) {
        loadHydrationData();
      }
    },
  });

  // --- CALCULS ---
  const currentHydrationL = currentMl / 1000;
  const goalHydrationL = personalizedGoalMl / 1000;
  const remaining = Math.max(0, personalizedGoalMl - currentMl);
  const percentage =
    personalizedGoalMl > 0 ? Math.min((currentMl / personalizedGoalMl) * 100, 100) : 0;
  const isGoalReached = percentage >= 100;

  // --- MESSAGES PERSONNALISÉS ---
  const getPersonalizedMessage = useCallback(() => {
    return getHydrationPersonalizedMessage(percentage, isGoalReached, appStoreUser);
  }, [percentage, isGoalReached, appStoreUser]);

  // Conseil prioritaire du jour
  const getTodayTip = useCallback(() => {
    const highPriorityTips = sportConfig.tips.filter(tip => tip.priority === 'high');
    return highPriorityTips[0] || sportConfig.tips[0];
  }, [sportConfig.tips]);

  // Afficher le rappel contextuel seulement si pertinent
  const shouldShowContextualReminder = useCallback(() => {
    return (
      percentage < 80 &&
      (!lastDrinkTime || new Date().getTime() - lastDrinkTime.getTime() > 2 * 60 * 60 * 1000)
    );
  }, [percentage, lastDrinkTime]);

  // --- EFFECTS ---
  useEffect(() => {
    loadHydrationData();
  }, [loadHydrationData]);

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const todayTip = getTodayTip();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto">
        {/* Header avec icône Droplets */}
        <HydrationHeader 
          sportEmoji={sportConfig.emoji}
          personalizedMessage={getPersonalizedMessage()}
        />

        {/* Objectif principal */}
        <HydrationProgress
          currentHydrationL={currentHydrationL}
          goalHydrationL={goalHydrationL}
          percentage={percentage}
          remaining={remaining}
        />

        {/* Boutons d'action rapide */}
        <HydrationQuickActions
          onAddWater={handleAddWater}
        />

        {/* Sélection personnalisée */}
        <HydrationCustomInput
          selectedAmount={selectedAmount}
          onAmountChange={setSelectedAmount}
          onAddWater={handleAddWater}
        />

        {/* Message motivationnel */}
        <HydrationMessage
          message={getPersonalizedMessage()}
        />

        {/* Coaching IA Modal */}
        <AIModal
          open={showCoachingModal}
          onOpenChange={setShowCoachingModal}
          pillar="hydration"
          title="Coaching IA"
          description="Analyse personnalisée et conseils"
        />

        {/* Actions rapides supplémentaires - masquées pour le design simple */}
        <div className="hidden">
          {/* Contenu masqué pour préserver la logique existante */}
        </div>
      </div>
    </div>
  );
};

export default Hydration;

