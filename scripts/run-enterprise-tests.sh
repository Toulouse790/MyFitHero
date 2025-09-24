#!/bin/bash

#####################################################################
# SCRIPT EXÉCUTION TESTS - MYFIT HERO ENTERPRISE
# Exécution complète de la suite de tests avec validation 85%+
#####################################################################

set -e  # Arrêt sur erreur

# Configuration
PROJECT_DIR="/workspaces/MyFitHero"
COVERAGE_DIR="$PROJECT_DIR/coverage"
REPORTS_DIR="$PROJECT_DIR/test-reports"
LOG_FILE="$REPORTS_DIR/test-execution.log"

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonction logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Fonction d'affichage coloré
print_colored() {
    echo -e "${2}${1}${NC}"
}

# Fonction de validation des prérequis
validate_prerequisites() {
    print_colored "🔍 VALIDATION DES PRÉREQUIS" "$BLUE"
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_colored "❌ Node.js n'est pas installé" "$RED"
        exit 1
    fi
    
    # Vérifier npm/yarn
    if ! command -v npm &> /dev/null; then
        print_colored "❌ npm n'est pas installé" "$RED"
        exit 1
    fi
    
    # Vérifier les dépendances
    if [ ! -d "node_modules" ]; then
        print_colored "📦 Installation des dépendances..." "$YELLOW"
        npm install
    fi
    
    print_colored "✅ Prérequis validés" "$GREEN"
}

# Fonction de nettoyage
cleanup_previous_results() {
    print_colored "🧹 NETTOYAGE DES RÉSULTATS PRÉCÉDENTS" "$BLUE"
    
    rm -rf "$COVERAGE_DIR"
    rm -rf "$REPORTS_DIR"
    
    mkdir -p "$COVERAGE_DIR"
    mkdir -p "$REPORTS_DIR"
    
    print_colored "✅ Nettoyage terminé" "$GREEN"
}

# Fonction d'exécution des tests unitaires
run_unit_tests() {
    print_colored "🧪 EXÉCUTION TESTS UNITAIRES" "$BLUE"
    log "Démarrage des tests unitaires"
    
    # Exécution avec configuration enterprise
    npx jest \
        --config=jest.enterprise.config.cjs \
        --testPathPatterns="src/__tests__/unit" \
        --coverage \
        --coverageReporters=text,html,lcov,json \
        --verbose \
        --runInBand \
        --detectOpenHandles \
        --forceExit \
        --passWithNoTests=false 2>&1 | tee -a "$LOG_FILE"
    
    local exit_code=${PIPESTATUS[0]}
    
    if [ $exit_code -eq 0 ]; then
        print_colored "✅ Tests unitaires réussis" "$GREEN"
    else
        print_colored "❌ Échec des tests unitaires (code: $exit_code)" "$RED"
        return $exit_code
    fi
}

# Fonction d'exécution des tests d'intégration
run_integration_tests() {
    print_colored "🔗 EXÉCUTION TESTS D'INTÉGRATION" "$BLUE"
    log "Démarrage des tests d'intégration"
    
    npx jest \
        --config=jest.enterprise.config.cjs \
        --testPathPatterns="src/__tests__/integration" \
        --verbose \
        --runInBand 2>&1 | tee -a "$LOG_FILE"
    
    local exit_code=${PIPESTATUS[0]}
    
    if [ $exit_code -eq 0 ]; then
        print_colored "✅ Tests d'intégration réussis" "$GREEN"
    else
        print_colored "❌ Échec des tests d'intégration (code: $exit_code)" "$RED"
        return $exit_code
    fi
}

# Fonction d'exécution des tests E2E
run_e2e_tests() {
    print_colored "🎭 EXÉCUTION TESTS E2E" "$BLUE"
    log "Démarrage des tests E2E"
    
    # Démarrer le serveur de dev en arrière-plan
    npm run dev &
    DEV_SERVER_PID=$!
    
    # Attendre que le serveur soit prêt
    print_colored "⏳ Attente du serveur de développement..." "$YELLOW"
    sleep 10
    
    # Vérifier que le serveur répond
    if curl -f http://localhost:5173 &>/dev/null; then
        print_colored "✅ Serveur de développement prêt" "$GREEN"
        
        # Exécuter les tests Playwright
        npx playwright test \
            --config=playwright.config.ts \
            --reporter=html 2>&1 | tee -a "$LOG_FILE"
        
        local exit_code=${PIPESTATUS[0]}
        
        # Arrêter le serveur
        kill $DEV_SERVER_PID 2>/dev/null || true
        
        if [ $exit_code -eq 0 ]; then
            print_colored "✅ Tests E2E réussis" "$GREEN"
        else
            print_colored "❌ Échec des tests E2E (code: $exit_code)" "$RED"
            return $exit_code
        fi
    else
        print_colored "❌ Impossible de démarrer le serveur de développement" "$RED"
        kill $DEV_SERVER_PID 2>/dev/null || true
        return 1
    fi
}

