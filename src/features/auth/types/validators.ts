/**
 * 🎯 MYFITHERO AUTH - VALIDATEURS 6★/5
 * Système de validation ultra-sécurisé niveau enterprise
 * 
 * @version 2.0.0
 * @author MyFitHero Team
 * @since 2025-09-24
 */

import {
  ValidatedEmail,
  SecurePassword,
  UserId,
  JWTToken,
  RefreshToken,
  SignUpRequest,
  SignInRequest,
  UserProfileUpdate,
  AuthErrorCode,
  AuthError,
  Gender,
  ActivityLevel,
  OAuthProvider
} from './advanced';

// ============================================================================
// CONSTANTES DE VALIDATION
// ============================================================================

const VALIDATION_CONSTANTS = {
  EMAIL: {
    MAX_LENGTH: 254,
    MIN_LENGTH: 5,
    REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_DIGIT: true,
    REQUIRE_SPECIAL: true,
    FORBIDDEN_PATTERNS: [
      'password', '123456', 'qwerty', 'abc123', 'letmein',
      'welcome', 'monkey', 'dragon', 'master', 'admin'
    ],
    SPECIAL_CHARS: '@$!%*?&^#()_+-=[]{}|;:,.<>?'
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s'-]{1,50}$/
  },
  AGE: {
    MIN: 13,
    MAX: 120
  },
  WEIGHT: {
    MIN: 20, // kg
    MAX: 300 // kg
  },
  HEIGHT: {
    MIN: 100, // cm
    MAX: 250 // cm
  }
} as const;

// ============================================================================
// TYPES DE RÉSULTAT DE VALIDATION
// ============================================================================

/**
 * Résultat de validation générique
 */
export interface ValidationResult<T = unknown> {
  readonly isValid: boolean;
  readonly value?: T;
  readonly errors: ValidationError[];
}

/**
 * Erreur de validation détaillée
 */
export interface ValidationError {
  readonly field: string;
  readonly code: ValidationErrorCode;
  readonly message: string;
  readonly expected?: unknown;
  readonly actual?: unknown;
}

/**
 * Codes d'erreur de validation
 */
export enum ValidationErrorCode {
  REQUIRED = 'REQUIRED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_SMALL = 'TOO_SMALL',
  TOO_LARGE = 'TOO_LARGE',
  INVALID_PATTERN = 'INVALID_PATTERN',
  FORBIDDEN_VALUE = 'FORBIDDEN_VALUE',
  MISMATCH = 'MISMATCH',
  EXPIRED = 'EXPIRED',
  INVALID_ENUM = 'INVALID_ENUM'
}

// ============================================================================
// VALIDATEURS DE BASE
// ============================================================================

/**
 * Crée une erreur de validation
 */
const createValidationError = (
  field: string,
  code: ValidationErrorCode,
  message: string,
  expected?: unknown,
  actual?: unknown
): ValidationError => ({
  field,
  code,
  message,
  expected,
  actual
});

/**
 * Crée un résultat de validation réussi
 */
const createSuccessResult = <T>(value: T): ValidationResult<T> => ({
  isValid: true,
  value,
  errors: []
});

/**
 * Crée un résultat de validation échoué
 */
const createFailureResult = (errors: ValidationError[]): ValidationResult => ({
  isValid: false,
  errors
});

// ============================================================================
// VALIDATEURS SPÉCIFIQUES
// ============================================================================

/**
 * Valide et crée un email sécurisé
 */
