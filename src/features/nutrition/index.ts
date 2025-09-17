// Export de la feature nutrition
export * from './components';
export * from './types';
export * from './services/nutrition-mapping';
export * from './services/foodRecognition';
export * from './hooks/useFoodPhotoAnalysis';

// Hooks spécialisés
export { useFoodScanner, useCameraCapture } from './hooks/useFoodScanner';

// Pages
export { default as NutritionPage } from './pages/NutritionPage';
export { default as FoodScannerDemo } from './pages/FoodScannerDemo';

// Services
export { default as FoodVisionService } from './services/foodVisionService';
export { default as USDANutritionService } from './services/usdaService';
export { default as MockFoodVisionService } from './services/mockFoodVisionService';