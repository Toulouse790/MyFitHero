import React from 'react';

interface OnboardingData {
  selectedModules: string[];
  fitnessLevel: string;
  goals: string[];
  preferences: any;
}

interface ConversationalOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const ConversationalOnboarding: React.FC<ConversationalOnboardingProps> = ({ onComplete }) => {
  const handleComplete = () => {
    onComplete({
      selectedModules: ['sport', 'nutrition', 'sleep', 'hydration'],
      fitnessLevel: 'beginner',
      goals: ['weight_loss', 'fitness'],
      preferences: {}
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Conversational Onboarding</h2>
      <p className="mb-4">Tell us about your fitness goals...</p>
      <button 
        onClick={handleComplete}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Complete Onboarding
      </button>
    </div>
  );
};

export default ConversationalOnboarding;