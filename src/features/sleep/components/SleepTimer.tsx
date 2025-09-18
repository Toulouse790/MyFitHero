// src/features/sleep/components/SleepTimer.tsx
import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Moon, CheckCircle } from 'lucide-react';

interface SleepTimerProps {
  isActive: boolean;
  startTime?: Date;
  onStopTimer: () => void;
}

export const SleepTimer: React.FC<SleepTimerProps> = ({
  isActive,
  startTime,
  onStopTimer,
}) => {
  if (!isActive) return null;

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="font-semibold text-purple-800">Timer en cours</h3>
              <p className="text-sm text-purple-600">
                Démarré à{' '}
                {startTime?.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <Button
            onClick={onStopTimer}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Réveil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTimer;