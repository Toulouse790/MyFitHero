import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Play, BookOpen, Users, TrendingUp, Calendar, Star, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Types pour l'exercice
interface MuscleGroup {
  name: string;
  primary: boolean;
  percentage: number;
}

interface ExerciseVariant {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  equipment: string[];
}

interface PerformanceRecord {
  date: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface ExerciseData {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  safetyTips: string[];
  muscleGroups: MuscleGroup[];
  equipment: string[];
  videoUrl?: string;
  imageUrl?: string;
  variants: ExerciseVariant[];
  personalRecords: PerformanceRecord[];
  averageRating: number;
  totalSessions: number;
}

const ExerciseDetailPage = () => {
  const [location, setLocation] = useLocation();
  const exerciseId = location.split('/').pop();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Données d'exemple (à remplacer par un fetch API)
  const [exercise] = useState<ExerciseData>({
    id: exerciseId || '1',
    name: 'Développé couché',
    category: 'Pectoraux',
    difficulty: 'intermediate',
    description: 'Le développé couché est un exercice fondamental de musculation qui cible principalement les pectoraux, les triceps et les deltoïdes antérieurs. Excellent pour développer la force et la masse musculaire du haut du corps.',
    instructions: [
      'Allongez-vous sur le banc, les pieds bien ancrés au sol',
      'Saisissez la barre avec une prise légèrement plus large que les épaules',
      'Sortez la barre du rack et stabilisez-la au-dessus de votre poitrine',
      'Descendez la barre lentement vers votre poitrine en contrôlant le mouvement',
      'Poussez la barre vers le haut en contractant les pectoraux',
      'Revenez à la position de départ sans verrouiller complètement les coudes'
    ],
    safetyTips: [
      'Toujours utiliser un spotteur pour les charges lourdes',
      'Gardez les omoplates serrées pendant tout le mouvement',
      'Ne faites pas rebondir la barre sur votre poitrine',
      'Maintenez une cambrure naturelle du dos',
      'Échauffez-vous correctement avant de commencer'
    ],
    muscleGroups: [
      { name: 'Pectoraux', primary: true, percentage: 60 },
      { name: 'Triceps', primary: false, percentage: 25 },
      { name: 'Deltoïdes antérieurs', primary: false, percentage: 15 }
    ],
    equipment: ['Barre olympique', 'Banc de développé couché', 'Poids'],
    variants: [
      {
        id: '1',
        name: 'Développé couché haltères',
        difficulty: 'beginner',
        description: 'Version avec haltères pour plus d\'amplitude et de stabilisation',
        equipment: ['Haltères', 'Banc']
      },
      {
        id: '2',
        name: 'Développé incliné',
        difficulty: 'intermediate',
        description: 'Variante inclinée pour cibler le haut des pectoraux',
        equipment: ['Barre olympique', 'Banc inclinable']
      },
      {
        id: '3',
        name: 'Développé décliné',
        difficulty: 'advanced',
        description: 'Version déclinée pour le bas des pectoraux',
        equipment: ['Barre olympique', 'Banc déclinable']
      }
    ],
    personalRecords: [
      { date: '2024-09-20', sets: 4, reps: 8, weight: 85, notes: 'Excellente session, forme parfaite' },
      { date: '2024-09-17', sets: 4, reps: 10, weight: 80, notes: 'Léger tremblement sur la dernière série' },
      { date: '2024-09-15', sets: 3, reps: 12, weight: 75, notes: 'Travail en endurance' },
      { date: '2024-09-12', sets: 5, reps: 6, weight: 90, notes: 'Nouveau PR ! 🔥' },
      { date: '2024-09-10', sets: 4, reps: 8, weight: 82.5, notes: 'Progression constante' }
    ],
    averageRating: 4.8,
    totalSessions: 24
  });

  const goBack = () => {
    setLocation('/dashboard');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return 'Inconnu';
    }
  };

  const getMaxWeight = () => {
    return Math.max(...exercise.personalRecords.map(r => r.weight || 0));
  };

  const getAverageWeight = () => {
    const weights = exercise.personalRecords.filter(r => r.weight).map(r => r.weight!);
    return weights.length > 0 ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) : 0;
  };

  const getProgressTrend = () => {
    if (exercise.personalRecords.length < 2) return 0;
    const recent = exercise.personalRecords.slice(0, 3);
    const older = exercise.personalRecords.slice(-3);
    
    const recentAvg = recent.reduce((sum, r) => sum + (r.weight || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + (r.weight || 0), 0) / older.length;
    
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{exercise.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {getDifficultyLabel(exercise.difficulty)}
            </Badge>
            <Badge variant="outline">{exercise.category}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{exercise.averageRating}</span>
              <span className="text-sm text-gray-500">({exercise.totalSessions} sessions)</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="variants">Variantes</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          {/* Vidéo/Animation placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-blue-600" />
                Démonstration visuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Vidéo de démonstration</p>
                  <p className="text-sm text-gray-500">Cliquez pour voir l'exercice en action</p>
                </div>
              </div>
              <p className="text-gray-700">{exercise.description}</p>
            </CardContent>
          </Card>

          {/* Muscles ciblés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Muscles ciblés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exercise.muscleGroups.map((muscle, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${muscle.primary ? 'text-green-700' : 'text-gray-600'}`}>
                        {muscle.name}
                        {muscle.primary && <Badge variant="default" className="ml-2 text-xs">Principal</Badge>}
                      </span>
                      <span className="text-sm text-gray-500">{muscle.percentage}%</span>
                    </div>
                    <Progress 
                      value={muscle.percentage} 
                      className={`h-2 ${muscle.primary ? 'bg-green-100' : 'bg-gray-100'}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Équipement requis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-600" />
                Équipement requis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques personnelles */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Record personnel:</span>
                    <span className="font-bold text-blue-600">{getMaxWeight()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Poids moyen:</span>
                    <span className="font-medium">{getAverageWeight()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Progression:</span>
                    <span className={`font-medium ${getProgressTrend() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {getProgressTrend() >= 0 ? '+' : ''}{getProgressTrend()}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Activité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sessions totales:</span>
                    <span className="font-bold text-purple-600">{exercise.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dernière session:</span>
                    <span className="font-medium">
                      {new Date(exercise.personalRecords[0]?.date || '').toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fréquence:</span>
                    <span className="font-medium">2x/semaine</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Instructions */}
        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Instructions détaillées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Zap className="h-5 w-5 mr-2" />
                Conseils de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exercise.safetyTips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-gray-700">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Variantes */}
        <TabsContent value="variants" className="space-y-4">
          <div className="space-y-4">
            {exercise.variants.map((variant) => (
              <Card key={variant.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{variant.name}</CardTitle>
                    <Badge className={getDifficultyColor(variant.difficulty)}>
                      {getDifficultyLabel(variant.difficulty)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{variant.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 mr-2">Équipement:</span>
                    {variant.equipment.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                Historique personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exercise.personalRecords.map((record, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">
                          {new Date(record.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {record.sets} séries × {record.reps} reps
                          {record.weight && ` @ ${record.weight}kg`}
                        </div>
                      </div>
                      {record.weight === getMaxWeight() && (
                        <Badge variant="default" className="bg-yellow-500">
                          🏆 Record
                        </Badge>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-700 italic">"{record.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Graphique de progression (placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Progression des charges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <p>Graphique de progression</p>
                  <p className="text-sm">Évolution des performances dans le temps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExerciseDetailPage;
