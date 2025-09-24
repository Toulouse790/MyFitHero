import React from 'react';
// src/features/profile/components/avatar/FileValidation.tsx

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileValidation {
  static validateImageFile(file: File): ValidationResult {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Veuillez sélectionner une image valide.',
      };
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "L'image ne doit pas dépasser 5MB.",
      };
    }

    // Vérifier les dimensions minimales
    return new Promise<ValidationResult>((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          resolve({
            isValid: false,
            error: 'L\'image doit faire au moins 100x100 pixels.',
          });
        } else {
          resolve({ isValid: true });
        }
      };
      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Impossible de lire l\'image.',
        });
      };
      img.src = URL.createObjectURL(file);
    }) as any;
  }

  static createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      reader.readAsDataURL(file);
    });
  }
}