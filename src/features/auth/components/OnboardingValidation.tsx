// src/features/auth/components/OnboardingValidation.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface ValidationMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  field?: string;
}

interface OnboardingValidationProps {
  validationMessages: ValidationMessage[];
  isVisible?: boolean;
  className?: string;
}

export const OnboardingValidation: React.FC<OnboardingValidationProps> = ({
  validationMessages,
  isVisible = true,
  className = ''
}) => {
  
  if (!isVisible || validationMessages.length === 0) {
    return null;
  }

  const getIcon = (type: ValidationMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getVariant = (type: ValidationMessage['type']) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getBorderColor = (type: ValidationMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-muted';
    }
  };

  // Grouper les messages par type pour un meilleur affichage
  const groupedMessages = validationMessages.reduce((acc, message) => {
    if (!acc[message.type]) {
      acc[message.type] = [];
    }
    acc[message.type].push(message);
    return acc;
  }, {} as Record<string, ValidationMessage[]>);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`space-y-3 ${className}`}
      >
        {Object.entries(groupedMessages).map(([type, messages]) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-l-4 ${getBorderColor(type as ValidationMessage['type'])}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      {getIcon(message.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">
                            {message.title}
                          </h4>
                          {message.field && (
                            <Badge variant={getVariant(message.type)} className="text-xs">
                              {message.field}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {message.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Résumé de validation */}
        {validationMessages.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center"
          >
            <Badge variant="outline" className="text-xs">
              {validationMessages.filter(m => m.type === 'success').length} validé(s) • 
              {validationMessages.filter(m => m.type === 'error').length} erreur(s) • 
              {validationMessages.filter(m => m.type === 'warning').length} avertissement(s)
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};