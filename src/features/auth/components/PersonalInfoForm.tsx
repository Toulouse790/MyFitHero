import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { AlertCircle, User, Calendar, Ruler, Weight, Activity } from 'lucide-react';

export interface PersonalInfo {
  age: number | null;
  gender: string;
  height: number | null; // en cm
  weight: number | null; // en kg
  activityLevel: string;
  fitnessGoals: string[];
  medicalConditions: string[];
  injuries: string[];
}

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onValidate: (isValid: boolean) => void;
  onBack?: () => void;
  onSkip?: () => void;
  className?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
  onValidate,
  onBack,
  onSkip,
  className = ''
}) => {
  const [formData, setFormData] = useState<PersonalInfo>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imc, setImc] = useState<number | null>(null);
  const [imcCategory, setImcCategory] = useState<string>('');

  // Options pour les sélecteurs
  const genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' },
    { value: 'prefer-not-to-say', label: 'Je préfère ne pas le dire' }
  ];

  const activityLevelOptions = [
    { 
      value: 'sedentary', 
      label: 'Sédentaire', 
      description: 'Peu ou pas d\'exercice physique' 
    },
    { 
      value: 'lightly-active', 
      label: 'Légèrement actif', 
      description: '1-3 séances par semaine' 
    },
    { 
      value: 'moderately-active', 
      label: 'Modérément actif', 
      description: '3-5 séances par semaine' 
    },
    { 
      value: 'very-active', 
      label: 'Très actif', 
      description: '6-7 séances par semaine' 
    },
    { 
      value: 'extremely-active', 
      label: 'Extrêmement actif', 
      description: 'Athlète ou entraînement intensif quotidien' 
    }
  ];

  const fitnessGoalsOptions = [
    'Perdre du poids',
    'Prendre de la masse musculaire',
    'Améliorer l\'endurance',
    'Augmenter la force',
    'Améliorer la flexibilité',
    'Réduire le stress',
    'Maintenir la forme',
    'Récupération après blessure',
    'Performance sportive',
    'Bien-être général'
  ];

  const commonConditions = [
    'Hypertension',
    'Diabète type 1',
    'Diabète type 2',
    'Asthme',
    'Problèmes cardiaques',
    'Arthrite',
    'Ostéoporose',
    'Problèmes de dos',
    'Problèmes de genoux',
    'Grossesse',
    'Aucune condition'
  ];

  const commonInjuries = [
    'Blessure au dos',
    'Blessure au genou',
    'Blessure à l\'épaule',
    'Blessure à la cheville',
    'Entorse',
    'Fracture récente',
    'Tendinite',
    'Déchirure musculaire',
    'Commotion cérébrale',
    'Aucune blessure'
  ];

  // Calcul de l'IMC et validation
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const calculatedImc = formData.weight / (heightInMeters * heightInMeters);
      setImc(Math.round(calculatedImc * 10) / 10);
      
      // Catégorie IMC
      if (calculatedImc < 18.5) setImcCategory('Insuffisance pondérale');
      else if (calculatedImc < 25) setImcCategory('Poids normal');
      else if (calculatedImc < 30) setImcCategory('Surpoids');
      else setImcCategory('Obésité');
    } else {
      setImc(null);
      setImcCategory('');
    }
  }, [formData.height, formData.weight]);

  // Validation du formulaire
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || formData.age < 16 || formData.age > 100) {
      newErrors.age = 'L\'âge doit être entre 16 et 100 ans';
    }

    if (!formData.gender) {
      newErrors.gender = 'Le genre est requis';
    }

    if (!formData.height || formData.height < 120 || formData.height > 250) {
      newErrors.height = 'La taille doit être entre 120 et 250 cm';
    }

    if (!formData.weight || formData.weight < 40 || formData.weight > 200) {
      newErrors.weight = 'Le poids doit être entre 40 et 200 kg';
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Le niveau d\'activité est requis';
    }

    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    onValidate(isValid);
    
    if (isValid) {
      onChange(formData);
    }
  }, [formData, onChange, onValidate]);

  function updateField<K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(array: string[], item: string): string[] {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  }

  function getImcColor(imc: number): string {
    if (imc < 18.5) return 'text-blue-600';
    if (imc < 25) return 'text-green-600';
    if (imc < 30) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <User className="w-7 h-7" />
          Informations personnelles
        </h2>
        <p className="text-gray-600">
          Ces informations nous aident à personnaliser vos recommandations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations de base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Âge */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Âge *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 25"
                value={formData.age || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('age', parseInt(e.target.value) || null)}
                className={errors.age ? 'border-red-500' : ''}
              />
              {errors.age && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.age}
                </div>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="gender">Genre *</Label>
              <Select value={formData.gender} onValueChange={(value: string) => updateField('gender', value)}>
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender}
                </div>
              )}
            </div>

            {/* Taille */}
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Taille (cm) *
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 175"
                value={formData.height || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('height', parseInt(e.target.value) || null)}
                className={errors.height ? 'border-red-500' : ''}
              />
              {errors.height && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.height}
                </div>
              )}
            </div>

            {/* Poids */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Poids (kg) *
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 70"
                value={formData.weight || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('weight', parseInt(e.target.value) || null)}
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.weight}
                </div>
              )}
            </div>

            {/* IMC */}
            {imc && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">IMC calculé :</span>
                  <div className="text-right">
                    <span className={`font-bold ${getImcColor(imc)}`}>{imc}</span>
                    <p className={`text-xs ${getImcColor(imc)}`}>{imcCategory}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Niveau d'activité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Niveau d'activité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Niveau d'activité actuel *</Label>
              <div className="space-y-2">
                {activityLevelOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.activityLevel === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => updateField('activityLevel', option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.activityLevel === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
              {errors.activityLevel && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.activityLevel}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs fitness */}
      <Card>
        <CardHeader>
          <CardTitle>Objectifs fitness (optionnel)</CardTitle>
          <p className="text-sm text-gray-600">Sélectionnez vos objectifs principaux</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {fitnessGoalsOptions.map((goal) => (
              <Badge
                key={goal}
                variant={formData.fitnessGoals.includes(goal) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => updateField('fitnessGoals', toggleArrayItem(formData.fitnessGoals, goal))}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditions médicales */}
      <Card>
        <CardHeader>
          <CardTitle>Conditions médicales (optionnel)</CardTitle>
          <p className="text-sm text-gray-600">Ces informations restent confidentielles</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonConditions.map((condition) => (
              <Badge
                key={condition}
                variant={formData.medicalConditions.includes(condition) ? "destructive" : "outline"}
                className="cursor-pointer"
                onClick={() => updateField('medicalConditions', toggleArrayItem(formData.medicalConditions, condition))}
              >
                {condition}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blessures */}
      <Card>
        <CardHeader>
          <CardTitle>Blessures récentes (optionnel)</CardTitle>
          <p className="text-sm text-gray-600">Blessures des 12 derniers mois</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonInjuries.map((injury) => (
              <Badge
                key={injury}
                variant={formData.injuries.includes(injury) ? "destructive" : "outline"}
                className="cursor-pointer"
                onClick={() => updateField('injuries', toggleArrayItem(formData.injuries, injury))}
              >
                {injury}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Retour
            </Button>
          )}
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Passer cette étape
            </Button>
          )}
        </div>
        
        <Button 
          disabled={Object.keys(errors).length > 0}
          onClick={() => onChange(formData)}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;