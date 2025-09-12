import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Info, MapPin, Target, TrendingUp } from 'lucide-react';
import { getSportById, getPositionsForSport } from '../data/onboardingData';

interface PositionSelectorProps {
  sport: string;
  selectedPosition?: string;
  onPositionSelect: (position: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
  className?: string;
}

interface PositionInfo {
  name: string;
  description: string;
  characteristics: string[];
  physicalDemands: string[];
  skills: string[];
  icon: string;
  popularity?: number;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({
  sport,
  selectedPosition,
  onPositionSelect,
  onBack,
  onSkip,
  className = ''
}) => {
  const [selectedPos, setSelectedPos] = useState<string>(selectedPosition || '');

  // Récupérer les informations du sport
  const sportInfo = useMemo(() => getSportById(sport), [sport]);
  
  // Récupérer les positions disponibles
  const availablePositions = useMemo(() => getPositionsForSport(sport), [sport]);

  // Informations détaillées par position selon le sport
  const positionsInfo = useMemo(() => {
    return getPositionsInfoForSport(sport, availablePositions);
  }, [sport, availablePositions]);

  function handlePositionSelect(position: string) {
    setSelectedPos(position);
    onPositionSelect(position);
  }

  function getPositionIcon(sport: string, position: string): string {
    const icons: Record<string, Record<string, string>> = {
      football: {
        'Gardien': '🥅',
        'Défenseur central': '🛡️',
        'Arrière latéral': '↔️',
        'Milieu défensif': '⚔️',
        'Milieu central': '⚽',
        'Milieu offensif': '🎯',
        'Ailier': '💨',
        'Attaquant': '🔥'
      },
      basketball: {
        'Meneur': '🎯',
        'Arrière': '💫',
        'Ailier': '⚡',
        'Ailier fort': '💪',
        'Pivot': '🏗️'
      },
      rugby: {
        'Pilier': '💪',
        'Talonneur': '🎯',
        'Deuxième ligne': '🏗️',
        'Troisième ligne': '⚔️',
        'Mêlée': '🧭',
        'Ouverture': '🎯',
        'Centre': '⚡',
        'Ailier': '💨',
        'Arrière': '🛡️'
      },
      volleyball: {
        'Passeur': '🎯',
        'Réceptionneur-attaquant': '⚡',
        'Central': '🏗️',
        'Opposite': '🔥',
        'Libéro': '🛡️'
      },
      tennis: {
        'Joueur de fond': '🎯',
        'Serveur-volleyeur': '⚡',
        'Contre-attaquant': '🛡️'
      }
    };

    return icons[sport]?.[position] || '🏃';
  }

  if (!sportInfo || availablePositions.length === 0) {
    return (
      <div className={`max-w-2xl mx-auto text-center space-y-4 ${className}`}>
        <div className="p-8">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Positions non définies
          </h3>
          <p className="text-gray-600 mb-6">
            Ce sport ne nécessite pas de sélection de position spécifique.
          </p>
          <div className="flex justify-center gap-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Retour
              </Button>
            )}
            <Button onClick={() => onPositionSelect('general')}>
              Continuer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-3xl">{sportInfo.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quelle est votre position en {sportInfo.name} ?
            </h2>
            <p className="text-gray-600">
              Nous adapterons votre entraînement à votre rôle spécifique
            </p>
          </div>
        </div>
      </div>

      {/* Information sport */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Conseil :</strong> Choisissez la position que vous jouez le plus souvent ou 
                celle que vous souhaitez perfectionner. Nous personnaliserons vos exercices en conséquence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélection des positions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Positions disponibles ({availablePositions.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positionsInfo.map((position) => (
            <Card 
              key={position.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPos === position.name ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handlePositionSelect(position.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{position.icon}</span>
                    <div>
                      <CardTitle className="text-base">{position.name}</CardTitle>
                      {position.popularity && (
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-500">
                            {position.popularity}% des joueurs
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                {/* Description */}
                <p className="text-sm text-gray-600">{position.description}</p>

                {/* Caractéristiques principales */}
                {position.characteristics.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Caractéristiques :</p>
                    <div className="flex flex-wrap gap-1">
                      {position.characteristics.map((char) => (
                        <Badge key={char} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Demandes physiques */}
                {position.physicalDemands.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Exigences physiques :</p>
                    <div className="flex flex-wrap gap-1">
                      {position.physicalDemands.slice(0, 3).map((demand) => (
                        <Badge key={demand} variant="outline" className="text-xs">
                          {demand}
                        </Badge>
                      ))}
                      {position.physicalDemands.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{position.physicalDemands.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Compétences clés */}
                {position.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Compétences clés :</p>
                    <div className="flex flex-wrap gap-1">
                      {position.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="default" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {position.skills.length > 2 && (
                        <Badge variant="default" className="text-xs">
                          +{position.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Position polyvalente */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Target className="w-8 h-8 text-gray-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-gray-900">Position polyvalente</h3>
              <p className="text-sm text-gray-600">
                Je joue à plusieurs positions ou je débute
              </p>
            </div>
            <Button 
              variant={selectedPos === 'polyvalent' ? "default" : "outline"}
              onClick={() => handlePositionSelect('polyvalent')}
              className="mt-3"
            >
              Sélectionner polyvalent
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
        
        {selectedPos && (
          <Button onClick={() => onPositionSelect(selectedPos)}>
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};

// Fonction pour obtenir les informations des positions selon le sport
function getPositionsInfoForSport(sport: string, positions: string[]): PositionInfo[] {
  const positionsData: Record<string, Record<string, Omit<PositionInfo, 'name' | 'icon'>>> = {
    football: {
      'Gardien': {
        description: 'Protège les buts et initie les relances',
        characteristics: ['Réflexes', 'Courage', 'Leadership'],
        physicalDemands: ['Détente', 'Souplesse', 'Endurance'],
        skills: ['Plongeon', 'Relance', 'Jeu au pied'],
        popularity: 9
      },
      'Défenseur central': {
        description: 'Pilier de la défense, organise le jeu défensif',
        characteristics: ['Solidité', 'Anticipation', 'Jeu aérien'],
        physicalDemands: ['Force', 'Saut', 'Résistance'],
        skills: ['Tacle', 'Marquage', 'Relance'],
        popularity: 20
      },
      'Arrière latéral': {
        description: 'Polyvalent entre défense et attaque sur les côtés',
        characteristics: ['Vitesse', 'Endurance', 'Crossing'],
        physicalDemands: ['Cardio', 'Vitesse', 'Agilité'],
        skills: ['Course', 'Centre', 'Défense'],
        popularity: 20
      },
      'Milieu défensif': {
        description: 'Protège la défense et récupère les ballons',
        characteristics: ['Combativité', 'Vision', 'Interception'],
        physicalDemands: ['Endurance', 'Force', 'Vitesse'],
        skills: ['Tacle', 'Passe', 'Récupération'],
        popularity: 15
      },
      'Milieu central': {
        description: 'Cœur du jeu, distribue et organise',
        characteristics: ['Vision', 'Technique', 'Leadership'],
        physicalDemands: ['Endurance', 'Agilité', 'Coordination'],
        skills: ['Passe', 'Contrôle', 'Frappe'],
        popularity: 15
      },
      'Milieu offensif': {
        description: 'Créateur de jeu entre milieu et attaque',
        characteristics: ['Créativité', 'Technique', 'Vision'],
        physicalDemands: ['Agilité', 'Vitesse', 'Coordination'],
        skills: ['Passe décisive', 'Dribble', 'Frappe'],
        popularity: 10
      },
      'Ailier': {
        description: 'Attaquant rapide sur les côtés du terrain',
        characteristics: ['Vitesse', 'Dribble', 'Crossing'],
        physicalDemands: ['Vitesse', 'Agilité', 'Endurance'],
        skills: ['Sprint', 'Centre', 'Percussion'],
        popularity: 15
      },
      'Attaquant': {
        description: 'Finisseur, responsable des buts',
        characteristics: ['Finition', 'Positionnement', 'Instinct'],
        physicalDemands: ['Détente', 'Force', 'Vitesse'],
        skills: ['Frappe', 'Tête', 'Mouvement'],
        popularity: 15
      }
    },
    basketball: {
      'Meneur': {
        description: 'Chef d\'orchestre, organise le jeu offensif',
        characteristics: ['Vision', 'Leadership', 'Rapidité'],
        physicalDemands: ['Agilité', 'Vitesse', 'Endurance'],
        skills: ['Dribble', 'Passe', 'Tir extérieur'],
        popularity: 20
      },
      'Arrière': {
        description: 'Tireur extérieur et défenseur périmétrique',
        characteristics: ['Adresse', 'Défense', 'Athlétisme'],
        physicalDemands: ['Vitesse', 'Détente', 'Endurance'],
        skills: ['Tir à 3pts', 'Défense', 'Mouvement'],
        popularity: 20
      },
      'Ailier': {
        description: 'Polyvalent entre périmètre et intérieur',
        characteristics: ['Polyvalence', 'Athlétisme', 'Adresse'],
        physicalDemands: ['Force', 'Vitesse', 'Détente'],
        skills: ['Tir mi-distance', 'Rebond', 'Défense'],
        popularity: 20
      },
      'Ailier fort': {
        description: 'Joueur physique proche du panier',
        characteristics: ['Physique', 'Rebond', 'Jeu dos'],
        physicalDemands: ['Force', 'Puissance', 'Résistance'],
        skills: ['Rebond', 'Crochet', 'Écran'],
        popularity: 20
      },
      'Pivot': {
        description: 'Dominant dans la peinture, protecteur du panier',
        characteristics: ['Taille', 'Force', 'Présence'],
        physicalDemands: ['Force', 'Taille', 'Coordination'],
        skills: ['Rebond', 'Contre', 'Jeu dos'],
        popularity: 20
      }
    }
    // Ajouter d'autres sports si nécessaire
  };

  return positions.map(position => {
    const sportData = positionsData[sport];
    const positionData = sportData?.[position];
    
    return {
      name: position,
      icon: getPositionIcon(sport, position),
      description: positionData?.description || `Position de ${position.toLowerCase()}`,
      characteristics: positionData?.characteristics || [],
      physicalDemands: positionData?.physicalDemands || [],
      skills: positionData?.skills || [],
      popularity: positionData?.popularity
    };
  });
}

function getPositionIcon(sport: string, position: string): string {
  const icons: Record<string, Record<string, string>> = {
    football: {
      'Gardien': '🥅',
      'Défenseur central': '🛡️',
      'Arrière latéral': '↔️',
      'Milieu défensif': '⚔️',
      'Milieu central': '⚽',
      'Milieu offensif': '🎯',
      'Ailier': '💨',
      'Attaquant': '🔥'
    },
    basketball: {
      'Meneur': '🎯',
      'Arrière': '💫',
      'Ailier': '⚡',
      'Ailier fort': '💪',
      'Pivot': '🏗️'
    },
    rugby: {
      'Pilier': '💪',
      'Talonneur': '🎯',
      'Deuxième ligne': '🏗️',
      'Troisième ligne': '⚔️',
      'Mêlée': '🧭',
      'Ouverture': '🎯',
      'Centre': '⚡',
      'Ailier': '💨',
      'Arrière': '🛡️'
    },
    volleyball: {
      'Passeur': '🎯',
      'Réceptionneur-attaquant': '⚡',
      'Central': '🏗️',
      'Opposite': '🔥',
      'Libéro': '🛡️'
    },
    tennis: {
      'Joueur de fond': '🎯',
      'Serveur-volleyeur': '⚡',
      'Contre-attaquant': '🛡️'
    }
  };

  return icons[sport]?.[position] || '🏃';
}

export default PositionSelector;