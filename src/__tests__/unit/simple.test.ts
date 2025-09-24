/**
 * TEST SIMPLE - VALIDATION CONFIGURATION JEST
 * Test basique pour vérifier que Jest fonctionne correctement
 */

describe('Configuration Jest Enterprise', () => {
  it('doit exécuter un test simple', () => {
    expect(1 + 1).toBe(2);
  });

  it('doit gérer les objets JavaScript', () => {
    const testObject = { name: 'MyFitHero', version: '1.0.0' };
    expect(testObject).toHaveProperty('name');
    expect(testObject.name).toBe('MyFitHero');
  });

  it('doit gérer les promesses', async () => {
    const promise = Promise.resolve('test');
    await expect(promise).resolves.toBe('test');
  });

  it('doit gérer les exceptions', () => {
    const errorFunction = () => {
      throw new Error('Test error');
    };
    expect(errorFunction).toThrow('Test error');
  });
});