import { Check } from 'lucide-react';
// components/PreWorkoutRecoveryCheck.tsx
import { useMuscleRecovery } from '@/features/workout/hooks/useMuscleRecovery';

interface MuscleRecoveryRecommendation {
  message: string;
  // autres propriétés selon le type réel
}

export const PreWorkoutRecoveryCheck = ({ plannedMuscles }: { plannedMuscles: string[] }) => {
  const { isReadyForWorkout, recommendations } = useMuscleRecovery();

  const isReady = isReadyForWorkout(plannedMuscles as any);

  return (
    <div className={`p-4 rounded-lg ${isReady ? 'bg-green-50' : 'bg-orange-50'}`}>
      <h3 className="font-semibold mb-2">
        {isReady ? "✅ Prêt pour l'entraînement" : '⚠️ Attention récupération'}
      </h3>
      {!isReady && (
        <div className="space-y-2">
          {recommendations.slice(0, 2).map((rec: MuscleRecoveryRecommendation, i: number) => (
            <p key={i} className="text-sm text-orange-700">
              {rec.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
