// src/features/sleep/components/SubmitButton.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isLoading: boolean;
  hasErrors: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  hasErrors
}) => {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isLoading || hasErrors}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Enregistrement...
        </div>
      ) : (
        <div className="flex items-center">
          <CheckCircle className="mr-2" size={18} />
          Enregistrer cette nuit
        </div>
      )}
    </Button>
  );
};