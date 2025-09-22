import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AdvancedChartsProps {
  data?: any;
  title?: string;
  type?: 'line' | 'bar' | 'pie';
  className?: string;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ 
  data, 
  title = "Graphique avancé", 
  type = "line",
  className 
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Graphique {type} - Données : {data ? 'Disponibles' : 'Non disponibles'}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedCharts;