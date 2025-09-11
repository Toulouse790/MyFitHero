export default function OnboardingFlow() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenue dans MyFitHero
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configurons votre profil pour une expérience personnalisée
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Processus d'onboarding</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Interface d'onboarding en cours de développement...
          </p>
        </div>
      </div>
    </div>
  );
}
