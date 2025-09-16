#!/bin/bash

# Script de correction automatique des erreurs TypeScript

FILE="/workspaces/MyFitHero/src/features/workout/pages/WorkoutPage.tsx"

# Remplacer tous les patterns problématiques
sed -i 's/find(e =>/find((e: any) =>/g' "$FILE"
sed -i 's/map(exercise =>/map((exercise: any) =>/g' "$FILE"
sed -i 's/filter(s =>/filter((s: any) =>/g' "$FILE"
sed -i 's/filter(set =>/filter((set: any) =>/g' "$FILE"
sed -i 's/map((set, setIndex) =>/map((set: any, setIndex: any) =>/g' "$FILE"
sed -i 's/forEach((set, index) =>/forEach((set: any, index: any) =>/g' "$FILE"
sed -i 's/map((entry, index) =>/map((entry: any, index: any) =>/g' "$FILE"
sed -i 's/map((scale) =>/map((scale: any) =>/g' "$FILE"

echo "✅ Corrections TypeScript appliquées à WorkoutPage.tsx"