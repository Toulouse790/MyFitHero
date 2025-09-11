import React from 'react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MyFitHero
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Votre coach personnel pour atteindre vos objectifs
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connexion</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Interface d'authentification en cours de développement...
          </p>
        </div>
      </div>
    </div>
  );
}
