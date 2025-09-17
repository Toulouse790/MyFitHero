#!/bin/bash

# 🔍 AUDIT AUTOMATIQUE D'ACCESSIBILITÉ
# Effectue un audit complet WCAG 2.1 AA

echo "🔍 AUDIT D'ACCESSIBILITÉ WCAG 2.1 AA"
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# URL à auditer (défaut: localhost)
URL=${1:-"http://localhost:4173"}

echo "🌐 URL à auditer: $URL"
echo ""

# Vérifier si le serveur répond
echo "📡 Vérification de la connectivité..."
if ! curl -s --head "$URL" > /dev/null; then
    echo -e "${RED}❌ Impossible de se connecter à $URL${NC}"
    echo "💡 Assurez-vous que le serveur est démarré avec 'npm run preview'"
    exit 1
fi

echo -e "${GREEN}✅ Serveur accessible${NC}"
echo ""

# Effectuer l'audit avec axe-cli
echo "🔍 Audit avec axe-core..."
echo "========================"

# Audit complet WCAG 2.1 AA
npx axe "$URL" \
    --tags wcag2a,wcag2aa,wcag21aa \
    --reporter json \
    --output-dir ./accessibility-reports \
    --output-file audit-$(date +%Y%m%d_%H%M%S).json

AUDIT_EXIT_CODE=$?

if [ $AUDIT_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Audit terminé avec succès${NC}"
    echo "📄 Rapport disponible dans ./accessibility-reports/"
else
    echo -e "${RED}❌ Des violations d'accessibilité ont été détectées${NC}"
fi

# Audit spécifique par critères
echo ""
echo "📊 Audit détaillé par critères WCAG..."
echo "====================================="

# Audit des contrastes
echo "🎨 Contraste des couleurs..."
npx axe "$URL" --tags color-contrast --reporter cli

# Audit des formulaires
echo "📝 Accessibilité des formulaires..."
npx axe "$URL" --rules label,form-field-multiple-labels --reporter cli

# Audit de la navigation au clavier
echo "⌨️ Navigation au clavier..."
npx axe "$URL" --rules keyboard,focus-order-semantics --reporter cli

# Audit des images
echo "🖼️ Images et médias..."
npx axe "$URL" --rules image-alt,image-redundant-alt --reporter cli

# Résumé final
echo ""
echo "📋 RÉSUMÉ DE L'AUDIT"
echo "==================="

if [ $AUDIT_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}🎉 L'application respecte les normes WCAG 2.1 AA${NC}"
else
    echo -e "${YELLOW}⚠️ Des améliorations sont nécessaires${NC}"
    echo "📖 Consultez le rapport détaillé pour plus d'informations"
fi

exit $AUDIT_EXIT_CODE
