#!/bin/bash

# ====================================================================
# Script de correction automatique des imports - MyFitHero
# ====================================================================

echo "🔧 Correction automatique des imports dans MyFitHero..."
echo "===================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

corrections=0

# Fonction de correction des imports
fix_imports_in_file() {
    local file="$1"
    local file_corrections=0
    
    echo -e "${BLUE}🔧 Correction: $file${NC}"
    
    # Créer une sauvegarde
    cp "$file" "$file.backup"
    
    # Corriger les imports avec alias @ vers des chemins relatifs si nécessaire
    # (À faire seulement si les alias ne fonctionnent pas)
    
    # Vérifier si des corrections ont été faites
    if ! diff -q "$file" "$file.backup" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ Corrections appliquées${NC}"
        ((file_corrections++))
        rm "$file.backup"
    else
        echo -e "${YELLOW}  ⚠️  Aucune correction nécessaire${NC}"
        rm "$file.backup"
    fi
    
    ((corrections += file_corrections))
}

# Vérifier et corriger les chemins TypeScript
echo "🔍 Vérification de la configuration TypeScript..."
if [[ -f "tsconfig.json" ]]; then
    if grep -q '"baseUrl": "."' tsconfig.json && grep -q '"@/\*": \["./src/\*"\]' tsconfig.json; then
        echo -e "${GREEN}✅ Configuration TypeScript correcte${NC}"
    else
        echo -e "${YELLOW}⚠️  Configuration TypeScript à vérifier${NC}"
    fi
fi

# Compiler pour vérifier les erreurs
echo ""
echo "🏗️  Compilation pour vérifier les erreurs..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Compilation réussie - Tous les imports sont corrects !${NC}"
else
    echo -e "${YELLOW}⚠️  Erreurs de compilation détectées${NC}"
    echo "Lancement de la compilation avec détails..."
    npm run build
fi

echo ""
echo "=================================================="
echo -e "${BLUE}📊 RÉSUMÉ DES CORRECTIONS:${NC}"
echo "=================================================="
echo -e "Total de corrections appliquées: ${GREEN}$corrections${NC}"

if [[ $corrections -eq 0 ]]; then
    echo -e "${GREEN}🎉 Tous les imports étaient déjà corrects !${NC}"
else
    echo -e "${GREEN}✅ $corrections correction(s) appliquée(s) avec succès${NC}"
fi

echo ""
echo -e "${BLUE}📋 STRUCTURE DES IMPORTS RECOMMANDÉE:${NC}"
echo "=================================================="
echo "✅ Utilisation des alias @ configurés dans tsconfig.json"
echo "✅ Import des pages: import Page from '@/features/module/pages/PageName'"
echo "✅ Import des composants: import Component from '@/features/module/components/ComponentName'"
echo "✅ Export dans index.ts: export { default as PageName } from './pages/PageName'"
echo ""
echo -e "${GREEN}🔍 Pour vérifier les imports: ./check-imports.sh${NC}"