import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useEnrollmentRulesStore } from '../../store/enrollmentRulesStore';
import type { GmcDetails } from '../../types/onboarding';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const validationSchema = yup.object({
  // Accept both string (from form) and boolean (from store) to be safe
  isOptedIn: yup.mixed().test(
    'is-opted-in-check',
    'Please select an option',
    val => val === true || val === false || val === 'true' || val === 'false'
  ).required('Please select an option'),
  optOutReason: yup.string().when('isOptedIn', {
    is: (val: any) => val === false || val === 'false',
    then: schema => schema.required('Reason for opting out is required'),
    otherwise: schema => schema.optional(),
  }),
  policyAmount: yup.string().when('isOptedIn', {
    is: (val: any) => val === true || val === 'true',
    then: schema => schema.oneOf(['1L', '2L', '']).required('Policy amount is required'),
    otherwise: schema => schema.optional(),
  }),
  nomineeName: yup.string().when('isOptedIn', {
    is: (val: any) => val === true || val === 'true',
    then: schema => schema.required('Nominee name is required'),
    otherwise: schema => schema.optional(),
  }),
  nomineeRelation: yup.string().when('isOptedIn', {
    is: (val: any) => val === true || val === 'true',
    then: schema => schema.oneOf(['Spouse', 'Child', 'Father', 'Mother', '']).required('Nominee relation is required'),
    otherwise: schema => schema.optional(),
  }),
  wantsToAddDependents: yup.boolean().optional(),
  selectedSpouseId: yup.string().optional(),
  selectedChildIds: yup.array().of(yup.string().required()).optional(),
  gmcPolicyCopy: yup.mixed().optional().nullable(),
  declarationAccepted: yup.boolean().optional(),
  alternateInsuranceProvider: yup.string().optional(),
  alternateInsuranceStartDate: yup.string().optional(),
  alternateInsuranceEndDate: yup.string().optional(),
  alternateInsuranceCoverage: yup.string().optional(),
}).defined();

interface GMCDetailsFormProps {
  onValidated?: () => void;
  hideSubmit?: boolean;
}

export interface FormHandle {
  submit: () => void;
}

const GMCDetailsForm = forwardRef<FormHandle, GMCDetailsFormProps>(({ onValidated, hideSubmit }, ref) => {
  const gmc = useOnboardingStore(state => state.gmc);
  const updateGmc = useOnboardingStore(state => state.updateGmc);
  const personalSalary = useOnboardingStore(state => state.personal.salary);
  const maritalStatus = useOnboardingStore(state => state.personal.maritalStatus);

  const { salaryThreshold, defaultPolicySingle, defaultPolicyMarried } = useEnrollmentRulesStore();

  // Cast defaultValues to any because store has boolean but form works with strings for radios
  const defaultValues = {
    ...gmc,
    isOptedIn: gmc.isOptedIn === null ? null : String(gmc.isOptedIn),
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<GmcDetails | any>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: defaultValues,
  });

  const currentPolicyInForm = watch('policyAmount');
  const isGmcApplicable = personalSalary != null && personalSalary > salaryThreshold;

  const isOptedInValue = watch('isOptedIn') === 'true';

  useEffect(() => {
    if (!isGmcApplicable) {
      if (currentPolicyInForm) {
        setValue('policyAmount', '');
      }
      return;
    }

    const effectiveDefault = maritalStatus === 'Married' ? defaultPolicyMarried : defaultPolicySingle;

    if (currentPolicyInForm !== effectiveDefault) {
      setValue('policyAmount', effectiveDefault);
    }
  }, [isGmcApplicable, maritalStatus, defaultPolicySingle, defaultPolicyMarried, currentPolicyInForm, setValue]);

  const onSubmit: SubmitHandler<any> = (formData) => {
    // Convert string "true"/"false" back to boolean for the store
    const finalData = {
      ...formData,
      isOptedIn: formData.isOptedIn === 'true',
    };
    updateGmc(finalData);
    if (onValidated) onValidated();
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (!isGmcApplicable) {
        if (onValidated) onValidated();
        return;
      }
      handleSubmit(onSubmit)();
    }
  }));

  if (!isGmcApplicable) {
    const thresholdText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(salaryThreshold);
    return (
      <div>
        Group Medical Cover is only applicable for employees with a monthly salary greater than {thresholdText}.
      </div>
    );
  }

  const marriedPolicyText = defaultPolicyMarried.replace('L', ' Lakh');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" value="true" {...register('isOptedIn')} className="h-4 w-4 text-cyan-500 border-gray-300 focus:ring-cyan-500" />
            <span className="text-gray-700 font-medium">Opt-in for GMC</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="false" {...register('isOptedIn')} className="h-4 w-4 text-cyan-500 border-gray-300 focus:ring-cyan-500" />
            <span className="text-gray-700 font-medium">Opt-out of GMC</span>
          </label>
        </div>
        {errors.isOptedIn && <p className="text-red-500 text-sm mt-1">{errors.isOptedIn.message as string}</p>}

        {/* Use normalized boolean value for conditional rendering */}
        {!isOptedInValue && watch('isOptedIn') !== null && watch('isOptedIn') !== undefined && String(watch('isOptedIn')) === 'false' && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Input label="Reason for Opting Out" {...register('optOutReason')} error={errors.optOutReason?.message as string} />
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold text-blue-900 mb-2">Alternate Insurance Details (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Insurance Provider" {...register('alternateInsuranceProvider')} />
                <Input label="Policy Start Date" type="date" {...register('alternateInsuranceStartDate')} />
                <Input label="Policy End Date" type="date" {...register('alternateInsuranceEndDate')} />
                <Input label="Coverage Amount" {...register('alternateInsuranceCoverage')} />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" {...register('declarationAccepted')} className="mt-1 h-4 w-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500" />
              <span className="text-sm text-gray-600">I hereby declare that I have existing medical insurance coverage/do not wish to avail the company provided GMC facility.</span>
            </div>
          </div>
        )}

        {isOptedInValue && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                Based on your marital status ({maritalStatus}), you are eligible for a default cover of <strong>{marriedPolicyText}</strong>.
              </p>
            </div>

            <Input label="Nominee Name" {...register('nomineeName')} error={errors.nomineeName?.message as string} />
            <Select
              label="Nominee Relationship"
              options={[
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Child', label: 'Child' },
                { value: 'Father', label: 'Father' },
                { value: 'Mother', label: 'Mother' },
              ]}
              {...register('nomineeRelation')}
              error={errors.nomineeRelation?.message as string}
            />
          </div>
        )}
      </div>

      {!hideSubmit && (
        <div className="pt-6">
          <button
            type="submit"
            className="w-full px-5 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </form>
  );
});

export default GMCDetailsForm;
