// src/features/auth/components/PackSelectionField.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { ConversationalStep } from '../types/conversationalOnboarding';

interface PackSelectionFieldProps {
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}

export const PackSelectionField: React.FC<PackSelectionFieldProps> = ({
  step,
  currentResponse,
  onResponseChange
}) => {
  const handlePackSelect = (packId: string) => {
    onResponseChange(packId);
  };

  const packages = [
    {
      id: 'basic',
      name: 'Pack Débutant',
      description: 'Parfait pour commencer votre parcours fitness',
      features: ['Programmes de base', 'Suivi simple', 'Support email'],
      price: 'Gratuit'
    },
    {
      id: 'premium',
      name: 'Pack Premium',
      description: 'Pour les sportifs motivés',
      features: ['Programmes avancés', 'Coaching IA', 'Statistiques détaillées', 'Support prioritaire'],
      price: '9.99€/mois'
    },
    {
      id: 'pro',
      name: 'Pack Pro',
      description: 'Pour les athlètes sérieux',
      features: ['Programmes personnalisés', 'Coach dédié', 'Analyses approfondies', 'Support 24/7'],
      price: '19.99€/mois'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{step.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pack) => (
          <Card 
            key={pack.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentResponse === pack.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handlePackSelect(pack.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{pack.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{pack.description}</p>
                </div>
                {currentResponse === pack.id && (
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                {pack.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Badge variant={pack.id === 'basic' ? 'secondary' : 'default'} className="w-full justify-center">
                {pack.price}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};