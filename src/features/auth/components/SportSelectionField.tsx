// src/features/auth/components/SportSelectionField.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Bike, 
  Waves, 
  Activity, 
  Trophy,
  Heart,
  Check
} from 'lucide-react';
import { ConversationalStep } from '../types/conversationalOnboarding';

interface SportSelectionFieldProps {
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}

export const SportSelectionField: React.FC<SportSelectionFieldProps> = ({
  step,
  currentResponse,
  onResponseChange
}) => {
  const handleSportToggle = (sportId: string) => {
    const currentSports = Array.isArray(currentResponse) ? currentResponse : [];
    
    if (currentSports.includes(sportId)) {
      onResponseChange(currentSports.filter(id => id !== sportId));
    } else {
      onResponseChange([...currentSports, sportId]);
    }
  };

  const sports = [
    {
      id: 'musculation',
      name: 'Musculation',
      icon: Dumbbell,
      description: 'Développement musculaire et force'
    },
    {
      id: 'cardio',
      name: 'Cardio',
      icon: Heart,
      description: 'Endurance et santé cardiovasculaire'
    },
    {
      id: 'cyclisme',
      name: 'Cyclisme',
      icon: Bike,
      description: 'Vélo route et VTT'
    },
    {
      id: 'natation',
      name: 'Natation',
      icon: Waves,
      description: 'Sport complet et doux pour les articulations'
    },
    {
      id: 'running',
      name: 'Course à pied',
      icon: Activity,
      description: 'Course et jogging'
    },
    {
      id: 'crossfit',
      name: 'CrossFit',
      icon: Trophy,
      description: 'Entraînement fonctionnel intense'
    }
  ];

  const selectedSports = Array.isArray(currentResponse) ? currentResponse : [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{step.question}</h3>
      <p className="text-sm text-muted-foreground">Sélectionnez tous les sports qui vous intéressent</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports.map((sport) => {
          const IconComponent = sport.icon;
          const isSelected = selectedSports.includes(sport.id);
          
          return (
            <Card 
              key={sport.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSportToggle(sport.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <IconComponent className={`h-5 w-5 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{sport.name}</h4>
                      <p className="text-xs text-muted-foreground">{sport.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedSports.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedSports.map((sportId) => {
            const sport = sports.find(s => s.id === sportId);
            return sport ? (
              <Badge key={sportId} variant="secondary">
                {sport.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};