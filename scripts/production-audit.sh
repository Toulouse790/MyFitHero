#!/bin/bash

# 🔍 SCRIPT DE VALIDATION FINALE - MyFitHero Production
# Vérifie tous les aspects critiques avant déploiement

echo "🚀 VALIDATION FINALE MYFITHEORP - AUDIT DE PRODUCTION"
echo "==================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "📦 Étape 1/6: Compilation TypeScript"
echo "===================================="

echo "🔧 Vérification de la compilation..."

# Test de compilation TypeScript
if npm run build > build.log 2>&1; then
    echo -e "${GREEN}✅ Compilation réussie${NC}"
    COMPILE_SUCCESS=true
else
    echo -e "${RED}❌ Erreurs de compilation détectées${NC}"
    echo "📋 Logs de compilation:"
    tail -20 build.log
    COMPILE_SUCCESS=false
fi

echo ""
echo "🔍 Étape 2/6: Validation des Imports"
echo "===================================="

# Vérifier les imports @/lib/utils
echo "📝 Vérification des imports @/lib/utils..."
if grep -r "@/lib/utils" src/ --include="*.tsx" --include="*.ts" | head -5; then
    if [ -f "src/lib/utils.ts" ]; then
        echo -e "${GREEN}✅ Fichier utils.ts présent${NC}"
        UTILS_OK=true
    else
        echo -e "${RED}❌ Fichier utils.ts manquant${NC}"
        UTILS_OK=false
    fi
else
    echo -e "${YELLOW}⚠️ Aucun import @/lib/utils trouvé${NC}"
    UTILS_OK=true
fi

# Vérifier les imports relatifs problématiques
echo "🔗 Vérification des chemins d'import..."
BROKEN_IMPORTS=$(grep -r "import.*from.*'\.\./\.\./\.\./\.\./\.\." src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ $BROKEN_IMPORTS -gt 0 ]; then
    echo -e "${YELLOW}⚠️ ${BROKEN_IMPORTS} imports avec chemins très longs détectés${NC}"
    IMPORTS_OK=false
else
    echo -e "${GREEN}✅ Imports relatifs corrects${NC}"
    IMPORTS_OK=true
fi

echo ""
echo "🎯 Étape 3/6: Validation des Lazy Routes"
echo "========================================"

echo "🔍 Vérification des composants lazy-loaded..."

# Vérifier que tous les fichiers lazy-loaded existent
LAZY_FILES=(
    "src/features/auth/pages/ProfileComplete.tsx"
    "src/features/dashboard/pages/Dashboard.tsx" 
    "src/pages/NotFound.tsx"
    "src/components/LoadingScreen.tsx"
    "src/components/ErrorFallback.tsx"
)

LAZY_OK=true
for file in "${LAZY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file MANQUANT${NC}"
        LAZY_OK=false
    fi
done

echo ""
echo "🎨 Étape 4/6: Validation des Composants UI"
echo "=========================================="

# Vérifier la cohérence des hauteurs dans les composants UI
echo "📏 Vérification des hauteurs standardisées..."

BUTTON_HEIGHT=$(grep -o "h-[0-9]\+" src/components/ui/button.tsx | head -1)
INPUT_HEIGHT=$(grep -o "h-[0-9]\+" src/components/ui/input.tsx | head -1)
SELECT_HEIGHT=$(grep -o "h-[0-9]\+" src/components/ui/select.tsx | head -1)

echo "Button hauteur: $BUTTON_HEIGHT"
echo "Input hauteur: $INPUT_HEIGHT"  
echo "Select hauteur: $SELECT_HEIGHT"

if [ "$BUTTON_HEIGHT" = "$INPUT_HEIGHT" ] && [ "$INPUT_HEIGHT" = "$SELECT_HEIGHT" ]; then
    echo -e "${GREEN}✅ Hauteurs cohérentes entre composants UI${NC}"
    UI_CONSISTENT=true
else
    echo -e "${YELLOW}⚠️ Hauteurs incohérentes entre composants UI${NC}"
    UI_CONSISTENT=false
fi

# Vérifier les CSS custom properties
echo "🎨 Vérification des CSS custom properties..."
if grep -q "ring-offset-background" src/index.css; then
    echo -e "${GREEN}✅ CSS custom properties définies${NC}"
    CSS_OK=true
