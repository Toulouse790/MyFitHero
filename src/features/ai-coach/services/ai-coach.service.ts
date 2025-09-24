import { Activity, Bell } from 'lucide-react';
export interface CoachingSession {
  id: string;
  userId: string;
  topic: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'mental' | 'general';
  messages: CoachingMessage[];
  recommendations: Recommendation[];
  actionPlan: ActionItem[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'paused';
  metadata: {
    userLevel: string;
    sport?: string;
    goals: string[];
    sessionDuration: number;
  };
}

export interface CoachingMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
  type: 'text' | 'suggestion' | 'warning' | 'encouragement';
  attachments?: {
    type: 'exercise' | 'nutrition' | 'image' | 'video';
    data: unknown;
  }[];
}

export interface Recommendation {
  id: string;
  category: 'immediate' | 'short-term' | 'long-term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reasoning: string;
  expectedBenefit: string;
  timeframe: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  resources?: string[];
}

export interface ActionItem {
  id: string;
  task: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
  estimatedDuration: number; // en minutes
  dependencies?: string[];
}

export interface PersonalizedPlan {
  id: string;
  userId: string;
  type: 'workout' | 'nutrition' | 'recovery' | 'comprehensive';
  title: string;
  description: string;
  duration: string; // "4 weeks", "12 weeks", etc.
  phases: PlanPhase[];
  goals: PlanGoal[];
  progressMetrics: ProgressMetric[];
  adaptations: PlanAdaptation[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface PlanPhase {
  id: string;
  name: string;
  description: string;
  startWeek: number;
  endWeek: number;
  focus: string[];
  sessions: PlanSession[];
  milestones: Milestone[];
}

export interface PlanSession {
  id: string;
  name: string;
  type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high' | 'very-high';
  description: string;
  exercises?: Exercise[];
  nutritionGuidelines?: NutritionGuideline[];
  recoveryProtocol?: RecoveryProtocol;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  sets?: number;
  reps?: number | string;
  duration?: number;
  rest?: number;
  intensity?: string;
  instructions: string[];
  progressions: string[];
  regressions: string[];
  safetyNotes: string[];
}

export interface PlanGoal {
  id: string;
  description: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  timeframe: string;
  priority: 'primary' | 'secondary';
}

export interface ProgressMetric {
  id: string;
  name: string;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target?: number;
  benchmarks: { value: number; label: string }[];
}

export interface ProgressAnalysis {
  id: string;
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  overallScore: number; // 0-100
  categoryScores: {
    category: string;
    score: number;
    trend: 'improving' | 'stable' | 'declining';
    insights: string[];
  }[];
  achievements: Achievement[];
  challenges: Challenge[];
  recommendations: Recommendation[];
  nextSteps: ActionItem[];
  motivationalMessage: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  earnedAt: Date;
  impact: 'small' | 'medium' | 'large';
  celebrationLevel: 'badge' | 'milestone' | 'breakthrough';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'minor' | 'moderate' | 'significant';
  solutions: string[];
  preventionTips: string[];
}

export class AICoachService {
  private static readonly API_BASE = '/api/ai-coach';
  private static sessions: Map<string, CoachingSession> = new Map();

  /**
   * Récupère une session de coaching personnalisée
   */
  static async getCoachingSession(userId: string, topic: string): Promise<CoachingSession> {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      const sessionId = `session-${userId}-${topic}-${Date.now()}`;
      
      // Analyser le profil utilisateur (simulation)
      const userProfile = await this.getUserProfile(userId);
      
      // Créer une session personnalisée
      const session: CoachingSession = {
        id: sessionId,
        userId,
        topic,
        type: this.determineSessionType(topic),
        messages: [
          {
            id: `msg-${Date.now()}`,
            role: 'coach',
            content: this.generateWelcomeMessage(topic, userProfile),
            timestamp: new Date(),
            type: 'text'
          }
        ],
        recommendations: await this.generateRecommendations(topic, userProfile),
        actionPlan: await this.generateActionPlan(topic, userProfile),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        metadata: {
          userLevel: userProfile.level || 'beginner',
          sport: userProfile.sport,
          goals: userProfile.goals || [],
          sessionDuration: 0
        }
      };

      this.sessions.set(sessionId, session);
      return session;

    } catch (error: any) {
      console.error('Erreur lors de la création de la session de coaching:', error);
      throw new Error('Impossible de créer la session de coaching');
    }
  }

  /**
   * Soumet une question et obtient une réponse personnalisée
   */
  static async submitQuestion(question: string, context: {
    userId: string;
    sessionId?: string;
    userProfile?: unknown;
    currentActivity?: string;
  }): Promise<{
    answer: string;
    suggestions: string[];
    followUpQuestions: string[];
    relatedTopics: string[];
    actionItems?: ActionItem[];
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const userProfile = context.userProfile || await this.getUserProfile(context.userId);
      
      // Analyser la question
      const questionAnalysis = this.analyzeQuestion(question);
      
      // Générer une réponse personnalisée
      const response = await this.generatePersonalizedResponse(
        question, 
        questionAnalysis, 
        userProfile,
        context
      );

      // Mettre à jour la session si elle existe
      if (context.sessionId && this.sessions.has(context.sessionId)) {
        const session = this.sessions.get(context.sessionId)!;
        session.messages.push(
          {
            id: `msg-user-${Date.now()}`,
            role: 'user',
            content: question,
            timestamp: new Date(),
            type: 'text'
          },
          {
            id: `msg-coach-${Date.now()}`,
            role: 'coach',
            content: response.answer,
            timestamp: new Date(),
            type: 'text'
          }
        );
        session.updatedAt = new Date();
      }

      return response;

    } catch (error: any) {
      console.error('Erreur lors du traitement de la question:', error);
      throw new Error('Impossible de traiter votre question');
    }
  }

