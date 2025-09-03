// Formatage des nombres
export const formatNumber = (
  num: number,
  decimals: number = 0,
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Formatage des pourcentages
export const formatPercentage = (
  value: number,
  decimals: number = 0,
  showSign: boolean = false
): string => {
  const formatted = `${formatNumber(value, decimals)}%`;
  if (showSign && value > 0) return `+${formatted}`;
  return formatted;
};

// Formatage des calories
export const formatCalories = (calories: number): string => {
  if (calories >= 1000) {
    return `${formatNumber(calories / 1000, 1)}k`;
  }
  return formatNumber(calories);
};

// Formatage des poids
export const formatWeight = (weight: number, unit: 'kg' | 'g' = 'kg'): string => {
  if (unit === 'g') {
    if (weight >= 1000) {
      return `${formatNumber(weight / 1000, 1)} kg`;
    }
    return `${formatNumber(weight)} g`;
  }
  return `${formatNumber(weight, 1)} kg`;
};

// Formatage de l'hydratation
export const formatWater = (ml: number): string => {
  if (ml >= 1000) {
    return `${formatNumber(ml / 1000, 1)} L`;
  }
  return `${formatNumber(ml)} ml`;
};

// Formatage des distances
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${formatNumber(meters / 1000, 1)} km`;
  }
  return `${formatNumber(meters)} m`;
};

// Formatage de la vitesse
export const formatSpeed = (kmh: number): string => {
  return `${formatNumber(kmh, 1)} km/h`;
};

// Formatage du rythme (min/km)
export const formatPace = (secondsPerKm: number): string => {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
};

// Formatage des macros avec unité
export const formatMacro = (value: number, type: 'protein' | 'carbs' | 'fat'): string => {
  return `${formatNumber(value, 1)}g`;
};

// Capitalisation première lettre
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Troncature de texte
export const truncate = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Formatage du nom complet
export const formatFullName = (firstName?: string, lastName?: string): string => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.map(capitalize).join(' ');
};

// Conversion snake_case vers camelCase
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Conversion camelCase vers snake_case
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Format pour les URLs (slug)
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Formatage des nombres pour l'affichage (K, M)
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${formatNumber(num / 1000000, 1)}M`;
  }
  if (num >= 1000) {
    return `${formatNumber(num / 1000, 1)}K`;
  }
  return formatNumber(num);
};

// Formatage du score (0-100)
export const formatScore = (score: number): string => {
  return `${Math.round(Math.max(0, Math.min(100, score)))}/100`;
};

// Formatage de la monnaie
export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};
