// Données pour l'onboarding conversationnel
import { AVAILABLE_SPORTS } from '@/core/config/sports.config';

export { AVAILABLE_SPORTS };

export const MAIN_OBJECTIVES = [
  { id: 'performance', label: 'Performance sportive', description: 'Améliorer mes performances dans mon sport' },
  { id: 'health_wellness', label: 'Santé et bien-être', description: 'Maintenir une bonne santé générale' },
  { id: 'body_composition', label: 'Composition corporelle', description: 'Modifier ma composition corporelle' },
  { id: 'energy_sleep', label: 'Énergie et sommeil', description: 'Améliorer mon énergie et mon sommeil' },
];

export const AVAILABLE_MODULES = [
  { id: 'sport', name: 'Sport', description: 'Suivi sportif et performances' },
  { id: 'nutrition', name: 'Nutrition', description: 'Alimentation et macronutriments' },
  { id: 'sleep', name: 'Sommeil', description: 'Qualité et récupération' },
  { id: 'hydration', name: 'Hydratation', description: 'Suivi hydrique quotidien' },
];

export const LIFESTYLE_OPTIONS = [
  { id: 'student', label: 'Étudiant(e)', description: 'Horaires flexibles, vie étudiante' },
  { id: 'office_worker', label: 'Bureau', description: 'Travail de bureau, sédentaire' },
  { id: 'physical_job', label: 'Travail physique', description: 'Métier demandant de l\'effort physique' },
  { id: 'retired', label: 'Retraité(e)', description: 'Plus de contraintes professionnelles' },
];

export const DIETARY_PREFERENCES = [
  { id: 'omnivore', label: 'Omnivore', description: 'Pas de restriction alimentaire' },
  { id: 'vegetarian', label: 'Végétarien', description: 'Pas de viande ni poisson' },
  { id: 'vegan', label: 'Végétalien', description: 'Aucun produit animal' },
  { id: 'pescatarian', label: 'Pescétarien', description: 'Poisson mais pas de viande' },
];

export const STRENGTH_OBJECTIVES = [
  { id: 'muscle_gain', label: 'Gain musculaire', description: 'Augmenter ma masse musculaire' },
  { id: 'strength', label: 'Force pure', description: 'Améliorer ma force maximale' },
  { id: 'endurance', label: 'Endurance musculaire', description: 'Tenir plus longtemps' },
  { id: 'toning', label: 'Tonification', description: 'Raffermir sans volume' },
];

export const NUTRITION_OBJECTIVES = [
  { id: 'weight_loss', label: 'Perte de poids', description: 'Réduire ma masse corporelle' },
  { id: 'muscle_gain', label: 'Prise de masse', description: 'Gagner du muscle' },
  { id: 'maintenance', label: 'Maintien', description: 'Garder mon poids actuel' },
  { id: 'performance', label: 'Performance', description: 'Optimiser pour le sport' },
];

export const FITNESS_EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Débutant', description: 'Moins de 6 mois d\'expérience' },
  { id: 'intermediate', label: 'Intermédiaire', description: '6 mois à 2 ans d\'expérience' },
  { id: 'advanced', label: 'Avancé', description: 'Plus de 2 ans d\'expérience' },
  { id: 'expert', label: 'Expert', description: 'Entraîneur ou athlète professionnel' },
];

export const EQUIPMENT_LEVELS = [
  { id: 'none', label: 'Aucun équipement', description: 'Exercices au poids du corps uniquement' },
  { id: 'basic', label: 'Équipement de base', description: 'Haltères, tapis, bandes élastiques' },
  { id: 'home_gym', label: 'Salle à domicile', description: 'Rack, barres, banc, machines' },
  { id: 'full_gym', label: 'Salle de sport', description: 'Accès complet à une salle équipée' },
];

export const SPORT_LEVELS = [
  { id: 'recreational', label: 'Loisir', description: 'Pour le plaisir et la forme' },
  { id: 'amateur_competitive', label: 'Compétition amateur', description: 'Compétitions locales/régionales' },
  { id: 'semi_professional', label: 'Semi-professionnel', description: 'Niveau élevé, entraînement régulier' },
  { id: 'professional', label: 'Professionnel', description: 'Athlète de haut niveau' },
];

export const SEASON_PERIODS = [
  { id: 'off_season', label: 'Hors saison', description: 'Pas de compétition prévue' },
  { id: 'pre_season', label: 'Pré-saison', description: 'Préparation pour la saison' },
  { id: 'in_season', label: 'En saison', description: 'Période de compétition' },
  { id: 'recovery', label: 'Récupération', description: 'Phase de repos actif' },
];

export const TRAINING_AVAILABILITY = [
  { id: '15-30min', label: '15-30 minutes', description: 'Sessions courtes mais efficaces' },
  { id: '30-60min', label: '30-60 minutes', description: 'Durée standard recommandée' },
  { id: '60-90min', label: '1-1h30', description: 'Sessions plus longues et complètes' },
  { id: '90min+', label: 'Plus de 1h30', description: 'Sessions étendues pour objectifs spécifiques' },
];

export const HEALTH_CONDITIONS = [
  { id: 'none', label: 'Aucune condition particulière', description: 'En bonne santé générale' },
  { id: 'back_pain', label: 'Douleurs dorsales', description: 'Problèmes de dos chroniques ou récents' },
  { id: 'joint_issues', label: 'Problèmes articulaires', description: 'Douleurs aux genoux, épaules, etc.' },
  { id: 'cardiovascular', label: 'Condition cardiovasculaire', description: 'Hypertension, problèmes cardiaques' },
  { id: 'diabetes', label: 'Diabète', description: 'Type 1 ou Type 2' },
  { id: 'other', label: 'Autre condition', description: 'Condition médicale spécifique à préciser' },
];