import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  X, 
  Zap, 
  Star, 
  Target, 
  Trophy, 
  Share2, 
  Eye, 
  Award,
  Sparkles,
  Crown,
  Gem
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

// Types pour les badges MyFitHero
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  xp: number;
  unlockedAt: Date;
  category?: string;
  criteria?: string;
}

interface BadgeNotificationProps {
  badge: BadgeData;
  isVisible: boolean;
  onClose: () => void;
  onShare?: () => void;
  onViewDetails?: () => void;
}

// Configuration des raretés avec couleurs MyFitHero
const RARITY_CONFIGS: Record<BadgeRarity, {
  name: string;
  color: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  shadowColor: string;
  particles: string;
  multiplier: number;
}> = {
  common: {
    name: 'Commun',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-400',
    textColor: 'text-green-100',
    shadowColor: 'shadow-green-500/30',
    particles: '🌱',
    multiplier: 1,
  },
  rare: {
    name: 'Rare',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-100',
    shadowColor: 'shadow-blue-500/30',
    particles: '💎',
    multiplier: 1.5,
  },
  epic: {
    name: 'Épique',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-100',
    shadowColor: 'shadow-purple-500/30',
    particles: '🌟',
    multiplier: 2,
  },
  legendary: {
    name: 'Légendaire',
    color: 'orange',
    gradient: 'from-orange-500 to-yellow-600',
    borderColor: 'border-orange-400',
    textColor: 'text-orange-100',
    shadowColor: 'shadow-orange-500/30',
    particles: '✨',
    multiplier: 3,
  },
  mythic: {
    name: 'Mythique',
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    borderColor: 'border-red-400',
    textColor: 'text-red-100',
    shadowColor: 'shadow-red-500/30',
    particles: '🔥',
    multiplier: 5,
  },
};

export const BadgeNotification: React.FC<BadgeNotificationProps> = ({
  badge,
  isVisible,
  onClose,
  onShare,
  onViewDetails,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);

  const config = RARITY_CONFIGS[badge.rarity] || RARITY_CONFIGS.common;

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      
      // Auto-fermeture après 8 secondes pour les badges communs, plus pour les rares
      const timeout = badge.rarity === 'mythic' ? 15000 :
                     badge.rarity === 'legendary' ? 12000 :
                     badge.rarity === 'epic' ? 10000 : 8000;
      
      const timer = setTimeout(() => {
        onClose();
      }, timeout);
      
      setAutoCloseTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      setShowAnimation(false);
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    }
  }, [isVisible, badge.rarity, onClose]);

  const handleClose = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }
    onClose();
  };

  const getRarityIcon = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'mythic': return <Crown className="w-5 h-5" />;
      case 'legendary': return <Star className="w-5 h-5" />;
      case 'epic': return <Gem className="w-5 h-5" />;
      case 'rare': return <Sparkles className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative max-w-sm w-full mx-4 rounded-2xl border-2 ${config.borderColor}
              bg-gradient-to-br ${config.gradient} ${config.shadowColor} shadow-2xl
              overflow-hidden
            `}
          >
            {/* Effet de particules animées */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(badge.rarity === 'mythic' ? 20 : 12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 600 - 300 
                  }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    y: [-20, -100],
                    rotate: 360
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3
                  }}
                  className="absolute text-xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  {config.particles}
                </motion.div>
              ))}
            </div>

            {/* Lueur de fond pour les badges rares */}
            {(badge.rarity === 'legendary' || badge.rarity === 'mythic') && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            )}

            <div className="relative p-6 text-center">
              {/* Bouton fermer */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* En-tête avec rareté */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  Nouveau Badge !
                </h2>
                <Badge 
                  className={`${config.borderColor} ${config.textColor} bg-white/20 border`}
                >
                  <span className="flex items-center gap-1">
                    {getRarityIcon(badge.rarity)}
                    {config.name}
                  </span>
                </Badge>
              </motion.div>

              {/* Icône du badge avec animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.4, 
                  type: "spring", 
                  damping: 15,
                  stiffness: 200 
                }}
                className="mb-4"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 40px rgba(59, 130, 246, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mb-2 mx-auto border-2 border-white/30"
                  >
                    {badge.icon}
                  </motion.div>
                  
                  {/* Badge de rareté sur l'icône */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      {getRarityIcon(badge.rarity)}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Informations du badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
                <p className="text-white/90 text-sm mb-3 leading-relaxed">
                  {badge.description}
                </p>

                {/* XP gagné avec animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="flex items-center justify-center space-x-2 mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <Star className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                  <span className="text-yellow-300 font-bold text-lg">
                    +{badge.xp} XP
                  </span>
                </motion.div>

                {/* Métadonnées du badge */}
                <div className="flex items-center justify-center space-x-4 text-sm text-white/80">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{config.name}</span>
                  </div>
                  {badge.category && (
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{badge.category}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Débloqué</span>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex space-x-3"
              >
                {onShare && (
                  <Button
                    onClick={onShare}
                    variant="outline"
                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20 hover:border-white/30"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                )}

                {onViewDetails && (
                  <Button
                    onClick={onViewDetails}
                    variant="outline"
                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20 hover:border-white/30"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                )}
              </motion.div>

              {/* Temps débloqué */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 text-xs text-white/60"
              >
                Débloqué le {badge.unlockedAt.toLocaleDateString('fr-FR')} à {badge.unlockedAt.toLocaleTimeString('fr-FR')}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeNotification;
