// src/features/nutrition/components/ScanResults.tsx
import React from 'react';
import { CheckCircle, RotateCw, Plus, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface FoodScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  confidence: number;
  alternatives?: any[];
  portion_size?: string;
  weight_grams?: number;
}

interface ScanResultsProps {
  result: FoodScanResult | null;
  previewImage: string | null;
  onReset: () => void;
  onAddToJournal?: () => void;
  onModifyPortion?: () => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  result,
  previewImage,
  onReset,
  onAddToJournal,
  onModifyPortion,
}) => {
  if (!result) {
    return null;
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return { color: 'bg-green-500', text: 'Très confiant' };
    if (confidence >= 0.7) return { color: 'bg-yellow-500', text: 'Confiant' };
    return { color: 'bg-red-500', text: 'Incertain' };
  };

  const confidenceBadge = getConfidenceBadge(result.confidence);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Résultat du Scan
          </div>
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCw className="w-4 h-4 mr-2" />
            Nouveau Scan
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Preview de l'image */}
        {previewImage && (
          <div className="flex justify-center">
            <img 
              src={previewImage} 
              alt="Food preview" 
              className="max-w-xs rounded-lg border shadow-sm"
            />
          </div>
        )}

        {/* Aliment identifié */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">{result.name}</h3>
          
          <div className="flex justify-center space-x-2">
            <Badge className={`${confidenceBadge.color} text-white px-3 py-1`}>
              {confidenceBadge.text} ({Math.round(result.confidence * 100)}%)
            </Badge>
          </div>
          
          {result.portion_size && (
            <p className="text-sm text-gray-600">
              📏 Portion estimée: {result.portion_size}
            </p>
          )}
        </div>

        {/* Informations nutritionnelles principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {result.calories}
            </div>
            <div className="text-sm text-blue-800 font-medium">Calories</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {result.protein}g
            </div>
            <div className="text-sm text-green-800 font-medium">Protéines</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {result.carbs}g
            </div>
            <div className="text-sm text-yellow-800 font-medium">Glucides</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {result.fat}g
            </div>
            <div className="text-sm text-red-800 font-medium">Lipides</div>
          </div>
        </div>

        {/* Détails nutritionnels supplémentaires */}
        {(result.fiber || result.sugar || result.sodium) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Détails nutritionnels</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {result.fiber && (
                <div className="text-center">
                  <div className="font-semibold text-gray-700">{result.fiber}g</div>
                  <div className="text-gray-500">Fibres</div>
                </div>
              )}
              {result.sugar && (
                <div className="text-center">
                  <div className="font-semibold text-gray-700">{result.sugar}g</div>
                  <div className="text-gray-500">Sucres</div>
                </div>
              )}
              {result.sodium && (
                <div className="text-center">
                  <div className="font-semibold text-gray-700">{result.sodium}mg</div>
                  <div className="text-gray-500">Sodium</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Précision de l'analyse */}
        {result.confidence < 0.8 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm text-yellow-800">
              <span className="font-medium">⚠️ Attention :</span> L'identification n'est pas certaine. 
              Vérifiez les valeurs nutritionnelles avant d'ajouter à votre journal.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onAddToJournal}
            className="flex-1"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter à mon Journal
          </Button>
          
          <Button 
            onClick={onModifyPortion}
            variant="outline"
            size="lg"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier Portion
          </Button>
        </div>

        {/* Info supplémentaire */}
        <div className="text-center text-xs text-gray-500">
          💡 Les valeurs nutritionnelles sont calculées pour {result.portion_size || "la portion scannée"}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResults;