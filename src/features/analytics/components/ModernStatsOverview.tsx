import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
  Calendar,
  Dumbbell,
  Apple,
  Moon,
  Droplets,
  Trophy,
  Star,
  Zap,
  Activity,
  BarChart3,
  Award,
  Clock,
  Heart,
  Brain,
  Shield,
  Users,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// Types pour les statistiques utilisateur MyFitHero
interface UserStats {
  userId: string;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
  streakDays: number;
  longestStreak: number;
  totalNutritionLogs: number;
  averageSleepQuality: number;
  averageHydrationScore: number;
  totalBadges: number;
  totalXP: number;
  level: number;
  healthScore: number;
  lastActivityDate: Date | undefined;
  joinDate: Date;
  updatedAt: Date;
}

interface BadgeStats {
  total: number;
  byRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
    mythic: number;
  };
  recent: Array<{
    id: string;
    name: string;
    rarity: string;
    unlockedAt: Date;
  }>;
}

interface ModernStatsOverviewProps {
  className?: string;
  showDetailed?: boolean;
  userId?: string;
}

export const ModernStatsOverview: React.FC<ModernStatsOverviewProps> = ({
  className = '',
  showDetailed = false,
  userId: propUserId,
}) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badgeStats, setBadgeStats] = useState<BadgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(propUserId || null);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (!propUserId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setError('Utilisateur non connecté');
            setLoading(false);
            return;
          }
          setUserId(user.id);
          await loadStats(user.id);
        } else {
          await loadStats(propUserId);
        }
      } catch (err) {
        console.error('Erreur initialisation stats:', err);
        setError('Erreur lors du chargement');
        setLoading(false);
      }
    };

    initialize();
  }, [propUserId]);

  const loadStats = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulation des données - en réalité, on ferait des appels API Supabase
      const mockStats: UserStats = {
        userId: uid,
        totalWorkouts: 156,
        totalCaloriesBurned: 45280,
        averageWorkoutDuration: 52,
        streakDays: 12,
        longestStreak: 28,
        totalNutritionLogs: 89,
        averageSleepQuality: 78,
        averageHydrationScore: 85,
        totalBadges: 24,
        totalXP: 8950,
        level: 15,
        healthScore: 82,
        lastActivityDate: new Date(),
        joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Il y a 1 an
        updatedAt: new Date(),
      };

      const mockBadgeStats: BadgeStats = {
        total: 24,
        byRarity: {
          common: 12,
          rare: 7,
          epic: 4,
          legendary: 1,
          mythic: 0,
        },
        recent: [
          {
            id: 'badge1',
            name: 'Marathonien',
            rarity: 'epic',
            unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'badge2',
            name: 'Hydratation Parfaite',
            rarity: 'rare',
            unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
      };

      setStats(mockStats);
      setBadgeStats(mockBadgeStats);
    } catch (err) {
      console.error('Erreur chargement stats:', err);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-blue-500 to-cyan-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    if (score >= 40) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-red-700';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Flame className="w-5 h-5 text-red-500" />;
    if (streak >= 14) return <Flame className="w-5 h-5 text-orange-500" />;
    if (streak >= 7) return <Flame className="w-5 h-5 text-yellow-500" />;
    return <Flame className="w-5 h-5 text-blue-500" />;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`${className} space-y-4`}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-white/20 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-300 mb-4">{error || 'Aucune statistique disponible'}</p>
            <Button 
              onClick={() => userId && loadStats(userId)}
              variant="outline"
              className="border-red-500/20 text-red-300 hover:bg-red-500/10"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      
      {/* Score de santé global avec effet wow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden relative">
          {/* Effet de particules de fond */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0], 
                  scale: [0, 1, 0],
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100]
                }}
                transition={{
                  duration: 4,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3
                }}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <Sparkles className="w-4 h-4 text-blue-400/30" />
              </motion.div>
            ))}
          </div>

          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`p-3 bg-gradient-to-r ${getHealthScoreColor(stats.healthScore)} rounded-full`}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(59, 130, 246, 0.5)',
                      '0 0 20px rgba(59, 130, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold">Score Santé Global</h3>
                  <p className="text-white/70 text-sm">Votre forme générale</p>
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {stats.healthScore}/100
                </motion.div>
                <Badge className={`bg-gradient-to-r ${getHealthScoreColor(stats.healthScore)} text-white border-0`}>
                  {stats.healthScore >= 90 ? 'Excellent' :
                   stats.healthScore >= 75 ? 'Très bon' :
                   stats.healthScore >= 60 ? 'Bon' : 'À améliorer'}
                </Badge>
              </div>
            </div>
            
            {/* Barre de progression avec animation fluide */}
            <div className="relative">
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.healthScore}%` }}
                  transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
                  className={`bg-gradient-to-r ${getHealthScoreColor(stats.healthScore)} h-3 rounded-full relative overflow-hidden`}
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques principales avec animations décalées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Entraînements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg"
                    whileHover={{ rotate: 10 }}
                  >
                    <Dumbbell className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/70 text-sm">Entraînements</p>
                    <motion.p 
                      className="text-white font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {stats.totalWorkouts}
                    </motion.p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>Moy: {stats.averageWorkoutDuration}min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Série actuelle avec flamme animée */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg"
                    animate={{ 
                      scale: stats.streakDays >= 7 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 1, repeat: stats.streakDays >= 7 ? Infinity : 0 }}
                  >
                    {getStreakIcon(stats.streakDays)}
                  </motion.div>
                  <div>
                    <p className="text-white/70 text-sm">Série actuelle</p>
                    <motion.p 
                      className="text-white font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {stats.streakDays} jours
                    </motion.p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>Record: {stats.longestStreak}j</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calories avec effet flamme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/70 text-sm">Calories brûlées</p>
                    <motion.p 
                      className="text-white font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {formatNumber(stats.totalCaloriesBurned)}
                    </motion.p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Niveau avec étoile tournante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Star className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/70 text-sm">Niveau</p>
                    <motion.p 
                      className="text-white font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Niv. {stats.level}
                    </motion.p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>{formatNumber(stats.totalXP)} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sommeil */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Moon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/70 text-sm">Qualité sommeil</p>
                    <motion.p 
                      className="text-white font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {stats.averageSleepQuality}/100
                    </motion.p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>Moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hydratation avec goutte animée */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Droplets className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/70 text-sm">Hydratation</p>
                    <motion.p 
                      className="text-white font-semibold text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {stats.averageHydrationScore}/100
                    </motion.p>
                  </div>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>Score moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges et récompenses avec effet sophistiqué */}
      {badgeStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-5 h-5" />
                </motion.div>
                Badges et Récompenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Total badges avec compteur animé */}
              <div className="flex items-center justify-between">
                <span className="text-white/80">Total badges</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {badgeStats.total}
                  </Badge>
                </motion.div>
              </div>

              {/* Répartition par rareté avec animations décalées */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(badgeStats.byRarity).map(([rarity, count], index) => {
                  const rarityColors = {
                    common: 'from-green-500 to-emerald-500',
                    rare: 'from-blue-500 to-cyan-500',
                    epic: 'from-purple-500 to-indigo-500',
                    legendary: 'from-orange-500 to-yellow-500',
                    mythic: 'from-red-500 to-pink-500',
                  };
                  
                  return (
                    <motion.div 
                      key={rarity} 
                      className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`text-xs text-white/70 capitalize mb-1`}>{rarity}</div>
                      <motion.div 
                        className={`text-lg font-bold bg-gradient-to-r ${rarityColors[rarity as keyof typeof rarityColors]} bg-clip-text text-transparent`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                      >
                        {count}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Badges récents */}
              {badgeStats.recent.length > 0 && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <h5 className="text-white/80 text-sm">Récemment débloqués</h5>
                  <div className="space-y-1">
                    {badgeStats.recent.map((badge, index) => (
                      <motion.div 
                        key={badge.id} 
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-white text-sm">{badge.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs">{badge.rarity}</Badge>
                          <span className="text-xs text-white/60">
                            {badge.unlockedAt.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ModernStatsOverview;