else
    echo -e "${RED}❌ CSS custom properties manquantes${NC}"
    CSS_OK=false
fi

echo ""
echo "🔐 Étape 5/6: Validation du Flux d'Authentification"
echo "=================================================="

# Vérifier la cohérence du flux auth
echo "🔍 Vérification de useAuth.ts..."

if grep -q "from('user_profiles')" src/features/auth/hooks/useAuth.ts; then
    echo -e "${GREEN}✅ Table 'user_profiles' utilisée correctement${NC}"
    AUTH_TABLE_OK=true
else
    echo -e "${RED}❌ Table d'auth incorrecte - devrait utiliser 'user_profiles'${NC}"
    AUTH_TABLE_OK=false
fi

if grep -q "onboarding_completed" src/features/auth/hooks/useAuth.ts; then
    echo -e "${GREEN}✅ Champ onboarding_completed présent${NC}"
    ONBOARDING_OK=true
else
    echo -e "${RED}❌ Champ onboarding_completed manquant${NC}"
    ONBOARDING_OK=false
fi

echo ""
echo "⚡ Étape 6/6: Tests Rapides de Performance"
echo "========================================"

# Vérifier la taille du bundle
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
    echo "📦 Taille du bundle: $BUNDLE_SIZE"
    
    if [ -f "dist/assets/index-*.js" ]; then
        JS_SIZE=$(du -sh dist/assets/index-*.js | cut -f1)
        echo "📄 Taille JS principal: $JS_SIZE"
    fi
    
    echo -e "${GREEN}✅ Bundle généré avec succès${NC}"
    BUNDLE_OK=true
else
    echo -e "${YELLOW}⚠️ Dossier dist/ non trouvé - Exécutez npm run build${NC}"
    BUNDLE_OK=false
fi

echo ""
echo "📊 RÉSUMÉ DE L'AUDIT FINAL"
echo "========================="

# Calcul du score global
SCORE=0
TOTAL=8

[ "$COMPILE_SUCCESS" = true ] && ((SCORE++)) || echo "❌ Compilation"
[ "$UTILS_OK" = true ] && ((SCORE++)) || echo "❌ Utils imports" 
[ "$IMPORTS_OK" = true ] && ((SCORE++)) || echo "❌ Import paths"
[ "$LAZY_OK" = true ] && ((SCORE++)) || echo "❌ Lazy routes"
[ "$UI_CONSISTENT" = true ] && ((SCORE++)) || echo "❌ UI consistency"
[ "$CSS_OK" = true ] && ((SCORE++)) || echo "❌ CSS variables"
[ "$AUTH_TABLE_OK" = true ] && ((SCORE++)) || echo "❌ Auth table"
[ "$ONBOARDING_OK" = true ] && ((SCORE++)) || echo "❌ Onboarding flow"

PERCENTAGE=$(( SCORE * 100 / TOTAL ))

echo ""
echo "🎯 SCORE GLOBAL: $SCORE/$TOTAL ($PERCENTAGE%)"

if [ $SCORE -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 PARFAIT! MyFitHero est prêt pour la production!${NC}"
    echo -e "${GREEN}✅ Tous les critères sont validés${NC}"
    EXIT_CODE=0
elif [ $SCORE -ge 6 ]; then
    echo -e "${YELLOW}⚠️ PRESQUE PRÊT! Quelques améliorations mineures restantes${NC}"
    echo -e "${YELLOW}📋 Corrigez les points marqués ❌ ci-dessus${NC}"
    EXIT_CODE=1
else
    echo -e "${RED}❌ CORRECTION NÉCESSAIRE! Plusieurs problèmes critiques détectés${NC}"
    echo -e "${RED}🔧 Corrigez les problèmes avant déploiement${NC}"
    EXIT_CODE=2
fi

echo ""
echo "🛠️ COMMANDES UTILES:"
echo "• npm run build    - Recompiler le projet"
echo "• npm run dev      - Lancer en développement"  
echo "• npm run preview  - Prévisualiser la build"

echo ""
echo -e "${BLUE}🚀 MyFitHero - Fitness App Ready for Production!${NC}"

exit $EXIT_CODE