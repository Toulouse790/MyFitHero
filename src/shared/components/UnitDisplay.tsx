import React from 'react';

export interface UnitDisplayProps {
  value: number | string;
  unit: string;
  precision?: number;
  className?: string;
  showUnit?: boolean;
}

export const UnitDisplay: React.FC<UnitDisplayProps> = ({
  value,
  unit,
  precision = 1,
  className = '',
  showUnit = true
}) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    return precision > 0 ? val.toFixed(precision) : val.toString();
  };

  return (
    <span className={className}>
      {formatValue(value)}
      {showUnit && unit && <span className="ml-1 text-muted-foreground">{unit}</span>}
    </span>
  );
};

export default UnitDisplay;