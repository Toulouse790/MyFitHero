// src/features/auth/components/onboarding/OnboardingValidation.tsx
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';

interface OnboardingValidationProps {
  errors: string[];
  warnings?: string[];
  visible: boolean;
}

export const OnboardingValidation: React.FC<OnboardingValidationProps> = ({
  errors,
  warnings = [],
  visible,
}) => {
  if (!visible || (errors.length === 0 && warnings.length === 0)) return null;

  return (
    <div className="space-y-3 mb-4">
      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <h4 className="text-sm font-semibold text-red-900">
                {errors.length === 1 ? 'Erreur détectée' : 'Erreurs détectées'}
              </h4>
            </div>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-red-800 flex items-start space-x-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-semibold text-yellow-900">
                {warnings.length === 1 ? 'Attention' : 'Points d\'attention'}
              </h4>
            </div>
            <ul className="space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-start space-x-2">
                  <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};