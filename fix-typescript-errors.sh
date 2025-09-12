#!/bin/bash

# Script pour corriger automatiquement les erreurs TypeScript communes
# Usage: ./fix-typescript-errors.sh

echo "🔧 Correction automatique des erreurs TypeScript communes..."

# Fonction pour ajouter les imports React dans un fichier
add_react_imports() {
    local file="$1"
    
    # Vérifier si le fichier contient useState, useEffect, etc. mais pas d'import React
    if grep -q "useState\|useEffect\|useCallback\|useMemo\|useRef" "$file" && ! grep -q "import.*React" "$file"; then
        echo "  📝 Ajout imports React dans: $file"
        
        # Déterminer quels hooks sont utilisés
        hooks=""
        [[ $(grep -c "useState" "$file") -gt 0 ]] && hooks="$hooks, useState"
        [[ $(grep -c "useEffect" "$file") -gt 0 ]] && hooks="$hooks, useEffect"
        [[ $(grep -c "useCallback" "$file") -gt 0 ]] && hooks="$hooks, useCallback"
        [[ $(grep -c "useMemo" "$file") -gt 0 ]] && hooks="$hooks, useMemo"
        [[ $(grep -c "useRef" "$file") -gt 0 ]] && hooks="$hooks, useRef"
        
        # Nettoyer le premier ", "
        hooks=${hooks#, }
        
        # Ajouter l'import React en haut du fichier
        sed -i "1i import React, { $hooks } from 'react';" "$file"
    fi
}

# Fonction pour corriger les catch sans paramètre error
fix_catch_blocks() {
    local file="$1"
    
    if grep -q "} catch {" "$file"; then
        echo "  🐛 Correction catch blocks dans: $file"
        sed -i 's/} catch {/} catch (error) {/g' "$file"
    fi
}

# Fonction pour ajouter useTranslation import
add_translation_import() {
    local file="$1"
    
    if grep -q "useTranslation" "$file" && ! grep -q "react-i18next" "$file"; then
        echo "  🌐 Ajout import useTranslation dans: $file"
        sed -i "1i import { useTranslation } from 'react-i18next';" "$file"
    fi
}

# Traitement des fichiers
echo "📁 Traitement des fichiers .ts et .tsx..."

# Trouver tous les fichiers TypeScript/React
find features/ src/ -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if [[ -f "$file" ]]; then
        add_react_imports "$file"
        fix_catch_blocks "$file"
        add_translation_import "$file"
    fi
done

echo "✅ Correction automatique terminée!"
echo "🔍 Vérification des erreurs restantes..."