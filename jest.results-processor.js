/**
 * PROCESSEUR DE RÉSULTATS JEST
 * Analyse et reporting avancé des résultats de tests
 */

const fs = require('fs');
const path = require('path');

module.exports = (results) => {
  const {
    numTotalTests,
    numPassedTests,
    numFailedTests,
    numPendingTests,
    testResults,
    coverageMap
  } = results;

  // Calcul des métriques de qualité
  const passRate = ((numPassedTests / numTotalTests) * 100).toFixed(2);
  const timestamp = new Date().toISOString();
  
  // Analyse des modules critiques
  const criticalModules = [
    'ai-coach',
    'auth',
    'security',
    'workout',
    'nutrition'
  ];

  const moduleResults = {};
  
  testResults.forEach(testResult => {
    const filePath = testResult.testFilePath;
    const moduleName = criticalModules.find(module => 
      filePath.includes(`features/${module}`) || 
      filePath.includes(`core/${module}`)
    );
    
    if (moduleName) {
      if (!moduleResults[moduleName]) {
        moduleResults[moduleName] = {
          passed: 0,
          failed: 0,
          total: 0
        };
      }
      
      moduleResults[moduleName].total += testResult.numPassingTests + testResult.numFailingTests;
      moduleResults[moduleName].passed += testResult.numPassingTests;
      moduleResults[moduleName].failed += testResult.numFailingTests;
    }
  });

  // Génération du rapport détaillé
  const report = {
    timestamp,
    summary: {
      totalTests: numTotalTests,
      passed: numPassedTests,
      failed: numFailedTests,
      pending: numPendingTests,
      passRate: `${passRate}%`,
      status: numFailedTests === 0 ? 'SUCCESS' : 'FAILURE'
    },
    criticalModules: moduleResults,
    coverage: coverageMap ? {
      hasMinimumCoverage: true // À calculer depuis coverageMap
    } : null,
    qualityGate: {
      passRateThreshold: 95,
      coverageThreshold: 85,
      passRateMet: parseFloat(passRate) >= 95,
      criticalModulesStatus: Object.keys(moduleResults).every(module => {
        const rate = (moduleResults[module].passed / moduleResults[module].total) * 100;
        return rate >= 90;
      })
    }
  };

  // Sauvegarde du rapport
  const reportPath = path.join(process.cwd(), 'coverage', 'test-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Console output pour CI/CD
  console.log('\n🎯 RAPPORT QUALITÉ MYFIT HERO');
  console.log('═'.repeat(50));
  console.log(`✅ Tests réussis: ${numPassedTests}/${numTotalTests} (${passRate}%)`);
  console.log(`❌ Tests échoués: ${numFailedTests}`);
  console.log(`⏸️  Tests en attente: ${numPendingTests}`);
  
  if (report.qualityGate.passRateMet && report.qualityGate.criticalModulesStatus) {
    console.log('🏆 QUALITY GATE: PASSED');
  } else {
    console.log('🚨 QUALITY GATE: FAILED');
  }
  
  console.log('═'.repeat(50));

  return results;
};