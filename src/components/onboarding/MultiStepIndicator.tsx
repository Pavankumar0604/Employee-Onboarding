import React from 'react';
import {
  User, MapPin, Users, GraduationCap, Banknote,
  HeartHandshake, FileUp, Check, Building, Shirt, Fingerprint, CheckCircle, Shield, FileCheck2
} from 'lucide-react';
import type { OnboardingStep } from '../../types/onboarding';

interface MultiStepIndicatorProps {
  steps: OnboardingStep[];
  currentStepIndex: number;
}

const stepIcons: Record<OnboardingStep, React.FC<React.SVGProps<SVGSVGElement>>> = {
  personal: User,
  address: MapPin,
  organization: Building, // New step based on image
  family: Users,
  education: GraduationCap,
  bank: Banknote,
  uan: CheckCircle, // Changed from FileText to BadgeCheck (Verification badge)
  esi: Shield, // Changed from FileText to ShieldPlus (Shield with plus)
  gmc: HeartHandshake,
  uniform: Shirt, // New step based on image
  documents: FileUp,
  biometrics: Fingerprint, // New step based on image
  review: FileCheck2, // Changed from ShieldCheck to FileCheck (Document with check)
};

const MultiStepIndicator: React.FC<MultiStepIndicatorProps> = ({ steps, currentStepIndex }) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex space-x-8">
        {steps.map((step, stepIdx) => {
          if (stepIdx < currentStepIndex) {
            // Completed step
            return (
              <li key={step} className="text-accent flex items-center step-item fade-in">
                <div className="step-circle completed">
                  <Check className="w-3 h-3" aria-hidden="true" />
                </div>
              </li>
            );
          } else if (stepIdx === currentStepIndex) {
            // Current step
            const Icon = stepIcons[step];
            return (
              <li key={step} className="text-accent flex items-center font-semibold step-item fade-in">
                <div className="step-circle current">
                  <Icon className="w-3 h-3" aria-hidden="true" />
                </div>
              </li>
            );
          } else {
            // Upcoming step
            const Icon = stepIcons[step];
            return (
              <li key={step} className="text-muted flex items-center step-item fade-in">
                <div className="step-circle upcoming">
                  <Icon className="w-3 h-3" aria-hidden="true" />
                </div>
              </li>
            );
          }
        })}
      </ol>
    </nav>
  );
};

export default MultiStepIndicator;