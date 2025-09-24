#!/bin/bash

echo "🧹 RESTAURATION DES FICHIERS AVEC ERREURS DE SYNTAXE"
echo "=================================================="

# Identifier et restaurer les fichiers avec erreurs de syntaxe critiques
echo "🔍 Identification des fichiers avec erreurs de syntaxe..."

# Obtenir la liste des fichiers avec erreurs de syntaxe
SYNTAX_ERROR_FILES=$(npm run type-check 2>&1 | grep -E "error TS1005|error TS1382|error TS1381|error TS1128" | cut -d'(' -f1 | sort -u)

if [ -z "$SYNTAX_ERROR_FILES" ]; then
    echo "✅ Aucun fichier avec erreurs de syntaxe détecté"
    exit 0
fi

echo "📋 Fichiers avec erreurs de syntaxe détectés:"
echo "$SYNTAX_ERROR_FILES"

echo ""
echo "🔄 Restauration depuis Git..."

# Restaurer chaque fichier problématique
while IFS= read -r file; do
    if [ -f "$file" ]; then
        echo "  🔄 Restauration de $file"
        git restore "$file" 2>/dev/null || echo "    ⚠️  Impossible de restaurer $file"
    fi
done <<< "$SYNTAX_ERROR_FILES"

echo ""
echo "✅ Restauration terminée!"
echo "📊 Vérification des erreurs TypeScript..."