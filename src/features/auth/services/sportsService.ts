import { 
  AVAILABLE_SPORTS,
  getSportsByCategory,
  getPopularSports,
  searchSports,
  getSportById,
  getPositionsForSport,
  type SportOption 
} from '@/core/config/sports.config';

export interface UserProfile {
  age?: number;
  sport?: string;
  position?: string;
  experience?: string;
  objectives?: string[];
  healthConditions?: string[];
  availability?: string;
  equipment?: string;
}

export interface SportRecommendation {
  sport: SportOption;
  score: number;
  reasons: string[];
  matchingCriteria: string[];
}

export interface PositionAnalysis {
  position: string;
  strengths: string[];
  weaknesses: string[];
  recommendedTraining: string[];
  physicalDemands: string[];
}

/**
 * Service pour la gestion des sports et positions
 */
export class SportsService {
  /**
   * Récupère les sports par catégorie
   */
  static async getSportsByCategory(category: string): Promise<SportOption[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulation async
      return getSportsByCategory(category);
    } catch (error) {
      console.error('Erreur lors de la récupération des sports par catégorie:', error);
      return [];
    }
  }

  /**
   * Récupère les positions disponibles pour un sport
   */
  static async getPositionsBySport(sport: string): Promise<string[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulation async
      return getPositionsForSport(sport);
    } catch (error) {
      console.error('Erreur lors de la récupération des positions:', error);
      return [];
    }
  }

  /**
   * Recherche des sports par nom ou catégorie
   */
  static async searchSports(query: string): Promise<SportOption[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150)); // Simulation async
      if (!query.trim()) {
        return AVAILABLE_SPORTS;
      }
      return searchSports(query);
    } catch (error) {
      console.error('Erreur lors de la recherche de sports:', error);
      return [];
    }
  }

  /**
   * Recommande des sports selon le profil utilisateur
   */
  static async getRecommendedSports(profile: UserProfile): Promise<SportRecommendation[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulation async
      
      const recommendations: SportRecommendation[] = [];

      for (const sport of AVAILABLE_SPORTS) {
        let score = 0;
        const reasons: string[] = [];
        const matchingCriteria: string[] = [];

        // Score basé sur l'âge
        if (profile.age) {
          if (profile.age >= 50 && ['walking', 'swimming', 'tai-chi', 'golf'].includes(sport.id)) {
            score += 20;
            reasons.push('Adapté à votre tranche d\'âge');
            matchingCriteria.push('age-appropriate');
          } else if (profile.age < 30 && ['football', 'basketball', 'rugby'].includes(sport.id)) {
            score += 15;
            reasons.push('Sport dynamique pour jeunes adultes');
            matchingCriteria.push('youth-oriented');
          }
        }

        // Score basé sur les objectifs
        if (profile.objectives && profile.objectives.length > 0) {
          if (profile.objectives.includes('lose-weight') && 
              ['running', 'cycling', 'swimming'].includes(sport.id)) {
            score += 25;
            reasons.push('Excellent pour la perte de poids');
            matchingCriteria.push('weight-loss');
          }
          
          if (profile.objectives.includes('gain-muscle') && 
              ['weightlifting', 'crossfit', 'rugby'].includes(sport.id)) {
            score += 25;
            reasons.push('Idéal pour le développement musculaire');
            matchingCriteria.push('muscle-building');
          }
          
          if (profile.objectives.includes('improve-endurance') && 
              ['running', 'cycling', 'swimming', 'football'].includes(sport.id)) {
            score += 20;
            reasons.push('Améliore l\'endurance cardiovasculaire');
            matchingCriteria.push('endurance');
          }
          
          if (profile.objectives.includes('stress-relief') && 
              ['yoga', 'tai-chi', 'swimming'].includes(sport.id)) {
            score += 20;
            reasons.push('Excellent pour la gestion du stress');
            matchingCriteria.push('stress-relief');
          }
        }

        // Score basé sur l'expérience
        if (profile.experience) {
          if (profile.experience === 'beginner' && sport.category === 'endurance') {
            score += 15;
            reasons.push('Facile à débuter');
            matchingCriteria.push('beginner-friendly');
          } else if (profile.experience === 'advanced' && 
                     ['crossfit', 'boxing', 'rugby'].includes(sport.id)) {
            score += 15;
            reasons.push('Défis techniques avancés');
            matchingCriteria.push('advanced-challenges');
          }
        }

        // Score basé sur les conditions de santé
        if (profile.healthConditions) {
          if (profile.healthConditions.includes('back-pain') && 
              ['swimming', 'cycling'].includes(sport.id)) {
            score += 20;
            reasons.push('Faible impact sur le dos');
            matchingCriteria.push('back-friendly');
          }
          
          if (profile.healthConditions.includes('knee-issues') && 
              ['swimming', 'cycling', 'upper-body'].includes(sport.id)) {
            score += 20;
            reasons.push('Préserve les genoux');
            matchingCriteria.push('knee-friendly');
          }
          
          if (profile.healthConditions.includes('hypertension') && 
              ['walking', 'swimming', 'yoga'].includes(sport.id)) {
            score += 15;
            reasons.push('Adapté à l\'hypertension');
            matchingCriteria.push('cardio-safe');
          }
        }

        // Score basé sur la disponibilité
        if (profile.availability) {
          if (profile.availability === '1-2-sessions' && 
              ['running', 'cycling', 'swimming'].includes(sport.id)) {
            score += 10;
            reasons.push('Flexible en temps');
            matchingCriteria.push('time-flexible');
          } else if (profile.availability === 'daily' && 
                     ['weightlifting', 'crossfit'].includes(sport.id)) {
            score += 15;
            reasons.push('Adapté à un entraînement quotidien');
            matchingCriteria.push('daily-suitable');
          }
        }

        // Score basé sur l'équipement
        if (profile.equipment) {
          if (profile.equipment === 'none' && 
              ['running', 'bodyweight', 'calisthenics'].includes(sport.id)) {
            score += 25;
            reasons.push('Aucun équipement requis');
            matchingCriteria.push('equipment-free');
          } else if (profile.equipment === 'home-gym' && 
                     ['weightlifting', 'crossfit'].includes(sport.id)) {
            score += 20;
            reasons.push('Parfait pour home gym');
            matchingCriteria.push('home-gym-suitable');
          }
        }

        // Bonus popularité
        score += (sport.popularity || 0) * 0.1;

        // Ne garder que les sports avec un score significatif
        if (score > 10) {
          recommendations.push({
            sport,
            score: Math.round(score),
            reasons,
            matchingCriteria
          });
        }
      }

      // Trier par score décroissant et limiter à 5 recommandations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    } catch (error) {
      console.error('Erreur lors du calcul des recommandations:', error);
      return [];
    }
  }

  /**
   * Analyse les caractéristiques d'une position
   */
  static async analyzePosition(sport: string, position: string): Promise<PositionAnalysis | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulation async

      const positionAnalyses: Record<string, Record<string, PositionAnalysis>> = {
        football: {
          'Gardien': {
            position: 'Gardien',
            strengths: ['Réflexes excellents', 'Leadership naturel', 'Vision du jeu'],
            weaknesses: ['Moins de course', 'Pression constante', 'Solitude du poste'],
            recommendedTraining: [
              'Exercices de réflexes',
              'Plongeons et parades',
              'Travail des appuis',
              'Relances précises',
              'Condition physique générale'
            ],
            physicalDemands: ['Détente verticale', 'Souplesse', 'Réactivité', 'Force des bras']
          },
          'Attaquant': {
            position: 'Attaquant',
            strengths: ['Finition clinique', 'Sens du but', 'Vitesse d\'exécution'],
            weaknesses: ['Pression de marquer', 'Dépendance aux autres', 'Périodes sans ballon'],
            recommendedTraining: [
              'Finition sous pression',
              'Travail dans la surface',
              'Courses d\'appel',
              'Jeu de tête',
              'Explosivité'
            ],
            physicalDemands: ['Vitesse', 'Détente', 'Force explosive', 'Agilité']
          },
          'Milieu central': {
            position: 'Milieu central',
            strengths: ['Vision panoramique', 'Polyvalence', 'Intelligence tactique'],
            weaknesses: ['Pression défensive', 'Beaucoup de courses', 'Décisions rapides'],
            recommendedTraining: [
              'Endurance aérobie',
              'Passes sous pression',
              'Transition défense-attaque',
              'Placement tactique',
              'Condition physique complète'
            ],
            physicalDemands: ['Endurance', 'Force générale', 'Coordination', 'Résistance']
          }
        },
        basketball: {
          'Meneur': {
            position: 'Meneur',
            strengths: ['Vision de jeu', 'Leadership', 'Créativité'],
            weaknesses: ['Pression de l\'organisation', 'Responsabilité du rythme', 'Défense difficile'],
            recommendedTraining: [
              'Dribbles variés',
              'Passes en mouvement',
              'Lecture de défense',
              'Condition physique',
              'Tir extérieur'
            ],
            physicalDemands: ['Agilité', 'Vitesse', 'Endurance', 'Coordination']
          },
          'Pivot': {
            position: 'Pivot',
            strengths: ['Domination physique', 'Rebonds', 'Présence défensive'],
            weaknesses: ['Mobilité limitée', 'Fautes faciles', 'Moins de touches'],
            recommendedTraining: [
              'Jeu dos au panier',
              'Rebonds offensifs/défensifs',
              'Déplacements défensifs',
              'Force fonctionnelle',
              'Coordination'
            ],
            physicalDemands: ['Force', 'Taille', 'Puissance', 'Résistance']
          }
        }
      };

      const sportAnalyses = positionAnalyses[sport];
      if (!sportAnalyses) return null;

      return sportAnalyses[position] || null;

    } catch (error) {
      console.error('Erreur lors de l\'analyse de position:', error);
      return null;
    }
  }

  /**
   * Obtient les statistiques d'un sport
   */
  static async getSportStatistics(sportId: string): Promise<{
    totalPlayers: number;
    averageAge: number;
    genderDistribution: { male: number; female: number };
    popularPositions: { position: string; percentage: number }[];
    difficultyLevel: number;
    injuryRate: number;
  } | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulation async

      const sport = getSportById(sportId);
      if (!sport) return null;

      // Données simulées mais réalistes
      const statistics = {
        football: {
          totalPlayers: 4500000,
          averageAge: 24,
          genderDistribution: { male: 78, female: 22 },
          popularPositions: [
            { position: 'Milieu central', percentage: 20 },
            { position: 'Défenseur central', percentage: 18 },
            { position: 'Attaquant', percentage: 15 },
            { position: 'Arrière latéral', percentage: 15 }
          ],
          difficultyLevel: 7,
          injuryRate: 15
        },
        basketball: {
          totalPlayers: 2100000,
          averageAge: 22,
          genderDistribution: { male: 65, female: 35 },
          popularPositions: [
            { position: 'Arrière', percentage: 25 },
            { position: 'Ailier', percentage: 22 },
            { position: 'Meneur', percentage: 20 },
            { position: 'Pivot', percentage: 18 }
          ],
          difficultyLevel: 8,
          injuryRate: 12
        },
        running: {
          totalPlayers: 8200000,
          averageAge: 35,
          genderDistribution: { male: 52, female: 48 },
          popularPositions: [
            { position: 'Fond', percentage: 40 },
            { position: 'Demi-fond', percentage: 35 },
            { position: 'Sprint', percentage: 15 },
            { position: 'Trail', percentage: 10 }
          ],
          difficultyLevel: 4,
          injuryRate: 8
        }
      };

      return statistics[sportId as keyof typeof statistics] || {
        totalPlayers: 1000000,
        averageAge: 28,
        genderDistribution: { male: 60, female: 40 },
        popularPositions: [],
        difficultyLevel: 6,
        injuryRate: 10
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }

  /**
   * Obtient les sports similaires
   */
  static async getSimilarSports(sportId: string): Promise<SportOption[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulation async

      const sport = getSportById(sportId);
      if (!sport) return [];

      // Retourner les sports de la même catégorie
      const similarSports = getSportsByCategory(sport.category)
        .filter(s => s.id !== sportId)
        .slice(0, 4);

      return similarSports;

    } catch (error) {
      console.error('Erreur lors de la récupération des sports similaires:', error);
      return [];
    }
  }

  /**
   * Valide si un sport est adapté à un profil
   */
  static async validateSportForProfile(sportId: string, profile: UserProfile): Promise<{
    isRecommended: boolean;
    warnings: string[];
    adaptations: string[];
    benefits: string[];
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150)); // Simulation async

      const sport = getSportById(sportId);
      if (!sport) {
        return {
          isRecommended: false,
          warnings: ['Sport non trouvé'],
          adaptations: [],
          benefits: []
        };
      }

      let isRecommended = true;
      const warnings: string[] = [];
      const adaptations: string[] = [];
      const benefits: string[] = [];

      // Vérifications basées sur l'âge
      if (profile.age) {
        if (profile.age >= 60 && ['rugby', 'boxing'].includes(sportId)) {
          warnings.push('Sport à fort contact physique');
          adaptations.push('Privilégier les entraînements techniques');
          isRecommended = false;
        } else if (profile.age >= 50 && ['running', 'cycling'].includes(sportId)) {
          adaptations.push('Commencer progressivement');
          adaptations.push('Surveillance de la fréquence cardiaque recommandée');
        }
      }

      // Vérifications basées sur les conditions de santé
      if (profile.healthConditions) {
        if (profile.healthConditions.includes('back-pain') && 
            ['weightlifting', 'rugby'].includes(sportId)) {
          warnings.push('Risque d\'aggravation des douleurs dorsales');
          adaptations.push('Échauffement prolongé obligatoire');
          adaptations.push('Éviter les charges lourdes au début');
        }

        if (profile.healthConditions.includes('knee-issues') && 
            ['running', 'football'].includes(sportId)) {
          warnings.push('Impact élevé sur les genoux');
          adaptations.push('Privilégier les surfaces souples');
          adaptations.push('Renforcement musculaire préventif');
        }

        if (profile.healthConditions.includes('hypertension') && 
            ['weightlifting', 'boxing'].includes(sportId)) {
          warnings.push('Surveillance de la tension artérielle requise');
          adaptations.push('Éviter les efforts maximaux');
          adaptations.push('Privilégier l\'endurance modérée');
        }
      }

      // Bénéfices généraux
      benefits.push('Amélioration de la condition physique générale');
      benefits.push('Développement de la coordination');
      
      if (sport.category === 'endurance') {
        benefits.push('Renforcement du système cardiovasculaire');
        benefits.push('Amélioration de l\'endurance');
      }
      
      if (sport.category === 'force') {
        benefits.push('Développement de la force musculaire');
        benefits.push('Amélioration de la densité osseuse');
      }

      if (['football', 'basketball'].includes(sportId)) {
        benefits.push('Développement de l\'esprit d\'équipe');
        benefits.push('Amélioration des réflexes');
      }

      return {
        isRecommended,
        warnings,
        adaptations,
        benefits
      };

    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      return {
        isRecommended: false,
        warnings: ['Erreur lors de l\'analyse'],
        adaptations: [],
        benefits: []
      };
    }
  }
}

/**
 * Hook React pour utiliser le service des sports
 */
export function useSports() {
  return {
    getSportsByCategory: SportsService.getSportsByCategory,
    getPositionsBySport: SportsService.getPositionsBySport,
    searchSports: SportsService.searchSports,
    getRecommendedSports: SportsService.getRecommendedSports,
    analyzePosition: SportsService.analyzePosition,
    getSportStatistics: SportsService.getSportStatistics,
    getSimilarSports: SportsService.getSimilarSports,
    validateSportForProfile: SportsService.validateSportForProfile
  };
}

export type { SportOption };
export default SportsService;