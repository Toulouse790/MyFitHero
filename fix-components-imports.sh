#!/bin/bash
# Script pour corriger les imports relatifs vers components/ui

echo "🔄 Correction des imports relatifs components/ui/ → @/components/ui/"

# Remplacer tous les imports relatifs vers components/ui par l'alias @/components/ui/
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i 's|from '\''[./]*components/ui/|from '\''@/components/ui/|g'
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i 's|from "[./]*components/ui/|from "@/components/ui/|g'

echo "✅ Imports relatifs components/ui corrigés"