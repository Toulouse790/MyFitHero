import React, { useState } from 'react';
import { useAccessibilityAnnouncement, useFocusManagement, useFocusTrap } from '../utils/accessibilityHooks';
import { AccessibleLayout, SkipLink } from './accessibility/AccessibleLayout';
import { 
  FormField, 
  AccessibleInput, 
  AccessibleSelect, 
  AccessibleTextarea, 
  AccessibleCheckbox,
  AccessibleRadioGroup 
} from './forms/AccessibleForms';
import { AccessibleButton } from './accessibility/AccessibleButton';

interface WorkoutFormData {
  name: string;
  type: string;
  duration: string;
  difficulty: string;
  description: string;
  isPublic: boolean;
  equipment: string[];
}

export const AccessibleWorkoutForm: React.FC = () => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    name: '',
    type: '',
    duration: '',
    difficulty: '',
    description: '',
    isPublic: false,
    equipment: []
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof WorkoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { announce } = useAccessibilityAnnouncement();
  const { manageFocus } = useFocusManagement();
  const formRef = useFocusTrap<HTMLFormElement>();
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WorkoutFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'entraînement est requis';
    }
    
    if (!formData.type) {
      newErrors.type = 'Le type d\'entraînement est requis';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'La durée est requise';
    }
    
    if (!formData.difficulty) {
      newErrors.difficulty = 'Le niveau de difficulté est requis';
    }
    
    setErrors(newErrors);
    
    const hasErrors = Object.keys(newErrors).length > 0;
    if (hasErrors) {
      announce('Le formulaire contient des erreurs. Veuillez les corriger.', 'assertive');
      // Focus sur le premier champ en erreur
      const firstErrorField = Object.keys(newErrors)[0];
      manageFocus(`#${firstErrorField}`);
    }
    
    return !hasErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    announce('Enregistrement de l\'entraînement en cours...', 'polite');
    
    try {
      // Simulation d'une soumission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      announce('Entraînement enregistré avec succès !', 'assertive');
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        type: '',
        duration: '',
        difficulty: '',
        description: '',
        isPublic: false,
        equipment: []
      });
      
    } catch (error) {
      announce('Erreur lors de l\'enregistrement. Veuillez réessayer.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const workoutTypes = [
    { value: 'cardio', label: 'Cardio', description: 'Exercices cardiovasculaires' },
    { value: 'strength', label: 'Musculation', description: 'Renforcement musculaire' },
    { value: 'flexibility', label: 'Flexibilité', description: 'Étirements et yoga' },
    { value: 'hiit', label: 'HIIT', description: 'Entraînement par intervalles' }
  ];
  
  const difficultyLevels = [
    { value: 'beginner', label: 'Débutant', description: 'Pour commencer en douceur' },
    { value: 'intermediate', label: 'Intermédiaire', description: 'Niveau moyen' },
    { value: 'advanced', label: 'Avancé', description: 'Pour les expérimentés' }
  ];

  return (
    <AccessibleLayout>
      <SkipLink href="#workout-form">Aller au formulaire d'entraînement</SkipLink>
      
      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Créer un nouvel entraînement
          </h1>
          <p className="text-text-secondary">
            Remplissez les informations ci-dessous pour créer votre entraînement personnalisé.
            Les champs marqués d'un astérisque (*) sont obligatoires.
          </p>
        </header>

        <form 
          ref={formRef}
          id="workout-form"
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          <FormField
            label="Nom de l'entraînement"
            error={errors.name}
            required
            hint="Donnez un nom descriptif à votre entraînement"
          >
            <AccessibleInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Entraînement matinal complet"
              variant={errors.name ? 'error' : 'default'}
              maxLength={100}
            />
          </FormField>

          <AccessibleRadioGroup
            name="workout-type"
            label="Type d'entraînement"
            options={workoutTypes}
            value={formData.type}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            error={errors.type}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Durée"
              error={errors.duration}
              required
              hint="Durée estimée en minutes"
            >
              <AccessibleSelect
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                variant={errors.duration ? 'error' : 'default'}
                placeholder="Sélectionner une durée"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </AccessibleSelect>
            </FormField>

            <AccessibleRadioGroup
              name="difficulty"
              label="Niveau de difficulté"
              options={difficultyLevels}
              value={formData.difficulty}
              onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              error={errors.difficulty}
              required
            />
          </div>

          <FormField
            label="Description"
            hint="Décrivez les objectifs et le contenu de cet entraînement"
          >
            <AccessibleTextarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre entraînement..."
              rows={4}
              maxLength={500}
            />
          </FormField>

          <AccessibleCheckbox
            label="Rendre cet entraînement public"
            description="Permettre à d'autres utilisateurs de voir et utiliser cet entraînement"
            checked={formData.isPublic}
            onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
          />

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <AccessibleButton
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  name: '',
                  type: '',
                  duration: '',
                  difficulty: '',
                  description: '',
                  isPublic: false,
                  equipment: []
                });
                setErrors({});
                announce('Formulaire réinitialisé', 'polite');
              }}
            >
              Réinitialiser
            </AccessibleButton>

            <AccessibleButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText="Enregistrement..."
            >
              {isSubmitting ? 'Enregistrement...' : 'Créer l\'entraînement'}
            </AccessibleButton>
          </div>
        </form>

        {/* Zone d'annonces pour les lecteurs d'écran */}
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          id="form-announcements"
        />
      </div>
    </AccessibleLayout>
  );
};

export default AccessibleWorkoutForm;