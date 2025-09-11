// Date utilities exports
export { 
  formatDate, 
  formatRelativeDate,
  formatTime, 
  formatDateTime, 
  getToday,
  getDateRange,
  calculateAge,
  formatDuration,
  formatSeconds,
  getCurrentWeekDays,
  getMonthDays
} from './date.utils';

// Format utilities exports
export { 
  formatNumber, 
  formatPercentage,
  formatCalories,
  formatWeight,
  formatWater,
  formatDistance,
  formatSpeed,
  formatPace,
  formatMacro,
  capitalize,
  truncate,
  formatFullName,
  snakeToCamel,
  camelToSnake,
  slugify,
  formatCompactNumber,
  formatScore,
  formatCurrency
} from './format.utils';

// Storage utilities exports
export { 
  Storage,
  type StorageItem
} from './storage.utils';

// Validation utilities exports
export { 
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  isValidPhoneNumber,
  isValidAge,
  isValidWeight,
  isValidHeight,
  isValidUrl,
  validationMessages,
  FormValidator,
  validateForm
} from './validation.utils';
