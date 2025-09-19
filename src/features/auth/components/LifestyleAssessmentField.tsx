// src/features/auth/components/LifestyleAssessmentField.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Clock,
  Moon,
  Utensils,
  Droplets,
  Activity,
  AlertCircle
} from 'lucide-react';
import { ConversationalStep } from '../types/conversationalOnboarding';

interface LifestyleAssessmentFieldProps {
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}

export const LifestyleAssessmentField: React.FC<LifestyleAssessmentFieldProps> = ({
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

  const assessmentFields = [
    {
      id: 'stress_level',
      label: 'Niveau de stress quotidien',
      icon: AlertCircle,
      min: 1,
      max: 10,
      unit: '/10',
      description: '1 = Très détendu, 10 = Très stressé'
    },
    {
      id: 'sleep_hours',
      label: 'Heures de sommeil par nuit',
      icon: Moon,
      min: 4,
      max: 12,
      unit: 'h',
      description: 'Moyenne sur une semaine'
    },
    {
      id: 'water_intake',
      label: 'Consommation d\'eau quotidienne',
      icon: Droplets,
      min: 0.5,
      max: 4,
      step: 0.1,
      unit: 'L',
      description: 'Litres d\'eau par jour'
    },
    {
      id: 'meal_frequency',
      label: 'Nombre de repas par jour',
      icon: Utensils,
      min: 1,
      max: 6,
      unit: ' repas',
      description: 'Incluant les collations'
    },
    {
      id: 'activity_level',
      label: 'Niveau d\'activité quotidienne',
      icon: Activity,
      min: 1,
      max: 10,
      unit: '/10',
      description: '1 = Sédentaire, 10 = Très actif'
    },
    {
      id: 'screen_time',
      label: 'Temps d\'écran quotidien',
      icon: Clock,
      min: 1,
      max: 16,
      unit: 'h',
      description: 'Heures devant un écran'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{step.question}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ces informations nous aideront à personnaliser votre programme
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessmentFields.map((field) => {
          const IconComponent = field.icon;
          const value = currentData[field.id] || field.min;
          
          return (
            <Card key={field.id} className="p-4">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{field.label}</h4>
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{field.min}</span>
                      <Badge variant="outline" className="font-medium">
                        {value}{field.unit}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{field.max}</span>
                    </div>
                    
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) => handleFieldChange(field.id, newValue[0])}
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(currentData).length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Résumé de votre profil lifestyle :</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {assessmentFields.map((field) => {
                const value = currentData[field.id];
                if (value !== undefined) {
                  return (
                    <div key={field.id} className="text-sm">
                      <span className="text-muted-foreground">{field.label}:</span>
                      <span className="ml-1 font-medium">{value}{field.unit}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};