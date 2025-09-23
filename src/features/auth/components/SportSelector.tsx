import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, TrendingUp, Users } from 'lucide-react';
import { AVAILABLE_SPORTS, getSportsByCategory, getPopularSports, searchSports, SportOption } from '@/core/config/sports.config';

interface SportSelectorProps {
  selectedSport?: string;
  onSportSelect: (sport: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
  className?: string;
}

const SportSelector: React.FC<SportSelectorProps> = ({
  selectedSport,
  onSportSelect,
  onBack,
  onSkip,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllSports, setShowAllSports] = useState(false);

  // Catégories disponibles
  const categories = useMemo(() => {
    const cats = Array.from(new Set(AVAILABLE_SPORTS.map(sport => sport.category)));
    return [
      { id: 'all', name: 'Tous les sports', icon: '🏆' },
      { id: 'popular', name: 'Populaires', icon: '⭐' },
      ...cats.map(cat => ({
        id: cat,
        name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        icon: getCategoryIcon(cat)
      }))
    ];
  }, []);

  // Sports filtrés selon la recherche et la catégorie
  const filteredSports = useMemo(() => {
    let sports = AVAILABLE_SPORTS;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      sports = searchSports(searchQuery.trim());
    }

    // Filtrer par catégorie
    if (selectedCategory === 'popular') {
      sports = getPopularSports(10);
    } else if (selectedCategory !== 'all') {
      sports = getSportsByCategory(selectedCategory);
    }

    // Limiter le nombre affiché initialement
    if (!showAllSports && !searchQuery.trim()) {
      return sports.slice(0, 12);
    }

    return sports;
  }, [searchQuery, selectedCategory, showAllSports]);

  // Sports populaires pour affichage rapide
  const popularSports = useMemo(() => getPopularSports(6), []);

  function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'sports-collectifs': '⚽',
      'sports-raquette': '🎾',
      'endurance': '🏃',
      'combat': '🥊',
      'force': '🏋️',
      'fonctionnel': '💪'
    };
    return icons[category] || '🏃';
  }

  function handleSportSelect(sport: SportOption) {
    onSportSelect(sport.id);
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choisissez votre sport principal</h2>
        <p className="text-gray-600">Nous adapterons votre programme d'entraînement en conséquence</p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Rechercher un sport..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sports populaires (si pas de recherche) */}
      {!searchQuery.trim() && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Sports populaires</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularSports.map((sport) => (
              <Button
                key={sport.id}
                variant={selectedSport === sport.id ? "default" : "outline"}
                onClick={() => handleSportSelect(sport)}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <span className="text-2xl">{sport.icon}</span>
                <span className="text-sm font-medium">{sport.name}</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-gray-500">{sport.popularity}%</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filtres par catégorie */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Liste des sports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {searchQuery.trim() 
              ? `Résultats pour "${searchQuery}"` 
              : selectedCategory === 'all' 
                ? 'Tous les sports'
                : categories.find(c => c.id === selectedCategory)?.name
            }
          </h3>
          <span className="text-sm text-gray-500">
            {filteredSports.length} sport{filteredSports.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSports.map((sport) => (
            <Card 
              key={sport.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSport === sport.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleSportSelect(sport)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sport.icon}</span>
                    <div>
                      <CardTitle className="text-base">{sport.name}</CardTitle>
                      <p className="text-xs text-gray-500 capitalize">
                        {sport.category.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  {sport.popularity >= 80 && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {/* Positions disponibles */}
                {sport.positions && sport.positions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Positions :</p>
                    <div className="flex flex-wrap gap-1">
                      {sport.positions.slice(0, 3).map((position) => (
                        <Badge key={position} variant="outline" className="text-xs">
                          {position}
                        </Badge>
                      ))}
                      {sport.positions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{sport.positions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Groupes musculaires */}
                {sport.muscles && sport.muscles.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Muscles sollicités :</p>
                    <div className="flex flex-wrap gap-1">
                      {sport.muscles.slice(0, 2).map((muscle) => (
                        <Badge key={muscle} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {sport.muscles.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{sport.muscles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton "Voir plus" */}
        {!showAllSports && !searchQuery.trim() && filteredSports.length >= 12 && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAllSports(true)}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Voir tous les sports ({AVAILABLE_SPORTS.length})
            </Button>
          </div>
        )}

        {/* Aucun résultat */}
        {filteredSports.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">
              Aucun sport trouvé pour "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Voir tous les sports
            </Button>
          </div>
        )}
      </div>

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
        
        {selectedSport && (
          <Button onClick={() => onSportSelect(selectedSport)}>
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};

export default SportSelector;