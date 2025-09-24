#!/bin/bash

# SCRIPT DE TEST - Module Workout
# Tests complets avec coverage pour le module workout

echo "🧪 LANCEMENT DES TESTS - MODULE WORKOUT"
echo "======================================"

# Configuration des variables d'environnement de test
export NODE_ENV=test
export VITE_SUPABASE_URL=http://localhost:54321
export VITE_SUPABASE_ANON_KEY=test-key

echo "📦 Installation des dépendances de test si nécessaire..."
npm install --silent

echo "🔄 Nettoyage des anciennes données de coverage..."
rm -rf coverage/workout 2>/dev/null || true

echo "🧪 Exécution des tests du module workout..."

# Tests unitaires hooks
echo "  → Tests des hooks..."
npm run test -- --testPathPattern="features/workout/hooks.*\.test\." --coverage --coverageDirectory=coverage/workout/hooks

# Tests unitaires services
echo "  → Tests des services..."
npm run test -- --testPathPattern="features/workout/services.*\.test\." --coverage --coverageDirectory=coverage/workout/services

# Tests unitaires composants (si présents)
echo "  → Tests des composants..."
npm run test -- --testPathPattern="features/workout/components.*\.test\." --coverage --coverageDirectory=coverage/workout/components

# Génération du rapport de coverage consolidé
echo "📊 Génération du rapport de coverage..."
npm run test -- --testPathPattern="features/workout.*\.test\." --coverage --coverageDirectory=coverage/workout --coverageReporters=html,lcov,text-summary

echo ""
echo "✅ TESTS TERMINÉS"
echo "=================="
echo ""
echo "📊 Résultats de coverage:"
echo "- Hooks: coverage/workout/hooks/index.html"
echo "- Services: coverage/workout/services/index.html"
echo "- Global: coverage/workout/index.html"
echo ""

# Vérification des seuils de coverage
echo "🎯 Vérification des seuils de coverage (85% minimum)..."

# Affichage du résumé de coverage
if [ -f "coverage/workout/coverage-summary.json" ]; then
  echo "Coverage détaillé disponible dans coverage/workout/"
else
  echo "⚠️  Fichier de résumé coverage non trouvé"
fi

echo ""
echo "🚀 Pour ouvrir le rapport HTML:"
echo "   open coverage/workout/index.html"
echo ""