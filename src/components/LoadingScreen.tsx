import React from 'react';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Chargement en cours...",
  showProgress = false 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* Logo MyFitHero */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">MFH</span>
          </div>
        </div>
        
        {/* Spinner animé */}
        <div className="relative mb-6">
          <div className="w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-gray-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
        </div>
        
        {/* Texte de chargement */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          MyFitHero
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
        
        {/* Barre de progression optionnelle */}
        {showProgress && (
          <div className="mt-4 w-64 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
