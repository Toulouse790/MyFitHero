export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Votre vue d'ensemble sur vos progrès et activités
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Entraînements</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Module d'entraînement en cours de développement...
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Nutrition</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Module de nutrition en cours de développement...
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Analytiques</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Module d'analyse en cours de développement...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
