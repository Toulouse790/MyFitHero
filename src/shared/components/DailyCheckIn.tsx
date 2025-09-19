import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Check, X, Calendar, Clock } from 'lucide-react';
import { UserDataService, DailyCheckin } from '../../lib/services/userDataService';
import { BadgeService } from '../../lib/services/badgeService';
import { useToast } from '../hooks/use-toast';

interface DailyCheckInProps {
  userId?: string;
  onCheckInComplete?: (checkin: DailyCheckin) => void;
  className?: string;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  userId,
  onCheckInComplete,
  className = '',
}) => {
  const [checkin, setCheckin] = useState<DailyCheckin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTodayCheckin();
  }, [userId]);

  const loadTodayCheckin = async () => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const todayCheckin = await UserDataService.getDailyCheckin(userId, today);
      
      if (todayCheckin) {
        setCheckin(todayCheckin);
        setHasCheckedToday(true);
      }
    } catch (error) {
      console.error('Erreur chargement check-in:', error);
    }
  };

  const handleCheckIn = async (answers: Record<string, boolean>) => {
    if (!userId || hasCheckedToday) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const newCheckin = {
        user_id: userId,
        date: today,
        workout_completed: answers.exercised || false,
        nutrition_logged: answers.ate_healthy || false,
        sleep_tracked: answers.slept_well || false,
        hydration_logged: answers.hydrated || false,
        mood_score: answers.good_energy ? 5 : 3,
        energy_level: answers.good_energy ? 5 : 3,
        notes: '',
      };

      const success = await UserDataService.saveOrUpdateDailyCheckin(newCheckin);
      if (success) {
        const savedCheckin = await UserDataService.getDailyCheckin(userId, today);
        if (savedCheckin) {
          setCheckin(savedCheckin);
          setHasCheckedToday(true);

          // Award badges for check-in
          await BadgeService.checkAndAwardBadges(userId);

          toast({ title: 'Check-in complété !', description: 'Bravo pour votre régularité' });
          onCheckInComplete?.(savedCheckin);
        }
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde check-in:', error);
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder le check-in', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const questions = [
    { key: 'slept_well', text: 'Avez-vous bien dormi ?' },
    { key: 'good_energy', text: 'Avez-vous de l\'énergie aujourd\'hui ?' },
    { key: 'exercised', text: 'Avez-vous fait de l\'exercice ?' },
    { key: 'ate_healthy', text: 'Avez-vous mangé sainement ?' },
    { key: 'hydrated', text: 'Avez-vous bu suffisamment d\'eau ?' },
  ];

  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  if (hasCheckedToday && checkin) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Check-in complété</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Check-in effectué le {new Date(checkin.date).toLocaleDateString('fr-FR')}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center space-x-2">
                {checkin.workout_completed ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Exercice fait</span>
              </div>
              <div className="flex items-center space-x-2">
                {checkin.nutrition_logged ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Nutrition saine</span>
              </div>
              <div className="flex items-center space-x-2">
                {checkin.sleep_tracked ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Bien dormi</span>
              </div>
              <div className="flex items-center space-x-2">
                {checkin.hydration_logged ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Bien hydraté</span>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <p>Humeur: {checkin.mood_score}/5 ⭐</p>
              <p>Énergie: {checkin.energy_level}/5 ⚡</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Check-in quotidien</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Comment vous sentez-vous aujourd'hui ?
          </p>
          
          <div className="space-y-3">
            {questions.map((question) => (
              <div key={question.key} className="flex items-center justify-between">
                <span className="text-sm">{question.text}</span>
                <div className="flex space-x-2">
                  <Button
                    variant={answers[question.key] === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnswers(prev => ({ ...prev, [question.key]: true }))}
                  >
                    Oui
                  </Button>
                  <Button
                    variant={answers[question.key] === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnswers(prev => ({ ...prev, [question.key]: false }))}
                  >
                    Non
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => handleCheckIn(answers)}
            disabled={isLoading || Object.keys(answers).length !== questions.length}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Sauvegarde...</span>
              </div>
            ) : (
              'Valider le check-in'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { DailyCheckIn };