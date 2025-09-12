import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Target, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

export interface AIIntelligenceProps {
  pillar: 'hydration' | 'nutrition' | 'sleep' | 'workout';
  showPredictions?: boolean;
  showCoaching?: boolean;
  showRecommendations?: boolean;
  userId?: string;
  currentData?: any;
  className?: string;
}

interface Prediction {
  id: string;
  type: 'improvement' | 'warning' | 'insight';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  category: string;
}

interface Coaching {
  id: string;
  type: 'tip' | 'challenge' | 'habit';
  title: string;
  description: string;
  actionItems: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

interface Recommendation {
  id: string;
  type: 'goal' | 'adjustment' | 'optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: string;
}

const pillarConfig = {
  hydration: {
    title: 'Intelligence Hydratation',
    icon: '💧',
    color: 'bg-blue-500',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500',
  },
  nutrition: {
    title: 'Intelligence Nutrition',
    icon: '🥗',
    color: 'bg-green-500',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500',
  },
  sleep: {
    title: 'Intelligence Sommeil',
    icon: '😴',
    color: 'bg-purple-500',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-indigo-500',
  },
  workout: {
    title: 'Intelligence Entraînement',
    icon: '💪',
    color: 'bg-orange-500',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-500',
  },
};

const AIIntelligence: React.FC<AIIntelligenceProps> = ({
  pillar,
  showPredictions = true,
  showCoaching = true,
  showRecommendations = true,
  userId,
  currentData,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [coaching, setCoaching] = useState<Coaching[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'predictions' | 'coaching' | 'recommendations'>('predictions');
  
  const { toast } = useToast();
  const config = pillarConfig[pillar];

  useEffect(() => {
    loadAIInsights();
  }, [pillar, userId, currentData]);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock data based on pillar
      setPredictions(generateMockPredictions(pillar));
      setCoaching(generateMockCoaching(pillar));
      setRecommendations(generateMockRecommendations(pillar));
      
      toast.success('Analyse IA terminée', 'Nouvelles recommandations disponibles');
    } catch (error) {
      console.error('Erreur lors du chargement des insights IA:', error);
      toast.error('Erreur', 'Impossible de charger l\'analyse IA');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPredictions = (pillar: string): Prediction[] => {
    const predictions = {
      hydration: [
        {
          id: '1',
          type: 'improvement' as const,
          title: 'Amélioration de l\'hydratation',
          description: 'Votre consommation d\'eau devrait augmenter de 15% cette semaine',
          confidence: 85,
          timeframe: '7 jours',
          category: 'Performance',
        },
        {
          id: '2',
          type: 'warning' as const,
          title: 'Risque de déshydratation',
          description: 'Attention aux heures 14h-16h, période critique',
          confidence: 72,
          timeframe: 'Aujourd\'hui',
          category: 'Santé',
        },
      ],
      nutrition: [
        {
          id: '1',
          type: 'insight' as const,
          title: 'Équilibre protéines optimal',
          description: 'Vos apports en protéines sont parfaitement répartis',
          confidence: 92,
          timeframe: 'Cette semaine',
          category: 'Macronutriments',
        },
      ],
      sleep: [
        {
          id: '1',
          type: 'improvement' as const,
          title: 'Optimisation du sommeil',
          description: 'Se coucher 30min plus tôt améliorerait votre récupération',
          confidence: 88,
          timeframe: '2 semaines',
          category: 'Récupération',
        },
      ],
      workout: [
        {
          id: '1',
          type: 'insight' as const,
          title: 'Progression constante',
          description: 'Votre force augmente de 3% par semaine',
          confidence: 95,
          timeframe: 'Mensuel',
          category: 'Performance',
        },
      ],
    };
    
    return predictions[pillar] || [];
  };

  const generateMockCoaching = (pillar: string): Coaching[] => {
    const coaching = {
      hydration: [
        {
          id: '1',
          type: 'tip' as const,
          title: 'Hydratation intelligente',
          description: 'Buvez un verre d\'eau à chaque transition d\'activité',
          actionItems: ['Placer des bouteilles d\'eau visibles', 'Programmer des rappels'],
          difficulty: 'easy' as const,
          estimatedTime: '2 minutes',
        },
      ],
      nutrition: [
        {
          id: '1',
          type: 'habit' as const,
          title: 'Préparation des repas',
          description: 'Préparez vos légumes le dimanche pour la semaine',
          actionItems: ['Acheter des contenants', 'Bloquer 1h le dimanche'],
          difficulty: 'medium' as const,
          estimatedTime: '60 minutes',
        },
      ],
      sleep: [
        {
          id: '1',
          type: 'challenge' as const,
          title: 'Routine du coucher',
          description: 'Créez une routine relaxante de 30 minutes avant le coucher',
          actionItems: ['Éteindre les écrans', 'Lire ou méditer', 'Température fraîche'],
          difficulty: 'medium' as const,
          estimatedTime: '30 minutes',
        },
      ],
      workout: [
        {
          id: '1',
          type: 'tip' as const,
          title: 'Progression graduelle',
          description: 'Augmentez l\'intensité de 5% chaque semaine',
          actionItems: ['Noter ses performances', 'Écouter son corps'],
          difficulty: 'easy' as const,
          estimatedTime: '5 minutes',
        },
      ],
    };
    
    return coaching[pillar] || [];
  };

  const generateMockRecommendations = (pillar: string): Recommendation[] => {
    const recommendations = {
      hydration: [
        {
          id: '1',
          type: 'optimization' as const,
          title: 'Timing optimal',
          description: 'Boire 500ml au réveil pour relancer le métabolisme',
          priority: 'high' as const,
          impact: 'Amélioration de 20% de l\'énergie matinale',
        },
      ],
      nutrition: [
        {
          id: '1',
          type: 'goal' as const,
          title: 'Objectif fibres',
          description: 'Augmenter les fibres à 35g/jour pour une meilleure digestion',
          priority: 'medium' as const,
          impact: 'Amélioration du transit et satiété',
        },
      ],
      sleep: [
        {
          id: '1',
          type: 'adjustment' as const,
          title: 'Température optimale',
          description: 'Maintenir la chambre entre 18-20°C pour un sommeil profond',
          priority: 'high' as const,
          impact: '+15% de sommeil profond',
        },
      ],
      workout: [
        {
          id: '1',
          type: 'optimization' as const,
          title: 'Récupération active',
          description: 'Ajouter 2 séances de récupération active par semaine',
          priority: 'medium' as const,
          impact: 'Réduction de 30% des courbatures',
        },
      ],
    };
    
    return recommendations[pillar] || [];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement':
      case 'optimization':
        return <TrendingUp className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'insight':
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      case 'challenge':
      case 'goal':
        return <Target className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'improvement':
      case 'optimization':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'insight':
      case 'tip':
        return 'bg-blue-500';
      case 'challenge':
      case 'goal':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white`}>
            <Brain className="w-4 h-4" />
          </div>
          <span>{config.title}</span>
          <span className="text-2xl">{config.icon}</span>
        </CardTitle>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {showPredictions && (
            <Button
              variant={activeTab === 'predictions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('predictions')}
              className="flex-1"
            >
              Prédictions
            </Button>
          )}
          {showCoaching && (
            <Button
              variant={activeTab === 'coaching' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('coaching')}
              className="flex-1"
            >
              Coaching
            </Button>
          )}
          {showRecommendations && (
            <Button
              variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('recommendations')}
              className="flex-1"
            >
              Recommandations
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Predictions */}
        {activeTab === 'predictions' && (
          <div className="space-y-3">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full ${getTypeColor(prediction.type)} flex items-center justify-center text-white`}>
                      {getTypeIcon(prediction.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{prediction.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{prediction.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Confiance: {prediction.confidence}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {prediction.timeframe}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {prediction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Coaching */}
        {activeTab === 'coaching' && (
          <div className="space-y-3">
            {coaching.map((coach) => (
              <div key={coach.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getTypeColor(coach.type)} flex items-center justify-center text-white`}>
                    {getTypeIcon(coach.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{coach.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{coach.description}</p>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Actions à suivre :</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {coach.actionItems.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center space-x-3 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {coach.difficulty === 'easy' ? 'Facile' : coach.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {coach.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getTypeColor(rec.type)} flex items-center justify-center text-white`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          rec.priority === 'high' ? 'border-red-500 text-red-700' :
                          rec.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                          'border-green-500 text-green-700'
                        }`}
                      >
                        Priorité: {rec.priority === 'high' ? 'Haute' : rec.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Badge>
                    </div>
                    {rec.impact && (
                      <p className="text-sm text-blue-600 mt-2 font-medium">
                        Impact: {rec.impact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Refresh button */}
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={loadAIInsights}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Brain className="w-4 h-4 mr-2" />
            Nouvelle analyse IA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIIntelligence;