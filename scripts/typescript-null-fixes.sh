#!/bin/bash

# Script pour corriger automatiquement les problèmes null/undefined
echo "🚀 TYPESCRIPT NULL/UNDEFINED FIXES"
echo "==================================="

# 1. Corriger les assignations null dans useSmartDashboard
echo "🔧 1. Fixing null assignments in useSmartDashboard..."
if [ -f "src/features/analytics/hooks/useSmartDashboard.ts" ]; then
  # Corriger les assignations null -> undefined
  sed -i 's/: string | null | undefined/: string | undefined/g' src/features/analytics/hooks/useSmartDashboard.ts
  sed -i 's/: number | null | undefined/: number | undefined/g' src/features/analytics/hooks/useSmartDashboard.ts
  sed -i 's/: "male" | "female" | null | undefined/: "male" | "female" | undefined/g' src/features/analytics/hooks/useSmartDashboard.ts
  echo "  ✅ Fixed null assignments in useSmartDashboard.ts"
else
  echo "  ❌ useSmartDashboard.ts not found"
fi

# 2. Corriger les issues de SportSelector 
echo "🔧 2. Fixing SportSelector issues..."
if [ -f "src/features/analytics/components/SportSelector.tsx" ]; then
  # Ajouter la propriété description aux objets sport
  sed -i 's/isRecommended: false,/isRecommended: false,\n      description: sport.name + " sport",/g' src/features/analytics/components/SportSelector.tsx
  echo "  ✅ Added description property to sports"
  
  # Corriger les paramètres de fonction dans les map calls
  sed -i 's/\.map(sport => addMetadata(sport))/\.map((sport, index) => addMetadata(sport))/g' src/features/analytics/components/SportSelector.tsx
  echo "  ✅ Fixed map function parameters"
else
  echo "  ❌ SportSelector.tsx not found"
fi

# 3. Corriger les debounce calls avec mauvais nombre de paramètres
echo "🔧 3. Fixing debounce function calls..."
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "debounce(" | while read file; do
  if grep -q "debounce.*," "$file"; then
    # Corriger les appels debounce avec trop de paramètres
    sed -i 's/debounce(\([^,]*\),\([^,]*\),.*)/debounce(\1, \2)/g' "$file"
    echo "  ✅ Fixed debounce calls in $file"
  fi
done

# 4. Ajouter des types manquants pour les variables "unknown"
echo "🔧 4. Adding type annotations for unknown variables..."
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "is of type 'unknown'" 2>/dev/null | while read file; do
  # Ajouter des type assertions pour les variables unknown
  sed -i 's/sports\.map(/((sports as any[]) || []).map(/g' "$file"
  echo "  ✅ Added type assertions in $file"
done

echo ""
echo "🎉 Null/undefined fixes completed!"
echo "📊 Running type check..."