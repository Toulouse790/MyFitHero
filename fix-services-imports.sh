#!/bin/bash
# Script pour corriger les imports services/ → src/lib/services/

echo "🔄 Correction des imports @/services/ → @/lib/services/"

# Remplacer tous les imports @/services/ par @/lib/services/
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i 's|@/services/|@/lib/services/|g'

echo "✅ Imports services corrigés"