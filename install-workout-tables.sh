#!/bin/bash

# ============================================================================
# SCRIPT D'INSTALLATION DES TABLES WORKOUT POUR MYFITHERO
# ============================================================================

echo "🚀 Installation des tables workout pour MyFitHero..."
echo ""

# Vérifier que les fichiers SQL existent
if [ ! -f "setup-workout-tables.sql" ]; then
    echo "❌ Erreur: Le fichier setup-workout-tables.sql n'existe pas"
    exit 1
fi

if [ ! -f "verify-workout-tables.sql" ]; then
    echo "❌ Erreur: Le fichier verify-workout-tables.sql n'existe pas"
    exit 1
fi

echo "✅ Fichiers SQL trouvés"
echo ""

# Afficher les instructions pour Supabase
echo "📋 INSTRUCTIONS POUR SUPABASE:"
echo ""
echo "1. Connectez-vous à votre dashboard Supabase"
echo "2. Allez dans SQL Editor"
echo "3. Créez une nouvelle requête"
echo "4. Copiez et exécutez le contenu de: setup-workout-tables.sql"
echo "5. Puis exécutez le contenu de: verify-workout-tables.sql"
echo ""

echo "🔗 Fichiers créés:"
echo "├── setup-workout-tables.sql (Script principal)"
echo "├── verify-workout-tables.sql (Script de vérification)"
echo "└── install-workout-tables.sh (Ce script)"
echo ""

echo "📋 TABLES QUI SERONT CRÉÉES:"
echo "├── 🏗️ workout_plans (Plans d'entraînement)"
echo "├── ⏱️ workout_sessions (Sessions d'entraînement)"
echo "├── 🏋️ workout_sets (Séries individuelles)"
echo "├── 📊 session_metrics (Métriques de session)"
echo "└── 🔄 sync_queue (Queue de synchronisation)"
echo ""

echo "🎯 COMPOSANTS QUI FONCTIONNERONT APRÈS:"
echo "├── ⚡ AdvancedSessionTimer"
echo "├── 🧠 SmartRestTimer"
echo "├── 📈 VolumeAnalyticsEngine"
echo "└── 🔧 SophisticatedWorkoutFlowManager"
echo ""

echo "⚠️  IMPORTANT:"
echo "- Assurez-vous d'avoir des utilisateurs dans auth.users"
echo "- Vérifiez que exercises_library existe"
echo "- Testez avec un utilisateur authentifié"
echo ""

echo "✨ Prêt pour l'installation dans Supabase!"

# Optionnel: Ouvrir les fichiers SQL dans l'éditeur par défaut
if command -v code &> /dev/null; then
    echo ""
    read -p "Voulez-vous ouvrir les fichiers SQL dans VS Code? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        code setup-workout-tables.sql
        code verify-workout-tables.sql
        echo "📝 Fichiers SQL ouverts dans VS Code"
    fi
fi