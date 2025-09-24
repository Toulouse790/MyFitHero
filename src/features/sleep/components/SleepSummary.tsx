// src/features/sleep/components/SleepSummary.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Moon, Eye, EyeOff, TimerIcon, Play } from 'lucide-react';

interface SleepSession {
  id: string;
  bedtime?: string;
  wake_time?: string;
  quality_rating?: number;
}

interface SleepSummaryProps {
  currentSleep: SleepSession | undefined;
  currentSleepHours: number;
  personalizedSleepGoal: number;
  userSportCategory: string;
  sportEmoji: string;
  sleepDeficit: number;
  sleepPercentage: number;
  showDetailedView: boolean;
  isTimerActive: boolean;
  onToggleDetailedView: () => void;
  onStartTimer: () => void;
}

export const SleepSummary: React.FC<SleepSummaryProps> = ({
  currentSleep,
  currentSleepHours,
  personalizedSleepGoal,
  userSportCategory,
  sportEmoji,
  sleepDeficit,
  sleepPercentage,
  showDetailedView,
  isTimerActive,
  onToggleDetailedView,
  onStartTimer,
}) => {
  return (
    <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span>Dernière Nuit</span>
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDetailedView}
              className="text-white hover:bg-white/20"
            >
              {showDetailedView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {userSportCategory} {sportEmoji}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {currentSleep ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">{currentSleepHours.toFixed(1)}h</div>
                <div className="text-white/80 text-sm">
                  sur {personalizedSleepGoal}h ({userSportCategory})
                </div>
                <div className="text-white/70 text-xs mt-1">
                  {sleepDeficit > 0
                    ? `${Math.round(sleepDeficit * 60)} min de déficit`
                    : 'Objectif atteint ! 🎉'}
                </div>
              </div>

              {showDetailedView && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {currentSleep.quality_rating || '--'}/5
                    </div>
                    <div className="text-white/80 text-xs">Qualité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{Math.round(sleepPercentage)}%</div>
                    <div className="text-white/80 text-xs">Objectif</div>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-white/80">
                Couché: {currentSleep.bedtime || '--'} • Levé: {currentSleep.wake_time || '--'}
              </div>

              <Progress value={Math.min(sleepPercentage, 100)} className="h-3 bg-white/20" />

              {!isTimerActive && (
                <div className="flex justify-center">
                  <Button
                    onClick={onStartTimer}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <TimerIcon className="h-4 w-4 mr-2" />
                    Nouveau timer
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/80 mb-4">Aucune donnée de sommeil aujourd'hui</p>
              {!isTimerActive && (
                <Button
                  onClick={onStartTimer}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer le timer
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepSummary;