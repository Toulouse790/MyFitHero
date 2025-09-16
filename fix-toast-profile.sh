#!/bin/bash

# Script pour corriger les usages de toast dans ProfilePage.tsx

FILE="/workspaces/MyFitHero/src/features/profile/pages/ProfilePage.tsx"

# Remplacer toast.success
sed -i "s/toast\.success('\([^']*\)');/toast({ title: \"Succès\", description: \"\1\" });/g" "$FILE"

# Remplacer toast.error  
sed -i "s/toast\.error('\([^']*\)');/toast({ title: \"Erreur\", description: \"\1\", variant: \"destructive\" });/g" "$FILE"

# Remplacer toast.success avec backticks (template literals)
sed -i "s/toast\.success(\`\([^\`]*\)\`);/toast({ title: \"Succès\", description: \`\1\` });/g" "$FILE"

echo "✅ Corrections toast appliquées à ProfilePage.tsx"