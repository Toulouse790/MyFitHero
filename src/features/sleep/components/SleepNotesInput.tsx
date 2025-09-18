// src/features/sleep/components/SleepNotesInput.tsx
import React from 'react';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

interface SleepNotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const SleepNotesInput: React.FC<SleepNotesInputProps> = ({
  notes,
  onNotesChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes personnelles (optionnel)</Label>
      <Textarea
        id="notes"
        placeholder="Détails sur votre nuit, rêves, ressenti..."
        value={notes}
        onChange={e => onNotesChange(e.target.value)}
        rows={3}
      />
    </div>
  );
};