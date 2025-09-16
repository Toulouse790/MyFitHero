// src/features/nutrition/components/PhotoNutritionAnalyzer.tsx
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Plus,
  Minus,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { useFoodPhotoAnalysis } from '../hooks/useFoodPhotoAnalysis';
import { RecognizedFood } from '../services/foodRecognition';

interface PhotoNutritionAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodsConfirmed: (foods: RecognizedFood[]) => void;
  className?: string;
}

export const PhotoNutritionAnalyzer: React.FC<PhotoNutritionAnalyzerProps> = ({
  isOpen,
  onClose,
  onFoodsConfirmed,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);
  
  const {
    state,
    analyzeImage,
    selectFood,
    deselectFood,
    adjustQuantity,
    confirmSelection,
    reset,
    getTotalNutrition
  } = useFoodPhotoAnalysis();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Afficher l'aperçu de l'image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    // Analyser l'image
    await analyzeImage(file);
  };

  const handleConfirm = async () => {
    const confirmedFoods = await confirmSelection();
    if (confirmedFoods.length > 0) {
      onFoodsConfirmed(confirmedFoods);
      handleClose();
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    setShowNutritionDetails(false);
    onClose();
  };

  const totalNutrition = getTotalNutrition();

  const renderFoodItem = (food: RecognizedFood, isSelected: boolean) => (
    <Card 
      key={food.food.id} 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => isSelected ? deselectFood(food.food.id) : selectFood(food)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{food.food.name}</h3>
            <Badge variant={food.confidence > 0.8 ? 'default' : 'secondary'}>
              {Math.round(food.confidence * 100)}%
            </Badge>
          </div>
          {isSelected && <CheckCircle className="h-5 w-5 text-blue-500" />}
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <p>Quantité estimée: {Math.round(food.estimated_quantity)}g</p>
          <p>Calories: {Math.round(food.estimated_calories)} kcal</p>
        </div>

        {isSelected && (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustQuantity(food.food.id, Math.max(10, food.estimated_quantity - 10))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Input
              type="number"
              value={Math.round(food.estimated_quantity)}
              onChange={(e) => adjustQuantity(food.food.id, parseInt(e.target.value) || 0)}
              className="w-20 text-center text-xs"
              min="1"
              max="1000"
            />
            
            <span className="text-xs text-gray-500">g</span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustQuantity(food.food.id, food.estimated_quantity + 10)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${className}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Analyse Nutritionnelle par Photo
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Zone de sélection d'image */}
          {!selectedImage && !state.isAnalyzing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8" />
                  <span>Prendre une photo</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8" />
                  <span>Choisir une image</span>
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="text-sm text-gray-500 text-center">
                Formats supportés: JPG, PNG, WebP (max 10MB)
              </div>
            </div>
          )}

          {/* Analyse en cours */}
          {state.isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <div className="text-center">
                <h3 className="font-medium">Analyse en cours...</h3>
                <p className="text-sm text-gray-500">
                  Reconnaissance des aliments dans votre photo
                </p>
              </div>
            </div>
          )}

          {/* Aperçu de l'image */}
          {selectedImage && !state.isAnalyzing && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Image à analyser"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    reset();
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Nouvelle photo
                </Button>
              </div>
            </div>
          )}

          {/* Erreur */}
          {state.error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Erreur d'analyse</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{state.error}</p>
              </CardContent>
            </Card>
          )}

          {/* Résultats de l'analyse */}
          {state.analysisResult && state.analysisResult.foods.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Aliments détectés ({state.analysisResult.foods.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNutritionDetails(!showNutritionDetails)}
                >
                  {showNutritionDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showNutritionDetails ? 'Masquer' : 'Détails'} nutrition
                </Button>
              </div>

              <div className="grid gap-3">
                {state.analysisResult.foods.map(food => {
                  const isSelected = state.selectedFoods.some(f => f.food.id === food.food.id);
                  return renderFoodItem(food, isSelected);
                })}
              </div>

              {/* Résumé nutritionnel */}
              {state.selectedFoods.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-800 text-base">
                      Résumé nutritionnel ({state.selectedFoods.length} aliment(s))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-green-800">
                          {Math.round(totalNutrition.calories)}
                        </div>
                        <div className="text-green-600">Calories</div>
                      </div>
                      
                      {showNutritionDetails && (
                        <>
                          <div className="text-center">
                            <div className="font-semibold text-green-800">
                              {Math.round(totalNutrition.protein)}g
                            </div>
                            <div className="text-green-600">Protéines</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold text-green-800">
                              {Math.round(totalNutrition.carbs)}g
                            </div>
                            <div className="text-green-600">Glucides</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-semibold text-green-800">
                              {Math.round(totalNutrition.fat)}g
                            </div>
                            <div className="text-green-600">Lipides</div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Aucun aliment détecté */}
          {state.analysisResult && state.analysisResult.foods.length === 0 && !state.error && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-medium text-yellow-800">Aucun aliment détecté</h3>
                <p className="text-sm text-yellow-600 mt-1">
                  Essayez avec une photo plus claire ou un angle différent
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {(selectedImage || state.analysisResult) && (
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Annuler
              </Button>
              
              {state.selectedFoods.length > 0 && (
                <Button onClick={handleConfirm} className="flex-1">
                  Ajouter au journal ({state.selectedFoods.length})
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoNutritionAnalyzer;