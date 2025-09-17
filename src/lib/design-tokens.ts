/**
 * Design Tokens - MyFitHero UI System
 * Standardise les tailles, espaces et couleurs de tous les composants
 */

// Hauteurs standardisées pour tous les composants
export const heights = {
  sm: 'h-10',     // 40px - Taille petite
  default: 'h-12', // 48px - Taille par défaut (tous les inputs/buttons/selects)
  lg: 'h-14',     // 56px - Taille grande
} as const;

// Rayons de bordure standardisés
export const radius = {
  sm: 'rounded-lg',   // 8px
  default: 'rounded-xl', // 12px - Défaut pour inputs/buttons
  lg: 'rounded-2xl',  // 16px
  full: 'rounded-full',
} as const;

// Espacements standardisés
export const spacing = {
  xs: 'px-2 py-1',
  sm: 'px-3 py-2',
  default: 'px-4 py-2', // Défaut pour inputs/buttons
  lg: 'px-6 py-3',
  xl: 'px-8 py-4',
} as const;

// Classes de base communes à tous les form controls
export const formControlBase = 
  'flex w-full items-center transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

// Classes de base pour les états interactifs
export const interactiveBase = 
  'transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

// Variantes de couleurs standardisées
export const colorVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
} as const;

// Configuration cohérente pour inputs
export const inputConfig = {
  base: formControlBase,
  size: heights.default,
  radius: radius.default,
  padding: spacing.default,
  border: 'border border-input bg-background',
} as const;

// Configuration cohérente pour buttons
export const buttonConfig = {
  base: interactiveBase + ' inline-flex items-center justify-center whitespace-nowrap text-sm font-medium',
  size: heights.default,
  radius: radius.default,
  padding: spacing.default,
} as const;

// Utilitaire pour créer des classes cohérentes
export const createComponentClasses = (
  base: string,
  variant?: keyof typeof colorVariants,
  size?: keyof typeof heights,
  customRadius?: keyof typeof radius
) => {
  const sizeClass = size ? heights[size] : heights.default;
  const radiusClass = customRadius ? radius[customRadius] : radius.default;
  const variantClass = variant ? colorVariants[variant] : '';
  
  return `${base} ${sizeClass} ${radiusClass} ${variantClass}`.trim();
};

export type HeightVariant = keyof typeof heights;
export type RadiusVariant = keyof typeof radius;
export type SpacingVariant = keyof typeof spacing;
export type ColorVariant = keyof typeof colorVariants;