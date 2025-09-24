// src/features/profile/components/profile/ConnectedScales.tsx
import React from 'react';
import { Scale, RefreshCw, Bluetooth, Wifi } from 'lucide-react';

interface ConnectedScale {
  id: string;
  brand: string;
  model: string;
  isConnected?: boolean;
  connectionType?: 'bluetooth' | 'wifi';
  batteryLevel?: number;
  lastSync?: string;
  name?: string;
}

interface ConnectedScalesProps {
  connectedScales: ConnectedScale[];
  isScanning: boolean;
  isSyncing: boolean;
  onSyncScale: (scaleId: string) => void;
  onScanForScales: () => void;
}

export const ConnectedScales: React.FC<ConnectedScalesProps> = ({
  connectedScales,
  isScanning,
  isSyncing,
  onSyncScale,
  onScanForScales,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Scale className="text-green-500" size={20} />
        Balance connectée
      </h2>

      {connectedScales.length > 0 ? (
        <div className="space-y-4">
          {connectedScales.map((scale, index) => (
            <div key={scale.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      scale.isConnected ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {scale.connectionType === 'bluetooth' && (
                      <Bluetooth
                        size={16}
                        className={
                          scale.isConnected ? 'text-green-600' : 'text-red-600'
                        }
                      />
                    )}
                    {scale.connectionType === 'wifi' && (
                      <Wifi
                        size={16}
                        className={
                          scale.isConnected ? 'text-green-600' : 'text-red-600'
                        }
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{scale.name}</h3>
                    <p className="text-sm text-gray-500">
                      {scale.brand} {scale.model}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {scale.batteryLevel && (
                    <div className="text-sm text-gray-500">
                      🔋 {scale.batteryLevel}%
                    </div>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      scale.isConnected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {scale.isConnected ? 'Connectée' : 'Déconnectée'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Dernière synchro:{' '}
                  {scale.lastSync
                    ? new Date(scale.lastSync).toLocaleString('fr-FR')
                    : 'Jamais'}
                </div>

                <button
                  onClick={() => onSyncScale(scale.id)}
                  disabled={!scale.isConnected || isSyncing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={16} />
                  {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Scale className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune balance connectée</h3>
          <p className="text-gray-500 mb-4">
            Connectez votre balance pour synchroniser automatiquement votre poids
          </p>
        </div>
      )}

      <button
        onClick={onScanForScales}
        disabled={isScanning}
        className="w-full mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {isScanning ? (
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" size={16} />
            Recherche en cours...
          </span>
        ) : (
          '+ Ajouter une balance'
        )}
      </button>
    </div>
  );
};

export default ConnectedScales;