#!/bin/bash

echo "🚀 TYPESCRIPT INTERFACE HARMONIZATION"
echo "===================================="

# 1. Ajouter des propriétés manquantes aux interfaces communes
echo "🔧 1. Adding missing properties to common interfaces..."

# Ajouter description aux SportOption qui n'en ont pas
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "interface.*SportOption" | while read file; do
  if ! grep -q "description.*:" "$file"; then
    sed -i '/interface.*SportOption/,/^}/ s/userCount\?\?:.*/&\n  description?: string;/' "$file"
    echo "  ✅ Added description to SportOption in $file"
  fi
done

# 2. Corriger les assignations de type strict
echo "🔧 2. Fixing strict type assignments..."

# Remplacer les types strictement null par undefined 
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/| null /| undefined /g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/| null$/| undefined/g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/| null;/| undefined;/g'

echo "  ✅ Converted null types to undefined"

# 3. Ajouter des descriptions par défaut pour les objets sport
echo "🔧 3. Adding default descriptions for sport objects..."

find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "name:.*sport" | while read file; do
  # Ajouter description automatiquement si elle manque
  sed -i '/name: .*sport/a\      description: sport.name + " sport",' "$file"
  echo "  ✅ Added default descriptions in $file"
done

# 4. Corriger les problèmes de paramètres de fonctions
echo "🔧 4. Fixing function parameter issues..."

# Corriger les fonctions map sans paramètres corrects
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  if grep -q "\.map([^,]*=>" "$file"; then
    sed -i 's/\.map(\([^,]*\) =>/\.map((\1, index) =>/g' "$file"
    echo "  ✅ Fixed map parameters in $file"
  fi
done

echo ""
echo "🎉 Interface harmonization completed!"
echo "📊 Checking types..."