import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useOnboarding } from '../../store/OnboardingContext';
import MultiStepIndicator from '../../components/onboarding/MultiStepIndicator';
import FormHeader from '../../components/onboarding/FormHeader';
import Button from '../../components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { OnboardingStep } from '../../types/onboarding';

// Import all onboarding components
import PersonalDetailsForm from '../../components/onboarding/PersonalDetailsForm';
import AddressDetailsForm from '../../components/onboarding/AddressDetailsForm';
import FamilyDetailsForm from '../../components/onboarding/FamilyDetailsForm';
import EducationDetailsForm from '../../components/onboarding/EducationDetailsForm';
import BankDetailsForm from '../../components/onboarding/BankDetailsForm';
import UANDetailsForm from '../../components/onboarding/UANDetailsForm';
import ESIDetailsForm from '../../components/onboarding/ESIDetailsForm';
import GMCDetailsForm from '../../components/onboarding/GMCDetailsForm';
import DocumentUploader from '../../components/onboarding/DocumentUploader';
import ReviewSubmit from '../../components/onboarding/ReviewSubmit';
// AvatarUpload is likely used within PersonalDetailsForm, so no direct import here unless it's a standalone step.
// import AvatarUpload from '../../components/onboarding/AvatarUpload';

const onboardingSteps: OnboardingStep[] = [
  'personal',
  'address',
  'organization',
  'family',
  'education',
  'bank',
  'uan',
  'esi',
  'gmc',
  'documents',
  'biometrics',
  'review',
];

const OnboardingProcessPage: React.FC = () => {
  const navigate = useNavigate();
  const { step } = useParams<{ step: OnboardingStep }>();
  const { currentStep, setCurrentStep } = useOnboarding();
  const { reset: _resetOnboardingStore } = useOnboardingStore();

  useEffect(() => {
    const stepIndex = onboardingSteps.indexOf(step as OnboardingStep);
    if (stepIndex !== -1 && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    } else if (!step) {
      // If no step in URL, default to the current step in context or 'personal'
      navigate(`/onboarding/add/${onboardingSteps[currentStep]}`, { replace: true });
    }
  }, [step, currentStep, setCurrentStep, navigate]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      navigate(`/onboarding/add/${nextStep}`);
    } else {
      // Handle final submission or review completion
      console.log('Onboarding process complete!');
      // navigate('/onboarding/success'); // Or a success page
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = onboardingSteps[currentStep - 1];
      setCurrentStep(currentStep - 1);
      navigate(`/onboarding/add/${prevStep}`);
    } else {
      // If on the first step, go back to the organization selection
      navigate('/onboarding/select-organization');
    }
  };

  const renderStepComponent = () => {
    switch (onboardingSteps[currentStep]) {
      case 'personal':
        return <PersonalDetailsForm onValidated={handleNext} />;
      case 'address':
        return <AddressDetailsForm onValidated={handleNext} />;
      case 'organization':
        return <div>Organization/Site Configuration Form Placeholder</div>; // Placeholder for site selection/details
      case 'family':
        return <FamilyDetailsForm  />;
      case 'education':
        return <EducationDetailsForm  />;
      case 'bank':
        return <BankDetailsForm onValidated={handleNext} />;
      case 'uan':
        return <UANDetailsForm  />;
      case 'esi':
        return <ESIDetailsForm  />;
      case 'gmc':
        return <GMCDetailsForm onValidated={handleNext} />;
      case 'uniform':
        return <div>Uniform Details Form Placeholder</div>; // Placeholder for Uniform step
      case 'documents':
        return <DocumentUploader label="Upload Documents" file={null} onFileChange={() => {}} />;
      case 'biometrics':
        return <div>Biometrics Capture Placeholder</div>; // Placeholder for Biometrics step
      case 'review':
        return <ReviewSubmit  />;
      default:
        return <div>Step not found</div>;
    }
  };

  const currentStepName = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-card p-8 rounded-2xl shadow-lg">
        <div className="mb-8">
          <MultiStepIndicator steps={onboardingSteps} currentStepIndex={currentStep} />
        </div>

        <FormHeader title={`${currentStepName.charAt(0).toUpperCase() + currentStepName.slice(1)} Details`} />

        <div className="py-6">
          {renderStepComponent()}
        </div>

        <div className="mt-8 flex justify-between">
          <Button onClick={handlePrevious} variant="secondary" disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button onClick={handleNext} variant="primary">
            {currentStep === onboardingSteps.length - 1 ? 'Submit' : 'Next'} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProcessPage;