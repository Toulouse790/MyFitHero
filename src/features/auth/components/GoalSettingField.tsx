// src/features/auth/components/GoalSettingField.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Target,
  TrendingUp,
  Calendar,
  Weight,
  Timer,
  Check
} from 'lucide-react';
import { ConversationalStep } from '../types/conversationalOnboarding';

interface GoalSettingFieldProps {
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}

export const GoalSettingField: React.FC<GoalSettingFieldProps> = ({
  step,
  currentResponse,
  onResponseChange
}) => {
  const currentData = currentResponse || {};

  const handleFieldChange = (field: string, value: any) => {
    onResponseChange({
      ...currentData,
      [field]: value
    });
  };

  const goalTypes = [
    {
      id: 'weight_loss',
      name: 'Perte de poids',
      icon: TrendingUp,
      description: 'Perdre du poids de manière saine'
    },
    {
      id: 'muscle_gain',
      name: 'Gain musculaire',
      icon: Weight,
      description: 'Développer sa masse musculaire'
    },
    {
      id: 'endurance',
      name: 'Améliorer l\'endurance',
      icon: Timer,
      description: 'Améliorer les capacités cardiovasculaires'
    },
    {
      id: 'general_fitness',
      name: 'Forme générale',
      icon: Target,
      description: 'Maintenir une bonne condition physique'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{step.question}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Définissez vos objectifs pour créer un programme personnalisé
        </p>
      </div>

      {/* Sélection du type d'objectif principal */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Objectif principal</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalTypes.map((goal) => {
            const IconComponent = goal.icon;
            const isSelected = currentData.primary_goal === goal.id;
            
            return (
              <Card 
                key={goal.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleFieldChange('primary_goal', goal.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Paramètres spécifiques selon l'objectif */}
      {currentData.primary_goal && (
        <div className="space-y-4">
          {(currentData.primary_goal === 'weight_loss' || currentData.primary_goal === 'muscle_gain') && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {currentData.primary_goal === 'weight_loss' ? 'Poids à perdre' : 'Poids à gagner'} (kg)
              </Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>1 kg</span>
                  <Badge variant="outline">
                    {currentData.target_weight || 5} kg
                  </Badge>
                  <span>20 kg</span>
                </div>
                <Slider
                  value={[currentData.target_weight || 5]}
                  onValueChange={(value) => handleFieldChange('target_weight', value[0])}
                  min={1}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-base font-medium">Délai souhaité (mois)</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>1 mois</span>
                <Badge variant="outline">
                  {currentData.timeline || 6} mois
                </Badge>
                <span>24 mois</span>
              </div>
              <Slider
                value={[currentData.timeline || 6]}
                onValueChange={(value) => handleFieldChange('timeline', value[0])}
                min={1}
                max={24}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Motivation level (1-10)</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>1 - Faible</span>
                <Badge variant="outline">
                  {currentData.motivation_level || 7}/10
                </Badge>
                <span>10 - Très élevée</span>
              </div>
              <Slider
                value={[currentData.motivation_level || 7]}
                onValueChange={(value) => handleFieldChange('motivation_level', value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="additional_notes" className="text-base font-medium">
              Notes supplémentaires (optionnel)
            </Label>
            <Input
              id="additional_notes"
              placeholder="Ajoutez des détails sur vos objectifs..."
              value={currentData.additional_notes || ''}
              onChange={(e) => handleFieldChange('additional_notes', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Résumé */}
      {currentData.primary_goal && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Résumé de votre objectif :</h4>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Objectif principal:</span>
                <span className="ml-2 font-medium">
                  {goalTypes.find(g => g.id === currentData.primary_goal)?.name}
                </span>
              </p>
              {currentData.target_weight && (
                <p>
                  <span className="text-muted-foreground">Poids cible:</span>
                  <span className="ml-2 font-medium">{currentData.target_weight} kg</span>
                </p>
              )}
              {currentData.timeline && (
                <p>
                  <span className="text-muted-foreground">Délai:</span>
                  <span className="ml-2 font-medium">{currentData.timeline} mois</span>
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Motivation:</span>
                <span className="ml-2 font-medium">{currentData.motivation_level || 7}/10</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};