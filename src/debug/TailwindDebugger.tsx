import React from 'react';

// Composant de test pour vérifier Tailwind CSS
export const TailwindDebugger: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">🔧 Tailwind CSS Debug</h1>
        
        {/* Test des couleurs de base */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Couleurs de base Tailwind</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-red-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Red 500
            </div>
            <div className="bg-blue-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Blue 500
            </div>
            <div className="bg-green-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Green 500
            </div>
            <div className="bg-purple-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Purple 500
            </div>
          </div>
        </section>

        {/* Test des couleurs custom MyFitHero */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🎨 Couleurs Custom MyFitHero</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Primary 500
            </div>
            <div className="bg-cardio-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Cardio 500
            </div>
            <div className="bg-strength-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Strength 500
            </div>
            <div className="bg-recovery-500 h-16 rounded flex items-center justify-center text-white font-medium">
              Recovery 500
            </div>
          </div>
        </section>

        {/* Test des nuances primary */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">💜 Nuances Primary (Violet MyFitHero)</h2>
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
              <div 
                key={shade}
                className={`bg-primary-${shade} h-12 rounded flex items-center justify-center text-xs font-medium ${
                  shade >= 500 ? 'text-white' : 'text-gray-800'
                }`}
              >
                {shade}
              </div>
            ))}
          </div>
        </section>

        {/* Test des animations custom */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🎬 Animations Custom</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-500 h-16 rounded flex items-center justify-center text-white font-medium animate-workout-pulse">
              Workout Pulse
            </div>
            <div className="bg-cardio-500 h-16 rounded flex items-center justify-center text-white font-medium animate-pulse-fast">
              Pulse Fast
            </div>
            <div className="bg-recovery-500 h-16 rounded flex items-center justify-center text-white font-medium animate-bounce-subtle">
              Bounce Subtle
            </div>
          </div>
        </section>

        {/* Test des gradients */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">🌈 Gradients Custom</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-primary h-16 rounded flex items-center justify-center text-white font-medium">
              Gradient Primary
            </div>
            <div className="bg-gradient-secondary h-16 rounded flex items-center justify-center text-white font-medium">
              Gradient Secondary
            </div>
            <div className="bg-gradient-success h-16 rounded flex items-center justify-center text-white font-medium">
              Gradient Success
            </div>
            <div className="bg-gradient-error h-16 rounded flex items-center justify-center text-white font-medium">
              Gradient Error
            </div>
          </div>
        </section>

        {/* Test des tailles typography */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">📝 Typographie Custom</h2>
          <div className="space-y-4">
            <div className="text-metric-sm text-primary-600 font-semibold">
              Metric Small (2rem): 123
            </div>
            <div className="text-metric-md text-cardio-600 font-bold">
              Metric Medium (3rem): 456
            </div>
            <div className="text-metric-lg text-strength-600 font-extrabold">
              Metric Large (4rem): 789
            </div>
            <div className="text-metric-xl text-recovery-600 font-black">
              Metric XL (6rem): 999
            </div>
          </div>
        </section>

        {/* Test des ombres custom */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">✨ Ombres Custom</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow-glow border border-primary-200">
              <div className="text-center font-medium">Shadow Glow</div>
            </div>
            <div className="bg-white p-4 rounded shadow-glow-lg border border-primary-200">
              <div className="text-center font-medium">Shadow Glow Large</div>
            </div>
            <div className="bg-primary-500 p-4 rounded shadow-large text-white">
              <div className="text-center font-medium">Shadow Large</div>
            </div>
          </div>
        </section>

        {/* Status de compilation */}
        <section className="bg-primary-50 border border-primary-200 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary-800">📊 Status Compilation</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">PostCSS Config:</span>
              <span className="text-green-600 font-semibold">✅ Créé</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tailwind Base:</span>
              <span className={`font-semibold ${getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? 'text-green-600' : 'text-red-600'}`}>
                {getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? '✅ Actif' : '❌ Inactif'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Couleurs Custom:</span>
              <span className="text-primary-600 font-semibold">🎨 Test ci-dessus</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TailwindDebugger;