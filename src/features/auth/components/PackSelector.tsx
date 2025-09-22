import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Check, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  SMART_PACKS, 
  getRecommendedPacks, 
  getPopularPacks, 
  SmartPack 
} from '@/features/auth/data/smartPacks';

interface UserProfile {
  age?: number;
  sport?: string;
  objectives?: string[];
  experience?: string;
  availability?: string;
  healthConditions?: string[];
  wantedFeatures?: string[];
}

interface PackSelectorProps {
  userProfile: UserProfile;
  selectedPack?: string;
  onPackSelect: (pack: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
  className?: string;
}

const PackSelector: React.FC<PackSelectorProps> = ({
  userProfile,
  selectedPack,
  onPackSelect,
  onBack,
  onSkip,
  className = ''
}) => {
  const [selectedPackId, setSelectedPackId] = useState<string>(selectedPack || '');
  const [showAllPacks, setShowAllPacks] = useState(false);

  // Obtenir les recommandations personnalisées
  const recommendations = useMemo(() => {
    return getRecommendedPacks(userProfile);
  }, [userProfile]);

  // Packs populaires
  const popularPacks = useMemo(() => getPopularPacks(3), []);

  // Tous les packs pour affichage complet
  const allPacks = useMemo(() => SMART_PACKS, []);

  function handlePackSelect(packId: string) {
    setSelectedPackId(packId);
    onPackSelect(packId);
  }

  function getPackDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  function getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return difficulty;
    }
  }

  function renderPackCard(pack: SmartPack, isRecommended = false, score?: number, reasons?: string[]) {
    return (
      <Card 
        key={pack.id}
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selectedPackId === pack.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        } ${isRecommended ? 'border-2 border-blue-200' : ''}`}
        onClick={() => handlePackSelect(pack.id)}
      >
        {/* Badge recommandé */}
        {isRecommended && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-blue-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Recommandé
            </Badge>
          </div>
        )}

        <CardHeader className={`pb-4 ${pack.color} text-white rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{pack.icon}</span>
              <div>
                <CardTitle className="text-white">{pack.name}</CardTitle>
                <p className="text-white/90 text-sm">{pack.title}</p>
              </div>
            </div>
            <div className="text-right">
              {score && (
                <div className="text-white/90">
                  <div className="text-2xl font-bold">{score}%</div>
                  <div className="text-xs">Match</div>
                </div>
              )}
              <Badge 
                variant="secondary" 
                className={`${getPackDifficultyColor(pack.difficulty)} border-white/20`}
              >
                {getDifficultyLabel(pack.difficulty)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Description */}
          <p className="text-gray-600 text-sm">{pack.description}</p>

          {/* Raisons de recommandation */}
          {reasons && reasons.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-700">Pourquoi ce pack vous correspond :</p>
              <div className="space-y-1">
                {reasons.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fonctionnalités principales */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Fonctionnalités incluses :</p>
            <div className="flex flex-wrap gap-1">
              {pack.features.slice(0, 4).map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {pack.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{pack.features.length - 4} autres
                </Badge>
              )}
            </div>
          </div>

          {/* Modules inclus */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Modules :</p>
            <div className="flex flex-wrap gap-1">
              {pack.modules.map((module) => (
                <Badge key={module} variant="secondary" className="text-xs">
                  {getModuleIcon(module)} {getModuleLabel(module)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{pack.estimatedTime} min</span>
              </div>
              <p className="text-xs text-gray-500">Configuration</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{pack.popularity}%</span>
              </div>
              <p className="text-xs text-gray-500">Popularité</p>
            </div>
          </div>

          {/* Exemples d'usage */}
          {pack.examples && pack.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Exemples d'usage :</p>
              <div className="space-y-1">
                {pack.examples.slice(0, 2).map((example, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Public cible */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Idéal pour :</p>
            <div className="flex flex-wrap gap-1">
              {pack.targetAudience.slice(0, 3).map((audience) => (
                <Badge key={audience} variant="outline" className="text-xs text-blue-600">
                  <Users className="w-3 h-3 mr-1" />
                  {audience}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function getModuleIcon(module: string): string {
    const icons: Record<string, string> = {
      workout: '💪',
      nutrition: '🥗',
      recovery: '🛌',
      sleep: '😴',
      hydration: '💧',
      mental: '🧠',
      analytics: '📊',
      social: '👥',
      health: '❤️'
    };
    return icons[module] || '📱';
  }

  function getModuleLabel(module: string): string {
    const labels: Record<string, string> = {
      workout: 'Entraînement',
      nutrition: 'Nutrition',
      recovery: 'Récupération',
      sleep: 'Sommeil',
      hydration: 'Hydratation',
      mental: 'Mental',
      analytics: 'Analytics',
      social: 'Social',
      health: 'Santé'
    };
    return labels[module] || module;
  }

  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Zap className="w-7 h-7 text-blue-600" />
          Choisissez votre pack intelligent
        </h2>
        <p className="text-gray-600">
          Nous avons analysé vos préférences pour vous recommander les meilleurs packs
        </p>
      </div>

      {/* Informations utilisateur */}
      {Object.keys(userProfile).length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-blue-800 font-medium">
                  Profil détecté :
                </p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.age && (
                    <Badge variant="outline" className="text-blue-700">
                      {userProfile.age} ans
                    </Badge>
                  )}
                  {userProfile.sport && (
                    <Badge variant="outline" className="text-blue-700">
                      {userProfile.sport}
                    </Badge>
                  )}
                  {userProfile.experience && (
                    <Badge variant="outline" className="text-blue-700">
                      {userProfile.experience}
                    </Badge>
                  )}
                  {userProfile.availability && (
                    <Badge variant="outline" className="text-blue-700">
                      {userProfile.availability}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Packs recommandés */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Recommandations personnalisées
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => 
              renderPackCard(rec.pack, true, rec.score, rec.reasons)
            )}
          </div>
        </div>
      )}

      {/* Packs populaires */}
      {!showAllPacks && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Packs populaires
              </h3>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllPacks(true)}
              className="flex items-center gap-2"
            >
              Voir tous les packs
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPacks
              .filter(pack => !recommendations.some(rec => rec.pack.id === pack.id))
              .map((pack) => renderPackCard(pack))
            }
          </div>
        </div>
      )}

      {/* Tous les packs */}
      {showAllPacks && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Tous les packs disponibles ({allPacks.length})
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllPacks(false)}
            >
              Masquer
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPacks
              .filter(pack => !recommendations.some(rec => rec.pack.id === pack.id))
              .map((pack) => renderPackCard(pack))
            }
          </div>
        </div>
      )}

      {/* Pack personnalisé */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pack personnalisé</h3>
              <p className="text-sm text-gray-600">
                Créez votre propre combinaison de modules
              </p>
            </div>
            <Button 
              variant={selectedPackId === 'custom' ? "default" : "outline"}
              onClick={() => handlePackSelect('custom')}
            >
              Créer un pack personnalisé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Retour
            </Button>
          )}
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Passer cette étape
            </Button>
          )}
        </div>
        
        {selectedPackId && (
          <Button onClick={() => onPackSelect(selectedPackId)}>
            Continuer avec ce pack
          </Button>
        )}
      </div>
    </div>
  );
};

export default PackSelector;