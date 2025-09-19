// src/features/auth/components/OnboardingTips.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Star, Zap } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'beginner' | 'intermediate' | 'advanced' | 'general';
}

interface OnboardingTipsProps {
  currentStepType?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

export const OnboardingTips: React.FC<OnboardingTipsProps> = ({
  currentStepType = 'general',
  userLevel = 'beginner',
  className = ''
}) => {
  
  // Base de conseils contextuels
  const allTips: Tip[] = [
    {
      id: 'honest-answers',
      title: 'Soyez honnête',
      description: 'Plus vos réponses sont précises, mieux nous pourrons personnaliser votre expérience.',
      icon: <Target className="h-4 w-4" />,
      category: 'general'
    },
    {
      id: 'goals-realistic',
      title: 'Objectifs réalisables',
      description: 'Commencez petit et progressez graduellement pour des résultats durables.',
      icon: <Star className="h-4 w-4" />,
      category: 'beginner'
    },
    {
      id: 'consistency',
      title: 'Régularité avant intensité',
      description: '3 séances modérées par semaine valent mieux qu\'une séance intense.',
      icon: <Zap className="h-4 w-4" />,
      category: 'general'
    },
    {
      id: 'nutrition-importance',
      title: 'Nutrition = 70% du succès',
      description: 'L\'alimentation joue un rôle crucial dans l\'atteinte de vos objectifs.',
      icon: <Lightbulb className="h-4 w-4" />,
      category: 'intermediate'
    }
  ];

  // Conseils spécifiques par étape
  const stepSpecificTips = {
    'personal-info': [
      {
        id: 'data-privacy',
        title: 'Confidentialité garantie',
        description: 'Vos données personnelles sont sécurisées et ne seront jamais partagées.',
        icon: <Target className="h-4 w-4" />,
        category: 'general' as const
      }
    ],
    'fitness-goals': [
      {
        id: 'multiple-goals',
        title: 'Objectifs multiples',
        description: 'Vous pouvez sélectionner plusieurs objectifs, nous les hiérarchiserons.',
        icon: <Star className="h-4 w-4" />,
        category: 'general' as const
      }
    ],
    'sport-selection': [
      {
        id: 'try-new-sports',
        title: 'Explorez de nouveaux sports',
        description: 'N\'hésitez pas à essayer des activités que vous n\'avez jamais pratiquées.',
        icon: <Zap className="h-4 w-4" />,
        category: 'general' as const
      }
    ]
  };

  // Sélection des conseils à afficher
  const getRelevantTips = (): Tip[] => {
    let tips: Tip[] = [];
    
    // Ajouter les conseils spécifiques à l'étape
    if (stepSpecificTips[currentStepType as keyof typeof stepSpecificTips]) {
      tips = [...stepSpecificTips[currentStepType as keyof typeof stepSpecificTips]];
    }
    
    // Ajouter des conseils généraux adaptés au niveau
    const generalTips = allTips.filter(tip => 
      tip.category === 'general' || tip.category === userLevel
    );
    
    tips = [...tips, ...generalTips.slice(0, 2)];
    
    return tips.slice(0, 3); // Limiter à 3 conseils max
  };

  const relevantTips = getRelevantTips();

  if (relevantTips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span className="text-sm font-medium">Conseils utiles</span>
      </div>

      <div className="grid gap-3">
        {relevantTips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <Card className="border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-1.5 bg-primary/10 rounded-md text-primary">
                    {tip.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tip.description}
                    </p>
                  </div>
                  {tip.category !== 'general' && (
                    <Badge variant="secondary" className="text-xs">
                      {tip.category}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};