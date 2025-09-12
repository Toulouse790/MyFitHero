// src/shared/utils/sportMapping.ts

export type HydrationSportCategory = 'endurance' | 'contact' | 'court' | 'strength';
export type NutritionSport = 'basketball' | 'tennis' | 'american_football' | 'football' | 'endurance' | 'strength';
export type SleepSportCategory = 'contact' | 'team' | 'precision' | 'endurance';

// Mapping pour HydrationPage
export const getSportCategoryForHydration = (sport: string | null | undefined): HydrationSportCategory => {
  const sportMappings: Record<string, HydrationSportCategory> = {
    basketball: 'court',
    tennis: 'court',
    volleyball: 'court',
    badminton: 'court',
    american_football: 'contact',
    rugby: 'contact',
    hockey: 'contact',
    football: 'endurance',
    running: 'endurance',
    cycling: 'endurance',
    swimming: 'endurance',
    triathlon: 'endurance',
    'course à pied': 'endurance',
    musculation: 'strength',
    powerlifting: 'strength',
    crossfit: 'strength',
    weightlifting: 'strength',
  };

  return sportMappings[sport?.toLowerCase() || ''] || 'strength';
};

// Mapping pour NutritionPage
export const getSportCategoryForNutrition = (sport: string): NutritionSport => {
  const mappings: Record<string, NutritionSport> = {
    basketball: 'basketball',
    tennis: 'tennis',
    american_football: 'american_football',
    football: 'football',
    running: 'endurance',
    cycling: 'endurance',
    swimming: 'endurance',
    'course à pied': 'endurance',
    musculation: 'strength',
    powerlifting: 'strength',
    crossfit: 'strength',
    weightlifting: 'strength',
  };
  return mappings[sport?.toLowerCase()] || 'strength';
};

// Mapping pour SleepPage
export const getSportCategoryForSleep = (sport: string): SleepSportCategory => {
  const mappings: Record<string, SleepSportCategory> = {
    american_football: 'contact',
    rugby: 'contact',
    hockey: 'contact',
    boxing: 'contact',
    mma: 'contact',
    basketball: 'team',
    football: 'team',
    volleyball: 'team',
    handball: 'team',
    tennis: 'precision',
    golf: 'precision',
    snooker: 'precision',
    archery: 'precision',
    esports: 'precision',
    running: 'endurance',
    cycling: 'endurance',
    swimming: 'endurance',
    triathlon: 'endurance',
    'course à pied': 'endurance',
  };
  return mappings[sport?.toLowerCase()] || 'team';
};