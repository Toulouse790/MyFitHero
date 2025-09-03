// Validation email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation mot de passe fort
export const isStrongPassword = (password: string): boolean => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Validation nom d'utilisateur
export const isValidUsername = (username: string): boolean => {
  // 3-20 caractères, lettres, chiffres, underscore, tiret
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Validation numéro de téléphone français
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validation de l'âge
export const isValidAge = (age: number): boolean => {
  return age >= 13 && age <= 120;
};

// Validation du poids
export const isValidWeight = (weight: number): boolean => {
  return weight >= 30 && weight <= 300;
};

// Validation de la taille
export const isValidHeight = (height: number): boolean => {
  return height >= 100 && height <= 250;
};

// Validation URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Messages d'erreur de validation
export const validationMessages = {
  email: 'Adresse email invalide',
  password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  username: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères alphanumériques',
  phone: 'Numéro de téléphone invalide',
  age: 'L\'âge doit être entre 13 et 120 ans',
  weight: 'Le poids doit être entre 30 et 300 kg',
  height: 'La taille doit être entre 100 et 250 cm',
  required: 'Ce champ est requis',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  min: (min: number) => `La valeur doit être supérieure à ${min}`,
  max: (max: number) => `La valeur doit être inférieure à ${max}`,
};

// Classe de validation de formulaire
export class FormValidator {
  private errors: Record<string, string> = {};

  // Validation d'un champ requis
  required(field: string, value: any, message?: string): this {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.errors[field] = message || validationMessages.required;
    }
    return this;
  }

  // Validation email
  email(field: string, value: string, message?: string): this {
    if (value && !isValidEmail(value)) {
      this.errors[field] = message || validationMessages.email;
    }
    return this;
  }

  // Validation mot de passe
  password(field: string, value: string, message?: string): this {
    if (value && !isStrongPassword(value)) {
      this.errors[field] = message || validationMessages.password;
    }
    return this;
  }

  // Validation longueur minimum
  minLength(field: string, value: string, min: number, message?: string): this {
    if (value && value.length < min) {
      this.errors[field] = message || validationMessages.minLength(min);
    }
    return this;
  }

  // Validation longueur maximum
  maxLength(field: string, value: string, max: number, message?: string): this {
    if (value && value.length > max) {
      this.errors[field] = message || validationMessages.maxLength(max);
    }
    return this;
  }

  // Validation valeur numérique minimum
  min(field: string, value: number, min: number, message?: string): this {
    if (value !== undefined && value < min) {
      this.errors[field] = message || validationMessages.min(min);
    }
    return this;
  }

  // Validation valeur numérique maximum
  max(field: string, value: number, max: number, message?: string): this {
    if (value !== undefined && value > max) {
      this.errors[field] = message || validationMessages.max(max);
    }
    return this;
  }

  // Validation custom
  custom(field: string, isValid: boolean, message: string): this {
    if (!isValid) {
      this.errors[field] = message;
    }
    return this;
  }

  // Récupération des erreurs
  getErrors(): Record<string, string> {
    return this.errors;
  }

  // Vérification si valide
  isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  // Reset des erreurs
  reset(): void {
    this.errors = {};
  }
}

// Helper pour validation de formulaire
export const validateForm = <T extends Record<string, any>>(
  data: T,
  validations: (validator: FormValidator) => void
): { isValid: boolean; errors: Record<string, string> } => {
  const validator = new FormValidator();
  validations(validator);
  
  return {
    isValid: validator.isValid(),
    errors: validator.getErrors(),
  };
};
