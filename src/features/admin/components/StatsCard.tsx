// client/src/features/admin/components/StatsCard.tsx
import React from 'react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface StatItem {
  label: string;
  value: string;
  variant?: 'outline' | 'default';
  className?: string;
}

interface StatsCardProps {
  title: string;
  stats: StatItem[];
  actionLabel: string;
  onActionClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  stats, 
  actionLabel, 
  onActionClick 
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between">
            <span>{stat.label}</span>
            <Badge 
              variant={stat.variant || 'outline'} 
              className={stat.className}
            >
              {stat.value}
            </Badge>
          </div>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
};