import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useOnboarding } from '../../store/OnboardingContext';
import MultiStepIndicator from '../../components/onboarding/MultiStepIndicator';
import FormHeader from '../../components/onboarding/FormHeader';
import Button from '../../components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { OnboardingStep } from '../../types/onboarding';

// Import all onboarding components
import PersonalDetailsForm, { FormHandle } from '../../components/onboarding/PersonalDetailsForm';
import AddressDetailsForm from '../../components/onboarding/AddressDetailsForm';
import FamilyDetailsForm from '../../components/onboarding/FamilyDetailsForm';
import EducationDetailsForm from '../../components/onboarding/EducationDetailsForm';
import BankDetailsForm from '../../components/onboarding/BankDetailsForm';
import UANDetailsForm from '../../components/onboarding/UANDetailsForm';
import ESIDetailsForm from '../../components/onboarding/ESIDetailsForm';
import GMCDetailsForm from '../../components/onboarding/GMCDetailsForm';
import DocumentUploader from '../../components/onboarding/DocumentUploader';
import ReviewSubmit from '../../components/onboarding/ReviewSubmit';

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

  const formRef = useRef<FormHandle>(null);

  useEffect(() => {
    const stepIndex = onboardingSteps.indexOf(step as OnboardingStep);
    if (stepIndex !== -1 && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    } else if (!step) {
      navigate(`/onboarding/add/${onboardingSteps[currentStep]}`, { replace: true });
    }
  }, [step, currentStep, setCurrentStep, navigate]);

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      navigate(`/onboarding/add/${nextStep}`);
    } else {
      console.log('Onboarding process complete!');
    }
  };

  const handleNextClick = () => {
    // If the current step component has a ref exposed and we can call submit on it
    if (formRef.current) {
      formRef.current.submit();
    } else {
      // Fallback for components that might not need validation or don't expose ref yet
      // For now, mostly "details" forms have refs.
      // If a component doesn't have ref, we just proceed (or add specific logic)
      // Check if current step corresponds to a form that NEEDS validation but ref is missing?
      // Actually, for steps without forms (like just info or uploaders handling their own state differently), we might just allow next.
      // However, based on requirements, we are refactoring: Personal, Address, Bank, GMC.
      // Others like Family, Education, UAN, ESI seem to be placeholders or not fully refactored to forwardRef yet?
      // Let's check which steps use the ref.

      const stepsWithRefs = ['personal', 'address', 'bank', 'gmc'];
      if (stepsWithRefs.includes(onboardingSteps[currentStep])) {
        // If it shows up here without ref.current, it might be an issue, but normally it should differ.
        // Wait, if I'm not rendering the component with `ref={formRef}`, it won't work.
        // I need to attach ref in renderStepComponent.
        // If for some reason ref is null (e.g. Placeholder), we act safely.
        handleNextStep();
      } else {
        handleNextStep();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = onboardingSteps[currentStep - 1];
      setCurrentStep(currentStep - 1);
      navigate(`/onboarding/add/${prevStep}`);
    } else {
      navigate('/onboarding/select-organization');
    }
  };

  const handleEditStep = (stepName: OnboardingStep) => {
    const stepIndex = onboardingSteps.indexOf(stepName);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      navigate(`/onboarding/add/${stepName}`);
    }
  };

  const renderStepComponent = () => {
    switch (onboardingSteps[currentStep]) {
      case 'personal':
        return <PersonalDetailsForm ref={formRef} onValidated={handleNextStep} hideSubmit={true} />;
      case 'address':
        return <AddressDetailsForm ref={formRef} onValidated={handleNextStep} hideSubmit={true} />;
      case 'organization':
        return <div>Organization/Site Configuration Form Placeholder</div>;
      case 'family':
        return <FamilyDetailsForm />;
      case 'education':
        return <EducationDetailsForm />;
      case 'bank':
        return <BankDetailsForm ref={formRef} onValidated={handleNextStep} hideSubmit={true} />;
      case 'uan':
        return <UANDetailsForm />;
      case 'esi':
        return <ESIDetailsForm />;
      case 'gmc':
        return <GMCDetailsForm ref={formRef} onValidated={handleNextStep} hideSubmit={true} />;
      case 'uniform':
        return <div>Uniform Details Form Placeholder</div>;
      case 'documents':
        return <DocumentUploader label="Upload Documents" file={null} onFileChange={() => { }} />;
      case 'biometrics':
        return <div>Biometrics Capture Placeholder</div>;
      case 'review':
        return <ReviewSubmit ref={formRef} hideSubmit={true} onEdit={handleEditStep} />;
      default:
        return <div>Step not found</div>;
    }
  };

  const currentStepName = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-4 ">
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
          <Button onClick={handleNextClick} variant="primary">
            {currentStep === onboardingSteps.length - 1 ? 'Submit' : 'Next'} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProcessPage;
