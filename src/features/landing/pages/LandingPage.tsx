import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MyFitHero
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Votre compagnon intelligent pour une vie plus saine. 
            Suivez vos progrès, obtenez des conseils personnalisés et atteignez vos objectifs.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/features')}
            >
              Découvrir les fonctionnalités
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">🏋️ Entraînement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Suivez vos séances d'entraînement avec des programmes personnalisés 
                et des conseils d'experts.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">🥗 Nutrition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gérez votre alimentation avec des recommandations nutritionnelles 
                adaptées à vos objectifs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">😴 Récupération</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Optimisez votre sommeil et votre récupération pour des performances maximales.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à transformer votre vie ?
          </h2>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-green-600 hover:bg-green-700"
          >
            Rejoindre MyFitHero
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;