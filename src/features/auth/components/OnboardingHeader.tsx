// src/features/auth/components/OnboardingHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User as SupabaseAuthUserType } from '@supabase/supabase-js';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  canSkip?: boolean;
  onSkip?: () => void;
  userProfile?: SupabaseAuthUserType;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  canSkip = false,
  onSkip,
  userProfile
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      {/* Progression */}
      <div className="flex items-center justify-between mb-6">
        <Badge variant="outline" className="text-sm">
          Étape {currentStep} sur {totalSteps}
        </Badge>
        
        {canSkip && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Passer
          </Button>
        )}
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Titre et sous-titre */}
      <div className="space-y-2">
        <motion.h1
          key={title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl md:text-3xl font-bold"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            key={subtitle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Salutation personnalisée si utilisateur connecté */}
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-primary/5 rounded-lg p-3 inline-block"
        >
          <p className="text-sm text-primary font-medium">
            Salut {userProfile.user_metadata?.name || 'Champion'} ! 👋
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};