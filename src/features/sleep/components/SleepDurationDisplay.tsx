// src/features/sleep/components/SleepDurationDisplay.tsx
import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SleepDurationDisplayProps {
  duration: number;
  errors: Record<string, string>;
}

export const SleepDurationDisplay: React.FC<SleepDurationDisplayProps> = ({
  duration,
  errors
}) => {
  if (duration <= 0) return null;

  return (
    <>
      <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
        <Clock size={16} className="mr-2 text-blue-600" />
        <span className="font-medium text-blue-800">
          Durée: {Math.floor(duration / 60)}h{duration % 60}min
        </span>
        {duration < 360 && (
          <Badge variant="destructive" className="ml-2">
            Trop court
          </Badge>
        )}
        {duration > 600 && (
          <Badge variant="secondary" className="ml-2">
            Très long
          </Badge>
        )}
      </div>

      {errors.duration && (
        <p className="text-red-500 text-sm flex items-center justify-center">
          <AlertTriangle size={14} className="mr-1" />
          {errors.duration}
        </p>
      )}
    </>
  );
};