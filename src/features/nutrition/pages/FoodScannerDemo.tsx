import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FoodScanner } from '../components/FoodScanner';
import { useFoodScanner } from '../hooks/useFoodScanner';
import { Camera, Utensils, TrendingUp, History, Star } from 'lucide-react';

/**
 * Page de démonstration du Food Scanner
 * Intègre tous les composants de scan photo nutrition
 */
const FoodScannerDemo: React.FC = () => {
  const {
    scanHistory,
    loadScanHistory,
    removeScanFromHistory,
    isLoading
  } = useFoodScanner();

  React.useEffect(() => {
    loadScanHistory();
  }, [loadScanHistory]);

  // Données de démonstration pour montrer les capacités
  const demoFoods = [
    {
      name: 'Grilled Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      confidence: 0.95,
      image: '🍗'
    },
    {
      name: 'Avocado Toast',
      calories: 234,
      protein: 6,
      carbs: 16,
      fat: 18,
      confidence: 0.89,
      image: '🥑'
    },
    {
      name: 'Greek Yogurt Bowl',
      calories: 150,
      protein: 20,
      carbs: 8,
      fat: 4,
      confidence: 0.92,
      image: '🥣'
    }
  ];

  const features = [
    {
      icon: Camera,
      title: 'Scan Instantané',
      description: 'Prenez une photo ou uploadez une image pour identifier instantanément vos aliments'
    },
    {
      icon: Utensils,
      title: 'Base USDA',
      description: 'Données nutritionnelles officielles du gouvernement américain'
    },
    {
      icon: TrendingUp,
      title: 'IA Avancée',
      description: 'Reconnaissance alimentaire avec OpenAI Vision et Google Vision'
    },
    {
      icon: History,
      title: 'Historique',
      description: 'Gardez une trace de tous vos scans pour un suivi alimentaire optimal'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Camera className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Food Scanner AI
          </h1>
          <Badge className="bg-yellow-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            FEATURE STAR
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Révolutionnez votre suivi nutritionnel avec notre scanner alimentaire IA. 
          Prenez une photo, obtenez instantanément les informations nutritionnelles précises.
        </p>
      </div>

      <Tabs defaultValue="scanner" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="demo">Démo</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
        </TabsList>

        {/* Scanner Principal */}
        <TabsContent value="scanner" className="space-y-6">
          <FoodScanner />
        </TabsContent>

        {/* Démonstration */}
        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemples de Reconnaissance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {demoFoods.map((food, index) => (
                  <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{food.image}</div>
                      <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="font-bold text-blue-600">{food.calories}</div>
                          <div className="text-blue-800">Calories</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="font-bold text-green-600">{food.protein}g</div>
                          <div className="text-green-800">Protéines</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="font-bold text-yellow-600">{food.carbs}g</div>
                          <div className="text-yellow-800">Glucides</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <div className="font-bold text-red-600">{food.fat}g</div>
                          <div className="text-red-800">Lipides</div>
                        </div>
                      </div>
                      
                      <Badge className="bg-green-500 text-white">
                        Confiance: {Math.round(food.confidence * 100)}%
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique des scans */}
        <TabsContent value="historique" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Historique des Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : scanHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun scan dans l'historique. Commencez par scanner un aliment !
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{scan.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{scan.calories} cal</span>
                          <span>{scan.protein}g protéines</span>
                          <span>{scan.carbs}g glucides</span>
                          <span>{scan.fat}g lipides</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {Math.round(scan.confidence * 100)}%
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => scan.analysis_id && removeScanFromHistory(scan.analysis_id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fonctionnalités */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Spécifications techniques */}
          <Card>
            <CardHeader>
              <CardTitle>Spécifications Techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">IA de Reconnaissance</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• OpenAI GPT-4 Vision</li>
                    <li>• Google Vision API</li>
                    <li>• Confiance &gt; 70% requis</li>
                    <li>• Support multi-aliments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Base Nutritionnelle</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• USDA FoodData Central</li>
                    <li>• +350,000 aliments</li>
                    <li>• Données officielles US</li>
                    <li>• Mise à jour continue</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Formats Supportés</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• JPEG, PNG, WebP</li>
                    <li>• Maximum 10MB</li>
                    <li>• Résolution optimale 1280x720</li>
                    <li>• Caméra mobile/desktop</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Précision</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 95% aliments courants US</li>
                    <li>• 87% plats préparés</li>
                    <li>• 92% fruits/légumes</li>
                    <li>• Amélioration continue</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à Révolutionner Votre Nutrition ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers d'Américains qui utilisent déjà MyFitHero pour 
            transformer leur approche de la nutrition avec l'IA.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Commencer Maintenant
            </Button>
            <Button size="lg" variant="outline">
              Voir la Démo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodScannerDemo;