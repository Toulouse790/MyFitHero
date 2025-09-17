import { useState, useEffect } from 'react';

interface UnitPreferences {
  weight: 'kg' | 'lbs';
  height: 'cm' | 'ft' | 'ft/in';
  distance: 'km' | 'mi';
  liquid: 'ml' | 'fl_oz';
  temperature: 'celsius' | 'fahrenheit';
}

const defaultPreferences: UnitPreferences = {
  weight: 'kg',
  height: 'cm', 
  distance: 'km',
  liquid: 'ml',
  temperature: 'celsius'
};

export const useUnitPreferences = () => {
  const [preferences, setPreferences] = useState<UnitPreferences>(defaultPreferences);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('unitPreferences');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading unit preferences:', error);
      }
    }
  }, []);

  const updatePreferences = (updates: Partial<UnitPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('unitPreferences', JSON.stringify(newPreferences));
  };

  const resetToDefault = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('unitPreferences', JSON.stringify(defaultPreferences));
  };

  return {
    preferences,
    updatePreferences,
    resetToDefault
  };
};