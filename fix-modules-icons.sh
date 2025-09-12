#!/bin/bash

# Script pour corriger les modules manquants et icônes
echo "🔧 Correction des modules manquants et icônes..."

# Fonction pour créer les modules manquants
create_missing_modules() {
    echo "📁 Création des modules manquants..."
    
    # Créer @/shared/types/toast.ts
    if [[ ! -f "src/shared/types/toast.ts" ]]; then
        echo "  ✨ Création de src/shared/types/toast.ts"
        mkdir -p src/shared/types
        cat > src/shared/types/toast.ts << 'EOF'
export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'warning';
  duration?: number;
  action?: React.ReactNode;
}

export type ToastVariant = 'default' | 'destructive' | 'warning';
EOF
    fi
    
    # Créer @/shared/hooks/useAnimations.ts si manquant
    if [[ ! -f "src/shared/hooks/useAnimations.ts" ]]; then
        echo "  ✨ Création de src/shared/hooks/useAnimations.ts"
        mkdir -p src/shared/hooks
        cat > src/shared/hooks/useAnimations.ts << 'EOF'
import React, { useState, useEffect } from 'react';

export const useAnimatedToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  return {
    isVisible,
    setIsVisible
  };
};

export const useAnimation = (duration = 300) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  return {
    isAnimating,
    setIsAnimating
  };
};
EOF
    fi
}

# Fonction pour ajouter les imports d'icônes manquantes
add_missing_icons() {
    echo "🎨 Ajout des imports d'icônes manquantes..."
    
    # Liste des icônes communes à chercher/ajouter
    icons=(
        "CheckCircle" "AlertCircle" "Info" "X" "Loader2" "Scale"
        "Activity" "Heart" "Moon" "Zap" "TrendingUp" "Clock"
        "Globe" "Ruler" "Waves" "Thermometer" "Wifi" "WifiOff"
        "Download" "RefreshCw" "Bell" "Search" "Star" "Target"
        "Users" "Plus" "Check" "ChevronRight"
    )
    
    # Chercher les fichiers qui utilisent ces icônes sans les importer
    find features/ src/ -name "*.tsx" -o -name "*.ts" | while read -r file; do
        if [[ -f "$file" ]]; then
            # Vérifier si le fichier utilise des icônes mais n'a pas d'import lucide-react
            for icon in "${icons[@]}"; do
                if grep -q "<$icon" "$file" || grep -q "$icon" "$file"; then
                    if ! grep -q "lucide-react" "$file"; then
                        echo "  🎨 Ajout import lucide-react dans: $file"
                        # Créer la liste des icônes utilisées dans ce fichier
                        used_icons=""
                        for check_icon in "${icons[@]}"; do
                            if grep -q "$check_icon" "$file"; then
                                used_icons="$used_icons, $check_icon"
                            fi
                        done
                        # Nettoyer le premier ", "
                        used_icons=${used_icons#, }
                        
                        if [[ -n "$used_icons" ]]; then
                            # Ajouter l'import lucide-react
                            sed -i "1i import { $used_icons } from 'lucide-react';" "$file"
                            break
                        fi
                    fi
                    break
                fi
            done
        fi
    done
}

# Fonction pour ajouter les imports toast manquants
add_toast_imports() {
    echo "🍞 Ajout des imports toast manquants..."
    
    find features/ src/ -name "*.tsx" -o -name "*.ts" | while read -r file; do
        if [[ -f "$file" ]]; then
            # Vérifier si le fichier utilise toast() sans l'importer
            if grep -q "toast(" "$file" && ! grep -q "sonner\|@/.*toast" "$file"; then
                echo "  🍞 Ajout import toast dans: $file"
                sed -i "1i import { toast } from 'sonner';" "$file"
            fi
        fi
    done
}

# Exécution des corrections
create_missing_modules
add_missing_icons
add_toast_imports

echo "✅ Correction des modules et icônes terminée!"