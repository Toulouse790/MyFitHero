/**
 * TEARDOWN GLOBAL JEST
 * Nettoyage après tous les tests
 */

module.exports = async () => {
  console.log('🧹 Nettoyage post-tests terminé');
  
  // Force la fermeture des handles ouverts
  if (global.gc) {
    global.gc();
  }
};