import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Calendar, Clock } from 'lucide-react';
import { UserDataService, DailyCheckin } from '@/services/userDataService';
import { BadgeService } from '@/services/badgeService';
import { useToast } from '@/shared/hooks/use-toast';

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
      const newCheckin: DailyCheckin = {
        id: Date.now().toString(),
        userId,
        date: new Date().toISOString().split('T')[0],
        responses: answers,
        completedAt: new Date().toISOString(),
      };

      await UserDataService.saveDailyCheckin(newCheckin);
      setCheckin(newCheckin);
      setHasCheckedToday(true);

      // Award badge for check-in
      await BadgeService.checkAndAwardBadge(userId, 'daily_checkin');

      toast.success('Check-in complété !', 'Bravo pour votre régularité');
      onCheckInComplete?.(newCheckin);
    } catch (error) {
      console.error('Erreur sauvegarde check-in:', error);
      toast.error('Erreur', 'Impossible de sauvegarder le check-in');
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
              Check-in effectué à {new Date(checkin.completedAt).toLocaleTimeString('fr-FR')}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {questions.map((question) => (
                <div key={question.key} className="flex items-center space-x-2">
                  {checkin.responses[question.key] ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs">{question.text}</span>
                </div>
              ))}
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