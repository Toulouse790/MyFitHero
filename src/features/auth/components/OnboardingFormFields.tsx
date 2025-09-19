// src/features/auth/components/OnboardingFormFields.tsx
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Activity, 
  Target, 
  Clock,
  Heart,
  Apple,
  Droplets,
  Moon,
  CheckCircle2
} from 'lucide-react';
import { ConversationalStep, OnboardingData } from '../types/conversationalOnboarding';

interface OnboardingFormFieldsProps {
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
  data: OnboardingData;
  className?: string;
}

export const OnboardingFormFields: React.FC<OnboardingFormFieldsProps> = ({
  step,
  currentResponse,
  onResponseChange,
  data,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(currentResponse || '');

  const handleChange = useCallback((value: any) => {
    setLocalValue(value);
    onResponseChange(value);
  }, [onResponseChange]);

  const renderField = () => {
    switch (step.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={step.id} className="text-sm font-medium">
              {step.question}
            </Label>
            <Input
              id={step.id}
              type="text"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={step.placeholder}
              className="text-lg"
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={step.id} className="text-sm font-medium">
              {step.question}
            </Label>
            <Input
              id={step.id}
              type="number"
              value={localValue}
              onChange={(e) => handleChange(Number(e.target.value))}
              placeholder={step.placeholder}
              min={step.min}
              max={step.max}
              className="text-lg"
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {step.options?.map((option) => (
                <Button
                  key={option.value}
                  variant={localValue === option.value ? "default" : "outline"}
                  onClick={() => handleChange(option.value)}
                  className="h-auto p-4 justify-start text-left"
                >
                  <div className="flex items-center space-x-3">
                    {option.icon && <div className="text-xl">{option.icon}</div>}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {localValue === option.value && (
                    <CheckCircle2 className="h-5 w-5 ml-auto text-primary" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {step.options?.map((option) => {
                const isSelected = Array.isArray(localValue) && localValue.includes(option.value);
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => {
                      const currentArray = Array.isArray(localValue) ? localValue : [];
                      const newArray = isSelected
                        ? currentArray.filter(v => v !== option.value)
                        : [...currentArray, option.value];
                      handleChange(newArray);
                    }}
                    className="h-auto p-4 justify-start text-left"
                  >
                    <div className="flex items-center space-x-3">
                      {option.icon && <div className="text-xl">{option.icon}</div>}
                      <div>
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-muted-foreground">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 ml-auto text-primary" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{step.question}</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{step.min}</span>
                <span className="font-medium text-lg text-foreground">
                  {localValue || step.min}
                  {step.unit && ` ${step.unit}`}
                </span>
                <span>{step.max}</span>
              </div>
              <Slider
                value={[localValue || step.min]}
                onValueChange={(value) => handleChange(value[0])}
                min={step.min}
                max={step.max}
                step={step.step || 1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{step.question}</h3>
            <div className="flex items-center space-x-3">
              <Switch
                checked={localValue || false}
                onCheckedChange={handleChange}
              />
              <Label className="text-sm">
                {localValue ? 'Oui' : 'Non'}
              </Label>
            </div>
          </div>
        );

      case 'pack-selection':
        return (
          <PackSelectionField 
            step={step}
            currentResponse={localValue}
            onResponseChange={handleChange}
          />
        );

      case 'sport-selection':
        return (
          <SportSelectionField 
            step={step}
            currentResponse={localValue}
            onResponseChange={handleChange}
          />
        );

      case 'lifestyle-assessment':
        return (
          <LifestyleAssessmentField 
            step={step}
            currentResponse={localValue}
            onResponseChange={handleChange}
          />
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Type de champ non supporté: {step.type}
          </div>
        );
    }
  };

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardContent className="p-6">
        {renderField()}
      </CardContent>
    </Card>
  );
};

// Composant spécialisé pour la sélection de pack
const PackSelectionField: React.FC<{
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}> = ({ step, currentResponse, onResponseChange }) => {
  const packs = [
    {
      id: 'essential',
      name: 'Pack Essentiel',
      description: 'Les bases pour commencer votre transformation',
      modules: ['nutrition', 'hydration', 'wellness'],
      duration: '5-10 min',
      icon: <Heart className="h-6 w-6" />,
      price: 'Gratuit',
    },
    {
      id: 'complete',
      name: 'Pack Complet',
      description: 'Une approche holistique de votre santé',
      modules: ['sport', 'strength', 'nutrition', 'hydration', 'sleep', 'wellness'],
      duration: '10-15 min',
      icon: <Target className="h-6 w-6" />,
      price: 'Premium',
      popular: true,
    },
    {
      id: 'athlete',
      name: 'Pack Athlète',
      description: 'Pour les sportifs exigeants',
      modules: ['sport', 'strength', 'nutrition', 'hydration', 'sleep', 'wellness', 'recovery'],
      duration: '15-20 min',
      icon: <Activity className="h-6 w-6" />,
      price: 'Premium Pro',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center">{step.question}</h3>
      <div className="grid gap-4">
        {packs.map((pack) => (
          <Card 
            key={pack.id}
            className={`cursor-pointer transition-all duration-200 ${
              currentResponse === pack.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onResponseChange(pack.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {pack.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{pack.name}</h4>
                      {pack.popular && (
                        <Badge variant="default" className="text-xs">
                          Populaire
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pack.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{pack.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {pack.modules.length} modules
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{pack.price}</div>
                  {currentResponse === pack.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary mt-2" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Composant spécialisé pour la sélection de sport
const SportSelectionField: React.FC<{
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}> = ({ step, currentResponse, onResponseChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const sportCategories = [
    {
      name: 'Sports collectifs',
      sports: [
        { id: 'football', name: 'Football', icon: '⚽' },
        { id: 'basketball', name: 'Basketball', icon: '🏀' },
        { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
        { id: 'handball', name: 'Handball', icon: '🤾' },
        { id: 'rugby', name: 'Rugby', icon: '🏉' },
      ],
    },
    {
      name: 'Sports individuels',
      sports: [
        { id: 'running', name: 'Course à pied', icon: '🏃' },
        { id: 'cycling', name: 'Cyclisme', icon: '🚴' },
        { id: 'swimming', name: 'Natation', icon: '🏊' },
        { id: 'tennis', name: 'Tennis', icon: '🎾' },
        { id: 'golf', name: 'Golf', icon: '⛳' },
      ],
    },
    {
      name: 'Sports de combat',
      sports: [
        { id: 'boxing', name: 'Boxe', icon: '🥊' },
        { id: 'karate', name: 'Karaté', icon: '🥋' },
        { id: 'judo', name: 'Judo', icon: '🥋' },
        { id: 'mma', name: 'MMA', icon: '🥊' },
        { id: 'wrestling', name: 'Lutte', icon: '🤼' },
      ],
    },
  ];

  const filteredCategories = sportCategories.map(category => ({
    ...category,
    sports: category.sports.filter(sport =>
      sport.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.sports.length > 0);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center">{step.question}</h3>
      
      <Input
        type="text"
        placeholder="Rechercher un sport..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md mx-auto"
      />

      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <h4 className="font-medium mb-3">{category.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {category.sports.map((sport) => (
                <Button
                  key={sport.id}
                  variant={currentResponse === sport.id ? "default" : "outline"}
                  onClick={() => onResponseChange(sport.id)}
                  className="h-auto p-4 justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{sport.icon}</span>
                    <span className="text-sm">{sport.name}</span>
                  </div>
                  {currentResponse === sport.id && (
                    <CheckCircle2 className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun sport trouvé pour "{searchTerm}"
        </div>
      )}
    </div>
  );
};

// Composant spécialisé pour l'évaluation du style de vie
const LifestyleAssessmentField: React.FC<{
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}> = ({ step, currentResponse, onResponseChange }) => {
  const assessmentAreas = [
    {
      id: 'activity_level',
      title: 'Niveau d\'activité',
      icon: <Activity className="h-5 w-5" />,
      options: [
        { value: 'sedentary', label: 'Sédentaire', description: 'Peu ou pas d\'exercice' },
        { value: 'light', label: 'Léger', description: '1-3 jours/semaine' },
        { value: 'moderate', label: 'Modéré', description: '3-5 jours/semaine' },
        { value: 'active', label: 'Actif', description: '6-7 jours/semaine' },
        { value: 'very_active', label: 'Très actif', description: 'Sport intense quotidien' },
      ],
    },
    {
      id: 'stress_level',
      title: 'Niveau de stress',
      icon: <Heart className="h-5 w-5" />,
      options: [
        { value: 'low', label: 'Faible', description: 'Rarement stressé' },
        { value: 'moderate', label: 'Modéré', description: 'Parfois stressé' },
        { value: 'high', label: 'Élevé', description: 'Souvent stressé' },
        { value: 'very_high', label: 'Très élevé', description: 'Constamment stressé' },
      ],
    },
    {
      id: 'sleep_quality',
      title: 'Qualité du sommeil',
      icon: <Moon className="h-5 w-5" />,
      options: [
        { value: 'excellent', label: 'Excellente', description: 'Sommeil réparateur' },
        { value: 'good', label: 'Bonne', description: 'Généralement bien' },
        { value: 'fair', label: 'Correcte', description: 'Parfois difficile' },
        { value: 'poor', label: 'Mauvaise', description: 'Souvent perturbé' },
      ],
    },
  ];

  const responses = currentResponse || {};

  const handleAreaResponse = (areaId: string, value: string) => {
    const newResponses = { ...responses, [areaId]: value };
    onResponseChange(newResponses);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-center">{step.question}</h3>
      
      {assessmentAreas.map((area) => (
        <Card key={area.id} className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              {area.icon}
              <h4 className="font-medium">{area.title}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {area.options.map((option) => (
                <Button
                  key={option.value}
                  variant={responses[area.id] === option.value ? "default" : "outline"}
                  onClick={() => handleAreaResponse(area.id, option.value)}
                  className="h-auto p-4 justify-start text-left"
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                  {responses[area.id] === option.value && (
                    <CheckCircle2 className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OnboardingFormFields;