// src/features/analytics/components/DashboardHeader.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Cloud, 
  CloudRain,
  Star,
  Calendar,
  Clock,
  Settings,
  User,
  Flame,
  Target,
  TrendingUp,
  Bell
} from 'lucide-react';

interface DashboardHeaderProps {
  personalizedGreeting: string;
  personalizedMotivation: string;
  userProfile?: any;
  currentStreak?: number;
  totalPoints?: number;
  todayGoalsCompleted?: number;
  todayGoalsTotal?: number;
  weatherInfo?: {
    condition: 'sunny' | 'cloudy' | 'rainy';
    temperature: number;
    description: string;
  };
  notifications?: number;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  personalizedGreeting,
  personalizedMotivation,
  userProfile,
  currentStreak = 0,
  totalPoints = 0,
  todayGoalsCompleted = 0,
  todayGoalsTotal = 5,
  weatherInfo = {
    condition: 'sunny',
    temperature: 22,
    description: 'Parfait pour un entraînement outdoor'
  },
  notifications = 0,
  onSettingsClick,
  onProfileClick,
  className = '',
}) => {
  const getWeatherIcon = () => {
    switch (weatherInfo.condition) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '🌙';
    if (hour < 12) return '☀️';
    if (hour < 18) return '👋';
    return '🌆';
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('fr-FR', options);
  };

  const getCompletionPercentage = () => {
    return todayGoalsTotal > 0 ? Math.round((todayGoalsCompleted / todayGoalsTotal) * 100) : 0;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header principal */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            
            {/* Section principale - Salutation */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getGreetingEmoji()}</div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {personalizedGreeting}
                  </h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate()}</span>
                  </div>
                </div>
              </div>
              
              {/* Message de motivation */}
              <div className="p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-primary">
                  {personalizedMotivation}
                </p>
              </div>
            </div>

            {/* Section droite - Actions et métadonnées */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              
              {/* Météo */}
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon()}
                    <div>
                      <div className="font-semibold">{weatherInfo.temperature}°C</div>
                      <div className="text-xs text-muted-foreground">
                        {weatherInfo.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {notifications > 0 && (
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {notifications}
                    </Badge>
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={onProfileClick}>
                  <User className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={onSettingsClick}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre de progression et statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Progression quotidienne */}
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium">Objectifs du jour</span>
              </div>
              <Badge variant={getCompletionPercentage() >= 80 ? "default" : "secondary"}>
                {todayGoalsCompleted}/{todayGoalsTotal}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span className="font-medium">{getCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Série en cours */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">Série</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {currentStreak}
              <span className="text-sm font-normal text-muted-foreground ml-1">jours</span>
            </div>
          </CardContent>
        </Card>

        {/* Points totaux */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">Points</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {totalPoints.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground ml-1">pts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicateurs rapides du profil */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-secondary/50 to-secondary/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Sport */}
              {userProfile.sport && (
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">Sport:</div>
                  <Badge variant="outline" className="text-xs">
                    {userProfile.sport}
                    {userProfile.sport_position && ` - ${userProfile.sport_position}`}
                  </Badge>
                </div>
              )}

              {/* Objectifs principaux */}
              {userProfile.primary_goals && userProfile.primary_goals.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">Objectifs:</div>
                  <div className="flex space-x-1">
                    {userProfile.primary_goals.slice(0, 2).map((goal: string) => (
                      <Badge key={goal} variant="secondary" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Niveau d'expérience */}
              {userProfile.fitness_experience && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-3 w-3" />
                  <div className="text-sm font-medium">Niveau:</div>
                  <Badge variant="outline" className="text-xs">
                    {userProfile.fitness_experience}
                  </Badge>
                </div>
              )}

              {/* Temps disponible */}
              {userProfile.available_time_per_day && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <div className="text-sm font-medium">Temps/jour:</div>
                  <Badge variant="outline" className="text-xs">
                    {userProfile.available_time_per_day} min
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHeader;