import { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  setOnboardingStatus: (status: 'not_started' | 'in_progress' | 'completed') => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [onboardingStatus, setOnboardingStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <OnboardingContext.Provider value={{ onboardingStatus, setOnboardingStatus, currentStep, setCurrentStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};