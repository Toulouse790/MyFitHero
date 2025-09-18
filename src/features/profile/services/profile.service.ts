// Service pour le module profile

export class ProfileService {
  private static readonly BASE_URL = '/api/profile';

  // Méthodes de base
  static async getProfile(userId: string): Promise<any> {
    return this.getProfileData(userId);
  }

  static async getProfileData(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      return await response.json();
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur API profile:', error);
      return this.getMockProfileData();
    }
  }

  static async getProfileStats(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/stats`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des stats');
      return await response.json();
    } catch (error) {
      console.error('Erreur API stats:', error);
      return this.getMockStatsData();
    }
  }

  static async getAchievements(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/achievements`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des achievements');
      return await response.json();
    } catch (error) {
      console.error('Erreur API achievements:', error);
      return this.getMockAchievements();
    }
  }

  static async getGoals(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/goals`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des goals');
      return await response.json();
    } catch (error) {
      console.error('Erreur API goals:', error);
      return this.getMockGoals();
    }
  }

  static async createGoal(userId: string, goal: any): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!response.ok) throw new Error('Erreur lors de la création du goal');
      return await response.json();
    } catch (error) {
      console.error('Erreur création goal:', error);
      throw error;
    }
  }

  static async updateGoal(goalId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du goal');
      return await response.json();
    } catch (error) {
      console.error('Erreur mise à jour goal:', error);
      throw error;
    }
  }

  static async deleteGoal(goalId: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du goal');
    } catch (error) {
      console.error('Erreur suppression goal:', error);
      throw error;
    }
  }

  static async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${this.BASE_URL}/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'upload de l\'avatar');
      const result = await response.json();
      return result.avatarUrl;
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      throw error;
    }
  }

  static async updateProfile(userId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      return await response.json();
    } catch (error) {
      // Erreur silencieuse
      console.error('Erreur mise à jour profile:', error);
      throw error;
    }
  }

  // Données de mock
  private static getMockProfileData(): any {
    return {
      id: 'mock_profile_' + Date.now(),
      userId: 'user_123',
      data: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private static getMockStatsData(): any {
    return {
      workoutsThisWeek: 3,
      caloriesBurned: 1250,
      averageWorkoutDuration: 45,
      weeklyProgress: 75,
    };
  }

  private static getMockAchievements(): any[] {
    return [
      {
        id: '1',
        title: 'First Workout',
        description: 'Complete your first workout',
        icon: 'trophy',
        progress: 1,
        total: 1,
        completed: true,
        date_earned: new Date().toISOString(),
      },
    ];
  }

  private static getMockGoals(): any[] {
    return [
      {
        id: '1',
        title: 'Weekly Workouts',
        description: 'Complete 5 workouts this week',
        target_value: 5,
        current_value: 3,
        unit: 'workouts',
        created_at: new Date().toISOString(),
      },
    ];
  }
}
