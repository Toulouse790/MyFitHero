// src/features/auth/components/NutritionPreferencesField.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Apple,
  Leaf,
  Fish,
  Beef,
  Wheat,
  AlertTriangle,
  Check
} from 'lucide-react';
import { ConversationalStep } from '../types/conversationalOnboarding';

interface NutritionPreferencesFieldProps {
  step: ConversationalStep;
  currentResponse: any;
  onResponseChange: (response: any) => void;
}

export const NutritionPreferencesField: React.FC<NutritionPreferencesFieldProps> = ({
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

  const dietTypes = [
    {
      id: 'omnivore',
      name: 'Omnivore',
      icon: Apple,
      description: 'Tous types d\'aliments'
    },
    {
      id: 'vegetarian',
      name: 'Végétarien',
      icon: Leaf,
      description: 'Sans viande ni poisson'
    },
    {
      id: 'vegan',
      name: 'Végan',
      icon: Leaf,
      description: 'Aucun produit animal'
    },
    {
      id: 'pescatarian',
      name: 'Pescatarien',
      icon: Fish,
      description: 'Poisson mais pas de viande'
    },
    {
      id: 'keto',
      name: 'Cétogène',
      icon: Beef,
      description: 'Riche en graisses, pauvre en glucides'
    },
    {
      id: 'gluten_free',
      name: 'Sans gluten',
      icon: Wheat,
      description: 'Évite le blé, seigle, orge'
    }
  ];

  const commonAllergies = [
    'Arachides',
    'Fruits à coque',
    'Lait',
    'Œufs',
    'Soja',
    'Poisson',
    'Crustacés',
    'Sésame'
  ];

  const selectedAllergies = currentData.allergies || [];
  
  const handleAllergyToggle = (allergy: string) => {
    const current = selectedAllergies.includes(allergy) 
      ? selectedAllergies.filter((a: string) => a !== allergy)
      : [...selectedAllergies, allergy];
    handleFieldChange('allergies', current);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{step.question}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Aidez-nous à personnaliser vos recommandations nutritionnelles
        </p>
      </div>

      {/* Type de régime */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Type de régime alimentaire</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dietTypes.map((diet) => {
            const IconComponent = diet.icon;
            const isSelected = currentData.diet_type === diet.id;
            
            return (
              <Card 
                key={diet.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleFieldChange('diet_type', diet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{diet.name}</h4>
                        <p className="text-xs text-muted-foreground">{diet.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Objectif calorique */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Objectif calorique quotidien</Label>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>1200 kcal</span>
            <Badge variant="outline">
              {currentData.calorie_target || 2000} kcal
            </Badge>
            <span>3500 kcal</span>
          </div>
          <Slider
            value={[currentData.calorie_target || 2000]}
            onValueChange={(value) => handleFieldChange('calorie_target', value[0])}
            min={1200}
            max={3500}
            step={50}
            className="w-full"
          />
        </div>
      </div>

      {/* Fréquence des repas */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Nombre de repas par jour</Label>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>2 repas</span>
            <Badge variant="outline">
              {currentData.meals_per_day || 3} repas
            </Badge>
            <span>6 repas</span>
          </div>
          <Slider
            value={[currentData.meals_per_day || 3]}
            onValueChange={(value) => handleFieldChange('meals_per_day', value[0])}
            min={2}
            max={6}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Allergies et intolérances */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span>Allergies et intolérances</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonAllergies.map((allergy) => {
            const isSelected = selectedAllergies.includes(allergy);
            return (
              <button
                key={allergy}
                onClick={() => handleAllergyToggle(allergy)}
                className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                {allergy}
              </button>
            );
          })}
        </div>
      </div>

      {/* Préférences de cuisson */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Préférences de préparation</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="meal_prep" className="text-sm">
              J'aime préparer mes repas à l'avance (meal prep)
            </Label>
            <Switch
              id="meal_prep"
              checked={currentData.meal_prep || false}
              onCheckedChange={(checked) => handleFieldChange('meal_prep', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="quick_meals" className="text-sm">
              Je préfère les repas rapides (≤ 30 min)
            </Label>
            <Switch
              id="quick_meals"
              checked={currentData.quick_meals || false}
              onCheckedChange={(checked) => handleFieldChange('quick_meals', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="cooking_experience" className="text-sm">
              J'ai de l'expérience en cuisine
            </Label>
            <Switch
              id="cooking_experience"
              checked={currentData.cooking_experience || false}
              onCheckedChange={(checked) => handleFieldChange('cooking_experience', checked)}
            />
          </div>
        </div>
      </div>

      {/* Résumé */}
      {currentData.diet_type && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Apple className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Résumé de vos préférences nutritionnelles :</h4>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Régime:</span>
                <span className="ml-2 font-medium">
                  {dietTypes.find(d => d.id === currentData.diet_type)?.name}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Objectif calorique:</span>
                <span className="ml-2 font-medium">{currentData.calorie_target || 2000} kcal/jour</span>
              </p>
              <p>
                <span className="text-muted-foreground">Repas par jour:</span>
                <span className="ml-2 font-medium">{currentData.meals_per_day || 3}</span>
              </p>
              {selectedAllergies.length > 0 && (
                <p>
                  <span className="text-muted-foreground">Allergies:</span>
                  <span className="ml-2 font-medium">{selectedAllergies.join(', ')}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};