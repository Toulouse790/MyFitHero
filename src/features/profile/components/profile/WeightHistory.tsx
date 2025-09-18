// src/features/profile/components/profile/WeightHistory.tsx
import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

interface WeightEntry {
  id?: string;
  weight: number;
  recorded_at: string;
  source: 'connected_scale' | 'manual' | 'import';
}

interface WeightHistoryProps {
  weightHistory: WeightEntry[];
  showWeightHistory: boolean;
  onToggleHistory: () => void;
}

export const WeightHistory: React.FC<WeightHistoryProps> = ({
  weightHistory,
  showWeightHistory,
  onToggleHistory,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="text-purple-500" size={20} />
          Historique du poids
        </h2>
        <button
          onClick={onToggleHistory}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showWeightHistory ? 'Masquer' : 'Voir tout'}
        </button>
      </div>

      {weightHistory.length > 0 ? (
        <div className="space-y-3">
          {(showWeightHistory ? weightHistory : weightHistory.slice(0, 3)).map(
            (entry, index) => (
              <div
                key={entry.id || index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      entry.source === 'connected_scale'
                        ? 'bg-green-500'
                        : entry.source === 'manual'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium">{entry.weight} kg</div>
                    <div className="text-sm text-gray-500">
                      {new Date(entry.recorded_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {entry.source === 'connected_scale'
                    ? 'Balance'
                    : entry.source === 'manual'
                      ? 'Manuel'
                      : 'Import'}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="mx-auto mb-2" size={32} />
          <p>Aucun historique de poids disponible</p>
        </div>
      )}
    </div>
  );
};

export default WeightHistory;