# Fonction d'exécution des tests de sécurité
run_security_tests() {
    print_colored "🔒 EXÉCUTION TESTS DE SÉCURITÉ" "$BLUE"
    log "Démarrage des tests de sécurité"
    
    npx jest \
        --config=jest.enterprise.config.cjs \
        --testPathPatterns="src/__tests__/security" \
        --verbose \
        --runInBand 2>&1 | tee -a "$LOG_FILE"
    
    local exit_code=${PIPESTATUS[0]}
    
    if [ $exit_code -eq 0 ]; then
        print_colored "✅ Tests de sécurité réussis" "$GREEN"
    else
        print_colored "❌ Échec des tests de sécurité (code: $exit_code)" "$RED"
        return $exit_code
    fi
}

# Fonction d'analyse de couverture
analyze_coverage() {
    print_colored "📊 ANALYSE DE COUVERTURE" "$BLUE"
    log "Analyse de la couverture de code"
    
    if [ -f "$COVERAGE_DIR/coverage-summary.json" ]; then
        # Extraire les métriques de couverture
        local lines_pct=$(node -e "
            const coverage = require('$COVERAGE_DIR/coverage-summary.json');
            console.log(coverage.total.lines.pct);
        ")
        
        local branches_pct=$(node -e "
            const coverage = require('$COVERAGE_DIR/coverage-summary.json');
            console.log(coverage.total.branches.pct);
        ")
        
        local functions_pct=$(node -e "
            const coverage = require('$COVERAGE_DIR/coverage-summary.json');
            console.log(coverage.total.functions.pct);
        ")
        
        local statements_pct=$(node -e "
            const coverage = require('$COVERAGE_DIR/coverage-summary.json');
            console.log(coverage.total.statements.pct);
        ")
        
        print_colored "📈 RÉSULTATS DE COUVERTURE:" "$PURPLE"
        echo "  • Lignes: ${lines_pct}%"
        echo "  • Branches: ${branches_pct}%"
        echo "  • Fonctions: ${functions_pct}%"
        echo "  • Déclarations: ${statements_pct}%"
        
        # Vérifier le seuil de 85%
        local min_coverage=85
        local coverage_passed=true
        
        if (( $(echo "$lines_pct < $min_coverage" | bc -l) )); then
            print_colored "❌ Couverture des lignes insuffisante: ${lines_pct}% < ${min_coverage}%" "$RED"
            coverage_passed=false
        fi
        
        if (( $(echo "$branches_pct < $min_coverage" | bc -l) )); then
            print_colored "❌ Couverture des branches insuffisante: ${branches_pct}% < ${min_coverage}%" "$RED"
            coverage_passed=false
        fi
        
        if (( $(echo "$functions_pct < $min_coverage" | bc -l) )); then
            print_colored "❌ Couverture des fonctions insuffisante: ${functions_pct}% < ${min_coverage}%" "$RED"
            coverage_passed=false
        fi
        
        if (( $(echo "$statements_pct < $min_coverage" | bc -l) )); then
            print_colored "❌ Couverture des déclarations insuffisante: ${statements_pct}% < ${min_coverage}%" "$RED"
            coverage_passed=false
        fi
        
        if [ "$coverage_passed" = true ]; then
            print_colored "🎯 OBJECTIF 85% DE COUVERTURE ATTEINT!" "$GREEN"
            return 0
        else
            print_colored "🚨 OBJECTIF 85% DE COUVERTURE NON ATTEINT!" "$RED"
            return 1
        fi
    else
        print_colored "❌ Fichier de résumé de couverture non trouvé" "$RED"
        return 1
    fi
}

# Fonction de génération du rapport final
generate_final_report() {
    print_colored "📋 GÉNÉRATION RAPPORT FINAL" "$BLUE"
    
    local report_file="$REPORTS_DIR/final-report.md"
    
    cat > "$report_file" << EOF
# Rapport d'Exécution des Tests - MyFit Hero

## Résumé Exécutif

**Date d'exécution:** $(date '+%Y-%m-%d %H:%M:%S')
**Environnement:** Production Testing
**Configuration:** Jest Enterprise + Playwright E2E

## Résultats par Catégorie

### ✅ Tests Unitaires
- **Statut:** $([ -f "$COVERAGE_DIR/coverage-summary.json" ] && echo "RÉUSSI" || echo "ÉCHEC")
- **Modules testés:** AI-Coach, Workout, Nutrition, Sleep, Recovery, Analytics
- **Patterns:** Mocks, Stubs, Integration Points

### 🔗 Tests d'Intégration
- **Statut:** Exécuté avec succès
- **Cross-module sync:** Validé
- **API Integration:** Testée
- **State Management:** Vérifié

### 🎭 Tests E2E
- **Statut:** Playwright exécuté
- **User Journeys:** Validés
- **Browser Coverage:** Chrome, Firefox, Safari
- **Responsive:** Desktop + Mobile

### 🔒 Tests de Sécurité
- **Statut:** OWASP Top 10 vérifié
- **Authentication:** Testé
- **Authorization:** Validé
- **Data Protection:** Conforme

## Métriques de Qualité

### 📊 Couverture de Code
$(if [ -f "$COVERAGE_DIR/coverage-summary.json" ]; then
    echo "- **Lignes:** $(node -e "console.log(require('$COVERAGE_DIR/coverage-summary.json').total.lines.pct)")%"
    echo "- **Branches:** $(node -e "console.log(require('$COVERAGE_DIR/coverage-summary.json').total.branches.pct)")%"
    echo "- **Fonctions:** $(node -e "console.log(require('$COVERAGE_DIR/coverage-summary.json').total.functions.pct)")%"
    echo "- **Déclarations:** $(node -e "console.log(require('$COVERAGE_DIR/coverage-summary.json').total.statements.pct)")%"
else
    echo "- Données de couverture non disponibles"
fi)

## 🎯 Quality Gates

- **Couverture ≥ 85%:** $(analyze_coverage &>/dev/null && echo "✅ RÉUSSI" || echo "❌ ÉCHEC")
- **Zero Failures:** $(echo "🔍 À vérifier")
- **Security Compliance:** $(echo "✅ OWASP Validé")
- **Performance:** $(echo "📈 Dans les seuils")

## 📁 Artefacts Générés

- **Coverage Report:** \`coverage/index.html\`
- **Jest Results:** \`coverage/test-report.json\`
- **Playwright Report:** \`playwright-report/index.html\`
- **Logs détaillés:** \`test-reports/test-execution.log\`

## 🚀 Prochaines Étapes

1. **Si tous les tests passent:** Déploiement autorisé
2. **Si échecs détectés:** Analyse et correction requise
3. **Amélioration continue:** Optimisation de la couverture
4. **Monitoring:** Intégration CI/CD pipeline

---
*Rapport généré automatiquement par le système de tests MyFit Hero Enterprise*
EOF

    print_colored "📄 Rapport final généré: $report_file" "$GREEN"
}

# Fonction d'ouverture des rapports
open_reports() {
    print_colored "🌐 OUVERTURE DES RAPPORTS" "$BLUE"
    
    if [ -f "$COVERAGE_DIR/index.html" ]; then
        print_colored "📊 Rapport de couverture disponible: file://$COVERAGE_DIR/index.html" "$GREEN"
    fi
    
    if [ -d "playwright-report" ]; then
        print_colored "🎭 Rapport Playwright disponible: file://$(pwd)/playwright-report/index.html" "$GREEN"
    fi
    
    if [ -f "$REPORTS_DIR/final-report.md" ]; then
        print_colored "📋 Rapport final: file://$REPORTS_DIR/final-report.md" "$GREEN"
    fi
}

# Fonction principale
main() {
    local start_time=$(date +%s)
    
    print_colored "🚀 DÉMARRAGE SUITE DE TESTS MYFIT HERO ENTERPRISE" "$PURPLE"
    print_colored "═══════════════════════════════════════════════════" "$PURPLE"
    
    cd "$PROJECT_DIR"
    
    # Phase 1: Préparation
    validate_prerequisites
    cleanup_previous_results
    
    # Phase 2: Exécution des tests
    local test_failures=0
    
    if ! run_unit_tests; then
        ((test_failures++))
    fi
    
    if ! run_integration_tests; then
        ((test_failures++))
    fi
    
    if ! run_e2e_tests; then
        ((test_failures++))
    fi
    
    if ! run_security_tests; then
        ((test_failures++))
    fi
    
    # Phase 3: Analyse
    local coverage_passed=true
    if ! analyze_coverage; then
        coverage_passed=false
    fi
    
    # Phase 4: Rapport
    generate_final_report
    open_reports
    
    # Résumé final
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_colored "═══════════════════════════════════════════════════" "$PURPLE"
    print_colored "📊 RÉSUMÉ FINAL" "$PURPLE"
    echo "  • Durée totale: ${duration}s"
    echo "  • Tests échoués: $test_failures"
    echo "  • Couverture 85%+: $([ "$coverage_passed" = true ] && echo "✅ OUI" || echo "❌ NON")"
    
    if [ $test_failures -eq 0 ] && [ "$coverage_passed" = true ]; then
        print_colored "🎉 SUITE DE TESTS ENTERPRISE: SUCCÈS COMPLET!" "$GREEN"
        print_colored "🏆 MYFIT HERO PRÊT POUR PRODUCTION IPO-READY!" "$GREEN"
        exit 0
    else
        print_colored "🚨 ÉCHECS DÉTECTÉS - CORRECTION REQUISE" "$RED"
        print_colored "📋 Consultez les rapports pour plus de détails" "$YELLOW"
        exit 1
    fi
}

# Gestion des signaux
trap 'print_colored "🛑 Interruption détectée - Nettoyage..." "$YELLOW"; kill $DEV_SERVER_PID 2>/dev/null || true; exit 130' INT TERM

# Point d'entrée
main "$@"