import { syncUserData } from '../../core/api/syncUserData';

describe('API Integration', () => {
  it('synchronise les données utilisateur sur tous les modules', async () => {
    // Simule la synchronisation Nutrition + Workout + Sleep
    const userId = 'user-123';
    const result = await syncUserData(userId);
    expect(result.nutrition).toBeDefined();
    expect(result.workout).toBeDefined();
    expect(result.sleep).toBeDefined();
    // Vérifie la cohérence des données synchronisées
    expect(result.nutrition.userId).toBe(userId);
    expect(result.workout.userId).toBe(userId);
    expect(result.sleep.userId).toBe(userId);
  });

  it('gère les erreurs d’intégration', async () => {
    // Simule une erreur de synchronisation
    await expect(syncUserData(undefined as any)).rejects.toThrow();
  });
});
