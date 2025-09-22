import { CheckCircle, Plus } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/shared/hooks/use-toast';
import { useSleepStore } from '../hooks/useSleepStore';
import { defaultSleepFactors, calculateSleepDuration } from '../utils/sleepConfig';

// Import des sous-composants
import { TimeInputs } from './TimeInputs';
import { SleepDurationDisplay } from './SleepDurationDisplay';
import { QualitySlider } from './QualitySlider';
import { SleepFactors } from './SleepFactors';
import { SleepNotesInput } from './SleepNotesInput';
import { SubmitButton } from './SubmitButton';

interface SleepQualityFormProps {
  onComplete?: () => void;
  className?: string;
}

export const SleepQualityForm: React.FC<SleepQualityFormProps> = ({
  onComplete,
  className = '',
}) => {
  const { toast } = useToast();
  const { addEntry, isLoading } = useSleepStore();

  const [formData, setFormData] = useState({
    bedtime: '',
    wakeTime: '',
    quality: 5,
    notes: '',
  });

  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.bedtime) {
      newErrors.bedtime = 'Heure de coucher requise';
    }

    if (!formData.wakeTime) {
      newErrors.wakeTime = 'Heure de réveil requise';
    }

    if (formData.bedtime && formData.wakeTime) {
      const duration = calculateSleepDuration(formData.bedtime, formData.wakeTime);
      if (duration < 60) {
        newErrors.duration = 'Durée de sommeil trop courte (minimum 1h)';
      }
      if (duration > 720) {
        newErrors.duration = 'Durée de sommeil trop longue (maximum 12h)';
      }
    }

    if (formData.quality < 1 || formData.quality > 10) {
      newErrors.quality = 'Qualité doit être entre 1 et 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast({
          title: 'Erreur de validation',
          description: 'Veuillez corriger les erreurs dans le formulaire',
          variant: 'destructive',
        });
        return;
      }

      try {
        const duration = calculateSleepDuration(formData.bedtime, formData.wakeTime);
        const factors = selectedFactors.map(
          factorId => defaultSleepFactors.find(f => f.id === factorId)!
        );

        await addEntry({
          bedtime: new Date(formData.bedtime),
          wakeTime: new Date(formData.wakeTime),
          duration,
          quality: formData.quality,
          factors,
          notes: formData.notes || undefined,
        });

        toast({
          title: 'Sommeil enregistré !',
          description: `${Math.floor(duration / 60)}h${duration % 60}min de sommeil ajouté`,
        });

        // Reset form
        setFormData({
          bedtime: '',
          wakeTime: '',
          quality: 5,
          notes: '',
        });
        setSelectedFactors([]);
        setErrors({});

        onComplete?.();
      } catch (error) {
        // Erreur silencieuse
        toast({
          title: 'Erreur',
          description: "Impossible d'enregistrer le sommeil",
          variant: 'destructive',
        });
      }
    },
    [formData, selectedFactors, validateForm, addEntry, toast, onComplete]
  );

  const toggleFactor = useCallback((factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId) ? prev.filter(id => id !== factorId) : [...prev, factorId]
    );
  }, []);

  const duration = formData.bedtime && formData.wakeTime
    ? calculateSleepDuration(formData.bedtime, formData.wakeTime)
    : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="mr-2" size={20} />
          Enregistrer une nuit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TimeInputs
            bedtime={formData.bedtime}
            wakeTime={formData.wakeTime}
            onBedtimeChange={(value) => setFormData(prev => ({ ...prev, bedtime: value }))}
            onWakeTimeChange={(value) => setFormData(prev => ({ ...prev, wakeTime: value }))}
            errors={errors}
          />

          <SleepDurationDisplay duration={duration} errors={errors} />

          <QualitySlider
            quality={formData.quality}
            onQualityChange={(quality) => setFormData(prev => ({ ...prev, quality }))}
          />

          <SleepFactors
            selectedFactors={selectedFactors}
            onToggleFactor={toggleFactor}
          />

          <SleepNotesInput
            notes={formData.notes}
            onNotesChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
          />

          <SubmitButton
            isLoading={isLoading}
            hasErrors={Object.keys(errors).length > 0}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default SleepQualityForm;