  /**
   * Génère un plan personnalisé complet
   */
  static async getPersonalizedPlan(profile: {
    userId: string;
    sport?: string;
    goals: string[];
    level: string;
    availability: string;
    equipment: string[];
    healthConditions?: string[];
    preferences?: unknown;
  }): Promise<PersonalizedPlan> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const planId = `plan-${profile.userId}-${Date.now()}`;
      
      // Déterminer le type de plan optimal
      const planType = this.determinePlanType(profile);
      
      // Générer les phases du plan
      const phases = await this.generatePlanPhases(profile, planType);
      
      // Définir les objectifs mesurables
      const goals = this.generatePlanGoals(profile);
      
      // Créer les métriques de suivi
      const progressMetrics = this.generateProgressMetrics(profile, planType);

      const plan: PersonalizedPlan = {
        id: planId,
        userId: profile.userId,
        type: planType,
        title: this.generatePlanTitle(profile, planType),
        description: this.generatePlanDescription(profile, planType),
        duration: this.calculatePlanDuration(profile),
        phases,
        goals,
        progressMetrics,
        adaptations: await this.generatePlanAdaptations(profile),
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      return plan;

    } catch (error: any) {
      console.error('Erreur lors de la génération du plan:', error);
      throw new Error('Impossible de générer votre plan personnalisé');
    }
  }

  /**
   * Analyse les progrès et génère des insights
   */
  static async analyzeProgress(data: {
    userId: string;
    period: { start: Date; end: Date };
    metrics: { [key: string]: number[] };
    activities: unknown[];
    feedback?: string[];
  }): Promise<ProgressAnalysis> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const userProfile = await this.getUserProfile(data.userId);
      
      // Calculer le score global
      const overallScore = this.calculateOverallScore(data.metrics);
      
      // Analyser par catégorie
      const categoryScores = this.analyzeCategoryProgress(data.metrics, data.activities);
      
      // Identifier les réussites
      const achievements = this.identifyAchievements(data.metrics, data.activities, userProfile);
      
      // Identifier les défis
      const challenges = this.identifyChallenges(data.metrics, data.feedback);
      
      // Générer des recommandations
      const recommendations = await this.generateProgressRecommendations(
        categoryScores, 
        achievements, 
        challenges,
        userProfile
      );

      const analysis: ProgressAnalysis = {
        id: `analysis-${data.userId}-${Date.now()}`,
        userId: data.userId,
        period: data.period,
        overallScore,
        categoryScores,
        achievements,
        challenges,
        recommendations,
        nextSteps: await this.generateNextSteps(recommendations, userProfile),
        motivationalMessage: this.generateMotivationalMessage(overallScore, achievements, userProfile)
      };

      return analysis;

    } catch (error: any) {
      console.error('Erreur lors de l\'analyse des progrès:', error);
      throw new Error('Impossible d\'analyser vos progrès');
    }
  }

  // Méthodes utilitaires privées

  private static async getUserProfile(userId: string) {
    // Simulation de récupération du profil utilisateur
    return {
      id: userId,
      level: 'intermediate',
      sport: 'running',
      goals: ['improve-endurance', 'lose-weight'],
      availability: '3-4-sessions',
      equipment: ['minimal'],
      age: 28,
      experience: '2 years'
    };
  }

  private static determineSessionType(topic: string): CoachingSession['type'] {
    const topicMap: { [key: string]: CoachingSession['type'] } = {
      'entrainement': 'workout',
      'workout': 'workout',
      'musculation': 'workout',
      'nutrition': 'nutrition',
      'alimentation': 'nutrition',
      'recuperation': 'recovery',
      'repos': 'recovery',
      'mental': 'mental',
      'motivation': 'mental',
      'stress': 'mental'
    };

    return topicMap[topic.toLowerCase()] || 'general';
  }

  private static generateWelcomeMessage(topic: string, userProfile: unknown): string {
    const messages = {
      workout: "Salut ! 💪 Prêt(e) pour optimiser ton entraînement ? Je vais t'aider à créer une session parfaitement adaptée à tes objectifs.",
      nutrition: "Hello ! 🥗 Parlons nutrition ! Je suis là pour t'accompagner vers une alimentation qui booste tes performances.",
      recovery: "Coucou ! 😴 La récupération est aussi importante que l'entraînement. Voyons comment optimiser ton repos.",
      mental: "Salut ! 🧠 Le mental, c'est 50% de la performance. Je suis là pour renforcer ta motivation et ta confiance.",
      general: "Hello ! 🌟 Je suis ton coach IA personnel. Comment puis-je t'aider à atteindre tes objectifs aujourd'hui ?"
    };

    const sessionType = this.determineSessionType(topic);
    return messages[sessionType] || messages.general;
  }

  private static async generateRecommendations(topic: string, userProfile: unknown): Promise<Recommendation[]> {
    // Générer des recommandations basées sur le topic et le profil
    const baseRecommendations: Recommendation[] = [
      {
        id: `rec-${Date.now()}-1`,
        category: 'immediate',
        priority: 'high',
        title: 'Échauffement dynamique',
        description: 'Commence toujours par 10 minutes d\'échauffement progressif',
        reasoning: 'Prévient les blessures et optimise les performances',
        expectedBenefit: 'Réduction de 60% du risque de blessure',
        timeframe: 'À chaque séance',
        difficulty: 'easy',
        resources: ['Guide échauffement', 'Vidéos techniques']
      },
      {
        id: `rec-${Date.now()}-2`,
        category: 'short-term',
        priority: 'medium',
        title: 'Progression graduée',
        description: 'Augmente l\'intensité de 10% chaque semaine maximum',
        reasoning: 'Adaptation physiologique optimale sans surmenage',
        expectedBenefit: 'Progrès constants et durables',
        timeframe: '2-4 semaines',
        difficulty: 'moderate'
      }
    ];

    return baseRecommendations;
  }

  private static async generateActionPlan(topic: string, userProfile: unknown): Promise<ActionItem[]> {
    return [
      {
        id: `action-${Date.now()}-1`,
        task: 'Planifier 3 séances cette semaine',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        category: 'planning',
        estimatedDuration: 15
      },
      {
        id: `action-${Date.now()}-2`,
        task: 'Mesurer les progrès de la semaine',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        status: 'pending',
        category: 'tracking',
        estimatedDuration: 10
      }
    ];
  }

  private static analyzeQuestion(question: string): {
    intent: string;
    entities: string[];
    complexity: 'simple' | 'moderate' | 'complex';
    urgency: 'low' | 'medium' | 'high';
  } {
    // Analyse simple basée sur des mots-clés
    const workoutKeywords = ['entrainement', 'exercice', 'muscle', 'cardio', 'force'];
    const nutritionKeywords = ['nutrition', 'alimentation', 'repas', 'calories', 'proteines'];
    const recoveryKeywords = ['recuperation', 'repos', 'sommeil', 'fatigue', 'douleur'];
    
    let intent = 'general';
    if (workoutKeywords.some(kw => question.toLowerCase().includes(kw))) intent = 'workout';
    if (nutritionKeywords.some(kw => question.toLowerCase().includes(kw))) intent = 'nutrition';
    if (recoveryKeywords.some(kw => question.toLowerCase().includes(kw))) intent = 'recovery';

    return {
      intent,
      entities: [],
      complexity: question.length > 100 ? 'complex' : question.length > 50 ? 'moderate' : 'simple',
      urgency: question.includes('urgent') || question.includes('douleur') ? 'high' : 'medium'
    };
  }

  private static async generatePersonalizedResponse(
    question: string, 
    analysis: unknown, 
    userProfile: unknown,
    context: unknown
  ) {
    // Générer une réponse personnalisée intelligente
    const responses = {
      workout: {
        answer: "Excellente question sur l'entraînement ! Basé sur ton profil, voici ce que je recommande...",
        suggestions: [
          "Commence par un échauffement de 10 minutes",
          "Focus sur la technique avant l'intensité",
          "Intègre 48h de repos entre les séances intense"
        ],
        followUpQuestions: [
          "As-tu des douleurs actuellement ?",
          "Quel est ton objectif principal ?",
          "Combien de temps as-tu pour t'entraîner ?"
        ],
        relatedTopics: ["Nutrition post-entraînement", "Récupération active", "Planification hebdomadaire"]
      },
      default: {
        answer: "Merci pour ta question ! Je vais t'aider à y répondre de manière personnalisée...",
        suggestions: ["Voyons ensemble les meilleures options pour toi"],
        followUpQuestions: ["Peux-tu me donner plus de détails ?"],
        relatedTopics: ["Conseils généraux", "Ressources utiles"]
      }
    };

    return responses.default; // Simplification pour l'exemple
  }

  private static determinePlanType(profile: unknown): PersonalizedPlan['type'] {
    // Logique pour déterminer le type de plan optimal
    return 'comprehensive';
  }

  private static async generatePlanPhases(profile: unknown, planType: string): Promise<PlanPhase[]> {
    // Générer les phases du plan
    return [
      {
        id: `phase-1-${Date.now()}`,
        name: 'Phase d\'adaptation',
        description: 'Période d\'adaptation et d\'apprentissage des mouvements de base',
        startWeek: 1,
        endWeek: 4,
        focus: ['Technique', 'Adaptation', 'Habitudes'],
        sessions: [],
        milestones: []
      }
    ];
  }

  private static generatePlanGoals(profile: unknown): PlanGoal[] {
    return [
      {
        id: `goal-${Date.now()}`,
        description: 'Améliorer l\'endurance cardiovasculaire',
        metric: 'VO2 max estimé',
        currentValue: 35,
        targetValue: 42,
        timeframe: '12 semaines',
        priority: 'primary'
      }
    ];
  }

  private static generateProgressMetrics(profile: unknown, planType: string): ProgressMetric[] {
    return [
      {
        id: `metric-${Date.now()}`,
        name: 'Fréquence cardiaque au repos',
        unit: 'bpm',
        frequency: 'weekly',
        target: 60,
        benchmarks: [
          { value: 80, label: 'Débutant' },
          { value: 70, label: 'Intermédiaire' },
          { value: 60, label: 'Avancé' }
        ]
      }
    ];
  }

  private static async generatePlanAdaptations(profile: unknown): Promise<PlanAdaptation[]> {
    return [];
  }

  private static generatePlanTitle(profile: unknown, planType: string): string {
    return 'Plan Personnalisé MyFitHero';
  }

  private static generatePlanDescription(profile: unknown, planType: string): string {
    return 'Un programme complet adapté à vos objectifs et contraintes';
  }

  private static calculatePlanDuration(profile: unknown): string {
    return '12 semaines';
  }

  private static calculateOverallScore(metrics: { [key: string]: number[] }): number {
    // Calcul du score global basé sur les métriques
    return Math.floor(Math.random() * 40) + 60; // Score entre 60-100 pour l'exemple
  }

  private static analyzeCategoryProgress(metrics: unknown, activities: unknown) {
    return [
      {
        category: 'Endurance',
        score: 75,
        trend: 'improving' as const,
        insights: ['Progression constante sur les 3 dernières semaines']
      }
    ];
  }

  private static identifyAchievements(metrics: unknown, activities: unknown, userProfile: unknown): Achievement[] {
    return [
      {
        id: `achievement-${Date.now()}`,
        title: 'Régularité exemplaire',
        description: 'Tu as maintenu 3 séances par semaine pendant 4 semaines consécutives',
        category: 'consistency',
        earnedAt: new Date(),
        impact: 'medium',
        celebrationLevel: 'milestone'
      }
    ];
  }

  private static identifyChallenges(metrics: unknown, feedback: unknown): Challenge[] {
    return [
      {
        id: `challenge-${Date.now()}`,
        title: 'Plateau de performance',
        description: 'Tes temps de course stagnent depuis 2 semaines',
        category: 'performance',
        severity: 'moderate',
        solutions: ['Varier les intensités', 'Intégrer du fractionné', 'Vérifier la récupération'],
        preventionTips: ['Planification progressive', 'Écoute du corps']
      }
    ];
  }

  private static async generateProgressRecommendations(
    categoryScores: unknown, 
    achievements: unknown, 
    challenges: unknown,
    userProfile: unknown
  ): Promise<Recommendation[]> {
    return [
      {
        id: `rec-progress-${Date.now()}`,
        category: 'short-term',
        priority: 'high',
        title: 'Intensifier l\'entraînement',
        description: 'Ajouter une séance de fractionné par semaine',
        reasoning: 'Tes progrès montrent que tu es prêt(e) pour plus d\'intensité',
        expectedBenefit: 'Amélioration de 10-15% des performances',
        timeframe: '3-4 semaines',
        difficulty: 'moderate'
      }
    ];
  }

  private static async generateNextSteps(recommendations: Recommendation[], userProfile: unknown): Promise<ActionItem[]> {
    return [
      {
        id: `next-${Date.now()}`,
        task: 'Planifier une séance de fractionné cette semaine',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        category: 'workout',
        estimatedDuration: 45
      }
    ];
  }

  private static generateMotivationalMessage(overallScore: number, achievements: Achievement[], userProfile: unknown): string {
    if (overallScore >= 80) {
      return "🔥 Tu es en feu ! Tes efforts payent vraiment. Continue comme ça, tu es sur la bonne voie pour dépasser tous tes objectifs !";
    } else if (overallScore >= 60) {
      return "💪 Belle progression ! Tu as posé de solides bases. Quelques ajustements et tu vas exploser tes records !";
    } else {
      return "🌟 Chaque pas compte ! Tu as commencé le plus dur. Reste concentré(e) sur tes objectifs, les résultats arrivent !";
    }
  }
}

// Types additionnels
interface NutritionGuideline {
  meal: string;
  timing: string;
  macros: { protein: number; carbs: number; fats: number };
  suggestions: string[];
}

interface RecoveryProtocol {
  techniques: string[];
  duration: number;
  timing: string;
  equipment?: string[];
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  targetWeek: number;
  metric: string;
  targetValue: number;
}

interface PlanAdaptation {
  id: string;
  condition: string;
  modification: string;
  reasoning: string;
}
