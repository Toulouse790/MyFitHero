// src/features/hydration/components/HydrationMessage.tsx
import React from 'react';

interface HydrationMessageProps {
  message: string;
}

export const HydrationMessage: React.FC<HydrationMessageProps> = ({
  message,
}) => {
  return (
    <div className="text-center mb-6">
      <p className="text-gray-600 text-sm">
        {message}
      </p>
    </div>
  );
};

export default HydrationMessage;