#!/bin/bash

echo "🔧 CORRECTION SÉCURISÉE NULL → UNDEFINED"
echo "====================================="

# Fonction pour corriger null → undefined dans un fichier spécifique
fix_null_to_undefined() {
    local file=$1
    if [ -f "$file" ]; then
        echo "  🔄 Processing $file..."
        
        # Backup du fichier
        cp "$file" "$file.backup"
        
        # Corrections sécurisées
        sed -i 's/error: null/error: undefined/g' "$file"
        sed -i 's/user: null/user: undefined/g' "$file"
        sed -i 's/session: null/session: undefined/g' "$file"
        sed -i 's/data: null/data: undefined/g' "$file"
        sed -i 's/result: null/result: undefined/g' "$file"
        
        # Vérifier que le fichier compile toujours
        if npx tsc --noEmit "$file" 2>/dev/null; then
            echo "    ✅ $file - Corrections appliquées avec succès"
            rm "$file.backup"
        else
            echo "    ❌ $file - Erreur détectée, restauration..."
            mv "$file.backup" "$file"
        fi
    fi
}

# Liste des fichiers à corriger (commençons par les plus simples)
FILES_TO_FIX=(
    "src/App.tsx"
    "src/components/NetworkErrorBoundary.tsx"
)

for file in "${FILES_TO_FIX[@]}"; do
    fix_null_to_undefined "$file"
done

echo ""
echo "📊 Vérification des erreurs après corrections..."