#!/bin/bash

# ====================================================================
# Script de vérification des imports - MyFitHero
# ====================================================================

echo "🔍 Vérification des imports cassés dans MyFitHero..."
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
total_files=0
error_files=0
warning_files=0

# Fonction de vérification d'un fichier
check_file() {
    local file="$1"
    local file_errors=0
    
    echo -e "${BLUE}📁 Vérification: $file${NC}"
    
    # Vérifier les imports avec alias @
    if grep -q "import.*from.*@/" "$file"; then
        echo -e "${YELLOW}  ⚠️  Imports avec alias @ trouvés${NC}"
        grep -n "import.*from.*@/" "$file" | while read line; do
            echo -e "${YELLOW}    $line${NC}"
        done
        ((warning_files++))
    fi
    
    # Vérifier les imports relatifs cassés
    if grep -q "import.*from.*\.\./" "$file"; then
        while IFS= read -r line; do
            if [[ $line == *"import"* && $line == *"from"* && $line == *"../"* ]]; then
                # Extraire le chemin
                path=$(echo "$line" | sed -n "s/.*from ['\"]\\([^'\"]*\\)['\"].*/\\1/p")
                if [[ $path == ../* ]]; then
                    # Construire le chemin complet
                    file_dir=$(dirname "$file")
                    full_path="$file_dir/$path"
                    
                    # Vérifier si le fichier existe (avec extensions .ts, .tsx, .js, .jsx)
                    if [[ ! -f "$full_path" && ! -f "$full_path.ts" && ! -f "$full_path.tsx" && ! -f "$full_path.js" && ! -f "$full_path.jsx" && ! -f "$full_path/index.ts" && ! -f "$full_path/index.tsx" ]]; then
                        echo -e "${RED}  ❌ Import cassé: $path${NC}"
                        ((file_errors++))
                    fi
                fi
            fi
        done < "$file"
    fi
    
    if [[ $file_errors -eq 0 ]]; then
        echo -e "${GREEN}  ✅ Aucun import cassé trouvé${NC}"
    else
        echo -e "${RED}  ❌ $file_errors import(s) cassé(s) trouvé(s)${NC}"
        ((error_files++))
    fi
    
    echo ""
    ((total_files++))
}

# Vérifier tous les fichiers TypeScript/JavaScript
echo "🔍 Recherche des fichiers à vérifier..."
echo ""

# Fichiers prioritaires
priority_files=(
    "src/pages/index.tsx"
    "src/features/workout/hooks/useIntelligentPreloading.ts"
    "src/core/routes/route-audit.ts"
)

echo "📋 Vérification des fichiers prioritaires:"
echo "==========================================="
for file in "${priority_files[@]}"; do
    if [[ -f "$file" ]]; then
        check_file "$file"
    else
        echo -e "${RED}❌ Fichier non trouvé: $file${NC}"
        ((error_files++))
    fi
done

# Vérifier tous les index.ts des features
echo "📋 Vérification des index.ts des features:"
echo "==========================================="
find src/features -name "index.ts" -type f | while read file; do
    check_file "$file"
done

# Résumé final
echo "=================================================="
echo -e "${BLUE}📊 RÉSUMÉ DE LA VÉRIFICATION:${NC}"
echo "=================================================="
echo -e "Total de fichiers vérifiés: ${BLUE}$total_files${NC}"
echo -e "Fichiers avec erreurs: ${RED}$error_files${NC}"
echo -e "Fichiers avec avertissements: ${YELLOW}$warning_files${NC}"

if [[ $error_files -eq 0 ]]; then
    echo -e "${GREEN}🎉 Tous les imports sont corrects !${NC}"
    exit 0
else
    echo -e "${RED}🚨 $error_files fichier(s) ont des imports cassés${NC}"
    exit 1
fi