export const validateEmail = (email: string): ValidationResult<ValidatedEmail> => {
  const errors: ValidationError[] = [];

  if (!email || typeof email !== 'string') {
    errors.push(createValidationError('email', ValidationErrorCode.REQUIRED, 'Email is required'));
    return createFailureResult(errors);
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedEmail.length < VALIDATION_CONSTANTS.EMAIL.MIN_LENGTH) {
    errors.push(createValidationError(
      'email',
      ValidationErrorCode.TOO_SHORT,
      `Email must be at least ${VALIDATION_CONSTANTS.EMAIL.MIN_LENGTH} characters`,
      VALIDATION_CONSTANTS.EMAIL.MIN_LENGTH,
      trimmedEmail.length
    ));
  }

  if (trimmedEmail.length > VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH) {
    errors.push(createValidationError(
      'email',
      ValidationErrorCode.TOO_LONG,
      `Email must be at most ${VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH} characters`,
      VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH,
      trimmedEmail.length
    ));
  }

  if (!VALIDATION_CONSTANTS.EMAIL.REGEX.test(trimmedEmail)) {
    errors.push(createValidationError(
      'email',
      ValidationErrorCode.INVALID_FORMAT,
      'Email format is invalid'
    ));
  }

  // Vérification de domaines suspects (basique)
  const suspiciousDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
  const domain = trimmedEmail.split('@')[1];
  if (domain && suspiciousDomains.includes(domain)) {
    errors.push(createValidationError(
      'email',
      ValidationErrorCode.FORBIDDEN_VALUE,
      'Temporary email addresses are not allowed'
    ));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(trimmedEmail as ValidatedEmail);
};

/**
 * Valide et crée un mot de passe sécurisé
 */
export const validatePassword = (password: string): ValidationResult<SecurePassword> => {
  const errors: ValidationError[] = [];

  if (!password || typeof password !== 'string') {
    errors.push(createValidationError('password', ValidationErrorCode.REQUIRED, 'Password is required'));
    return createFailureResult(errors);
  }

  if (password.length < VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH) {
    errors.push(createValidationError(
      'password',
      ValidationErrorCode.TOO_SHORT,
      `Password must be at least ${VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH} characters`,
      VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH,
      password.length
    ));
  }

  if (password.length > VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH) {
    errors.push(createValidationError(
      'password',
      ValidationErrorCode.TOO_LONG,
      `Password must be at most ${VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH} characters`,
      VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH,
      password.length
    ));
  }

  if (VALIDATION_CONSTANTS.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push(createValidationError(
      'password',
      ValidationErrorCode.INVALID_PATTERN,
      'Password must contain at least one lowercase letter'
    ));
  }

  if (VALIDATION_CONSTANTS.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push(createValidationError(
      'password',
      ValidationErrorCode.INVALID_PATTERN,
      'Password must contain at least one uppercase letter'
    ));
  }

  if (VALIDATION_CONSTANTS.PASSWORD.REQUIRE_DIGIT && !/\d/.test(password)) {
    errors.push(createValidationError(
      'password',
      ValidationErrorCode.INVALID_PATTERN,
      'Password must contain at least one digit'
    ));
  }

  if (VALIDATION_CONSTANTS.PASSWORD.REQUIRE_SPECIAL) {
    const specialCharsRegex = new RegExp(`[${VALIDATION_CONSTANTS.PASSWORD.SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (!specialCharsRegex.test(password)) {
      errors.push(createValidationError(
        'password',
        ValidationErrorCode.INVALID_PATTERN,
        `Password must contain at least one special character (${VALIDATION_CONSTANTS.PASSWORD.SPECIAL_CHARS})`
      ));
    }
  }

  // Vérification des patterns interdits
  const lowerPassword = password.toLowerCase();
  for (const forbidden of VALIDATION_CONSTANTS.PASSWORD.FORBIDDEN_PATTERNS) {
    if (lowerPassword.includes(forbidden)) {
      errors.push(createValidationError(
        'password',
        ValidationErrorCode.FORBIDDEN_VALUE,
        `Password cannot contain common patterns like "${forbidden}"`
      ));
    }
  }

  // Vérification de patterns répétitifs
  if (/(.)\1{2,}/.test(password)) {
    errors.push(createValidationError(
      'password',
      ValidationErrorCode.INVALID_PATTERN,
      'Password cannot contain more than 2 consecutive identical characters'
    ));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(password as SecurePassword);
};

/**
 * Valide un nom (prénom/nom de famille)
 */
export const validateName = (name: string, fieldName: string): ValidationResult<string> => {
  const errors: ValidationError[] = [];

  if (!name || typeof name !== 'string') {
    errors.push(createValidationError(fieldName, ValidationErrorCode.REQUIRED, `${fieldName} is required`));
    return createFailureResult(errors);
  }

  const trimmedName = name.trim();

  if (trimmedName.length < VALIDATION_CONSTANTS.NAME.MIN_LENGTH) {
    errors.push(createValidationError(
      fieldName,
      ValidationErrorCode.TOO_SHORT,
      `${fieldName} must be at least ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} character`,
      VALIDATION_CONSTANTS.NAME.MIN_LENGTH,
      trimmedName.length
    ));
  }

  if (trimmedName.length > VALIDATION_CONSTANTS.NAME.MAX_LENGTH) {
    errors.push(createValidationError(
      fieldName,
      ValidationErrorCode.TOO_LONG,
      `${fieldName} must be at most ${VALIDATION_CONSTANTS.NAME.MAX_LENGTH} characters`,
      VALIDATION_CONSTANTS.NAME.MAX_LENGTH,
      trimmedName.length
    ));
  }

  if (!VALIDATION_CONSTANTS.NAME.REGEX.test(trimmedName)) {
    errors.push(createValidationError(
      fieldName,
      ValidationErrorCode.INVALID_FORMAT,
      `${fieldName} contains invalid characters`
    ));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(trimmedName);
};

/**
 * Valide un User ID
 */
export const validateUserId = (id: string): ValidationResult<UserId> => {
  const errors: ValidationError[] = [];

  if (!id || typeof id !== 'string') {
    errors.push(createValidationError('userId', ValidationErrorCode.REQUIRED, 'User ID is required'));
    return createFailureResult(errors);
  }

  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    errors.push(createValidationError(
      'userId',
      ValidationErrorCode.INVALID_FORMAT,
      'User ID must be a valid UUID v4'
    ));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(id as UserId);
};

/**
 * Valide un JWT token
 */
export const validateJWTToken = (token: string): ValidationResult<JWTToken> => {
  const errors: ValidationError[] = [];

  if (!token || typeof token !== 'string') {
    errors.push(createValidationError('token', ValidationErrorCode.REQUIRED, 'Token is required'));
    return createFailureResult(errors);
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    errors.push(createValidationError(
      'token',
      ValidationErrorCode.INVALID_FORMAT,
      'Token must have 3 parts separated by dots'
    ));
    return createFailureResult(errors);
  }

  for (let i = 0; i < parts.length; i++) {
    if (!parts[i] || parts[i].length === 0) {
      errors.push(createValidationError(
        'token',
        ValidationErrorCode.INVALID_FORMAT,
        `Token part ${i + 1} is empty`
      ));
    }
  }

  // Validation basique de la structure Base64URL
  for (const part of parts) {
    if (!/^[A-Za-z0-9_-]+$/.test(part)) {
      errors.push(createValidationError(
        'token',
        ValidationErrorCode.INVALID_FORMAT,
        'Token contains invalid Base64URL characters'
      ));
      break;
    }
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(token as JWTToken);
};

/**
 * Valide un âge
 */
export const validateAge = (dateOfBirth: Date): ValidationResult<number> => {
  const errors: ValidationError[] = [];

  if (!dateOfBirth || !(dateOfBirth instanceof Date)) {
    errors.push(createValidationError('dateOfBirth', ValidationErrorCode.REQUIRED, 'Date of birth is required'));
    return createFailureResult(errors);
  }

  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const hasNotHadBirthdayThisYear = today.getMonth() < dateOfBirth.getMonth() || 
    (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate());
  
  const actualAge = hasNotHadBirthdayThisYear ? age - 1 : age;

  if (actualAge < VALIDATION_CONSTANTS.AGE.MIN) {
    errors.push(createValidationError(
      'age',
      ValidationErrorCode.TOO_SMALL,
      `You must be at least ${VALIDATION_CONSTANTS.AGE.MIN} years old`,
      VALIDATION_CONSTANTS.AGE.MIN,
      actualAge
    ));
  }

  if (actualAge > VALIDATION_CONSTANTS.AGE.MAX) {
    errors.push(createValidationError(
      'age',
      ValidationErrorCode.TOO_LARGE,
      `Age cannot exceed ${VALIDATION_CONSTANTS.AGE.MAX} years`,
      VALIDATION_CONSTANTS.AGE.MAX,
      actualAge
    ));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(actualAge);
};

/**
 * Valide les mesures physiques
 */
export const validatePhysicalMeasurements = (weight?: number, height?: number): ValidationResult<{ weight?: number; height?: number }> => {
  const errors: ValidationError[] = [];

  if (weight !== undefined) {
    if (typeof weight !== 'number' || isNaN(weight)) {
      errors.push(createValidationError('weight', ValidationErrorCode.INVALID_FORMAT, 'Weight must be a valid number'));
    } else if (weight < VALIDATION_CONSTANTS.WEIGHT.MIN) {
      errors.push(createValidationError(
        'weight',
        ValidationErrorCode.TOO_SMALL,
        `Weight must be at least ${VALIDATION_CONSTANTS.WEIGHT.MIN} kg`,
        VALIDATION_CONSTANTS.WEIGHT.MIN,
        weight
      ));
    } else if (weight > VALIDATION_CONSTANTS.WEIGHT.MAX) {
      errors.push(createValidationError(
        'weight',
        ValidationErrorCode.TOO_LARGE,
        `Weight cannot exceed ${VALIDATION_CONSTANTS.WEIGHT.MAX} kg`,
        VALIDATION_CONSTANTS.WEIGHT.MAX,
        weight
      ));
    }
  }

  if (height !== undefined) {
    if (typeof height !== 'number' || isNaN(height)) {
      errors.push(createValidationError('height', ValidationErrorCode.INVALID_FORMAT, 'Height must be a valid number'));
    } else if (height < VALIDATION_CONSTANTS.HEIGHT.MIN) {
      errors.push(createValidationError(
        'height',
        ValidationErrorCode.TOO_SMALL,
        `Height must be at least ${VALIDATION_CONSTANTS.HEIGHT.MIN} cm`,
        VALIDATION_CONSTANTS.HEIGHT.MIN,
        height
      ));
    } else if (height > VALIDATION_CONSTANTS.HEIGHT.MAX) {
      errors.push(createValidationError(
        'height',
        ValidationErrorCode.TOO_LARGE,
        `Height cannot exceed ${VALIDATION_CONSTANTS.HEIGHT.MAX} cm`,
        VALIDATION_CONSTANTS.HEIGHT.MAX,
        height
      ));
    }
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult({ weight, height });
};

// ============================================================================
// VALIDATEURS COMPOSÉS
// ============================================================================

/**
 * Valide complètement une requête d'inscription
 */
export const validateSignUpRequest = (request: Partial<SignUpRequest>): ValidationResult<SignUpRequest> => {
  const errors: ValidationError[] = [];

  // Validation email
  if (request.email) {
    const emailResult = validateEmail(request.email);
    if (!emailResult.isValid) {
      errors.push(...emailResult.errors);
    }
  } else {
    errors.push(createValidationError('email', ValidationErrorCode.REQUIRED, 'Email is required'));
  }

  // Validation password
  if (request.password) {
    const passwordResult = validatePassword(request.password);
    if (!passwordResult.isValid) {
      errors.push(...passwordResult.errors);
    }
  } else {
    errors.push(createValidationError('password', ValidationErrorCode.REQUIRED, 'Password is required'));
  }

  // Validation firstName
  if (request.firstName) {
    const firstNameResult = validateName(request.firstName, 'firstName');
    if (!firstNameResult.isValid) {
      errors.push(...firstNameResult.errors);
    }
  } else {
    errors.push(createValidationError('firstName', ValidationErrorCode.REQUIRED, 'First name is required'));
  }

  // Validation lastName
  if (request.lastName) {
    const lastNameResult = validateName(request.lastName, 'lastName');
    if (!lastNameResult.isValid) {
      errors.push(...lastNameResult.errors);
    }
  } else {
    errors.push(createValidationError('lastName', ValidationErrorCode.REQUIRED, 'Last name is required'));
  }

  // Validation date of birth (optionnelle)
  if (request.dateOfBirth) {
    const ageResult = validateAge(request.dateOfBirth);
    if (!ageResult.isValid) {
      errors.push(...ageResult.errors);
    }
  }

  // Validation gender (optionnelle)
  if (request.gender && !Object.values(Gender).includes(request.gender)) {
    errors.push(createValidationError(
      'gender',
      ValidationErrorCode.INVALID_ENUM,
      'Invalid gender value',
      Object.values(Gender),
      request.gender
    ));
  }

  // Validation acceptation des termes
  if (!request.acceptsTerms) {
    errors.push(createValidationError('acceptsTerms', ValidationErrorCode.REQUIRED, 'You must accept the terms of service'));
  }

  if (!request.acceptsPrivacy) {
    errors.push(createValidationError('acceptsPrivacy', ValidationErrorCode.REQUIRED, 'You must accept the privacy policy'));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(request as SignUpRequest);
};

/**
 * Valide une requête de connexion
 */
export const validateSignInRequest = (request: Partial<SignInRequest>): ValidationResult<SignInRequest> => {
  const errors: ValidationError[] = [];

  // Validation email
  if (request.email) {
    const emailResult = validateEmail(request.email);
    if (!emailResult.isValid) {
      errors.push(...emailResult.errors);
    }
  } else {
    errors.push(createValidationError('email', ValidationErrorCode.REQUIRED, 'Email is required'));
  }

  // Validation password (moins stricte pour la connexion)
  if (!request.password || typeof request.password !== 'string' || request.password.length === 0) {
    errors.push(createValidationError('password', ValidationErrorCode.REQUIRED, 'Password is required'));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(request as SignInRequest);
};

/**
 * Valide une mise à jour de profil
 */
export const validateUserProfileUpdate = (update: UserProfileUpdate): ValidationResult<UserProfileUpdate> => {
  const errors: ValidationError[] = [];

  // Validation firstName (optionnelle)
  if (update.firstName !== undefined) {
    const firstNameResult = validateName(update.firstName, 'firstName');
    if (!firstNameResult.isValid) {
      errors.push(...firstNameResult.errors);
    }
  }

  // Validation lastName (optionnelle)
  if (update.lastName !== undefined) {
    const lastNameResult = validateName(update.lastName, 'lastName');
    if (!lastNameResult.isValid) {
      errors.push(...lastNameResult.errors);
    }
  }

  // Validation mesures physiques
  if (update.weight !== undefined || update.height !== undefined) {
    const measurementsResult = validatePhysicalMeasurements(update.weight, update.height);
    if (!measurementsResult.isValid) {
      errors.push(...measurementsResult.errors);
    }
  }

  // Validation date of birth
  if (update.dateOfBirth !== undefined) {
    const ageResult = validateAge(update.dateOfBirth);
    if (!ageResult.isValid) {
      errors.push(...ageResult.errors);
    }
  }

  // Validation gender
  if (update.gender && !Object.values(Gender).includes(update.gender)) {
    errors.push(createValidationError(
      'gender',
      ValidationErrorCode.INVALID_ENUM,
      'Invalid gender value',
      Object.values(Gender),
      update.gender
    ));
  }

  // Validation activity level
  if (update.activityLevel && !Object.values(ActivityLevel).includes(update.activityLevel)) {
    errors.push(createValidationError(
      'activityLevel',
      ValidationErrorCode.INVALID_ENUM,
      'Invalid activity level value',
      Object.values(ActivityLevel),
      update.activityLevel
    ));
  }

  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  return createSuccessResult(update);
};

// ============================================================================
// UTILITAIRES DE CONVERSION D'ERREURS
// ============================================================================

/**
 * Convertit les erreurs de validation en AuthError
 */
export const convertValidationErrorsToAuthError = (
  validationErrors: ValidationError[],
  requestId: string = crypto.randomUUID()
): AuthError => ({
  code: AuthErrorCode.INVALID_SIGNUP_DATA,
  message: 'Validation failed',
  details: {
    validationErrors,
    fieldCount: validationErrors.length
  },
  timestamp: new Date(),
  requestId
});

/**
 * Extrait le premier message d'erreur pour l'affichage utilisateur
 */
export const getFirstValidationErrorMessage = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';
  return errors[0].message;
};

/**
 * Groupe les erreurs par champ
 */
export const groupValidationErrorsByField = (errors: ValidationError[]): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};