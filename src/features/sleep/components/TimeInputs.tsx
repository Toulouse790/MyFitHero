// src/features/sleep/components/TimeInputs.tsx
import React from 'react';
import { Moon, Sun, AlertTriangle } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

interface TimeInputsProps {
  bedtime: string;
  wakeTime: string;
  onBedtimeChange: (value: string) => void;
  onWakeTimeChange: (value: string) => void;
  errors: Record<string, string>;
}

export const TimeInputs: React.FC<TimeInputsProps> = ({
  bedtime,
  wakeTime,
  onBedtimeChange,
  onWakeTimeChange,
  errors
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="bedtime" className="flex items-center">
          <Moon size={16} className="mr-1" />
          Coucher
        </Label>
        <Input
          id="bedtime"
          type="time"
          value={bedtime}
          onChange={e => onBedtimeChange(e.target.value)}
          className={errors.bedtime ? 'border-red-500' : ''}
          required
        />
        {errors.bedtime && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            {errors.bedtime}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="wakeTime" className="flex items-center">
          <Sun size={16} className="mr-1" />
          Réveil
        </Label>
        <Input
          id="wakeTime"
          type="time"
          value={wakeTime}
          onChange={e => onWakeTimeChange(e.target.value)}
          className={errors.wakeTime ? 'border-red-500' : ''}
          required
        />
        {errors.wakeTime && (
          <p className="text-red-500 text-sm flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            {errors.wakeTime}
          </p>
        )}
      </div>
    </div>
  );
};