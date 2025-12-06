import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useEnrollmentRulesStore } from '../../store/enrollmentRulesStore';
import type { GmcDetails } from '../../types/onboarding';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const validationSchema = yup.object({
  isOptedIn: yup.boolean().nullable().required('Please select an option'),
  optOutReason: yup.string().when('isOptedIn', {
    is: false,
    then: schema => schema.required('Reason for opting out is required'),
    otherwise: schema => schema.optional(),
  }),
  policyAmount: yup.string().when('isOptedIn', {
    is: true,
    then: schema => schema.oneOf(['1L', '2L', '']).required('Policy amount is required'),
    otherwise: schema => schema.optional(),
  }),
  nomineeName: yup.string().when('isOptedIn', {
    is: true,
    then: schema => schema.required('Nominee name is required'),
    otherwise: schema => schema.optional(),
  }),
  nomineeRelation: yup.string().when('isOptedIn', {
    is: true,
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
  onValidated: () => void;
}

const GMCDetailsForm: React.FC<GMCDetailsFormProps> = ({ onValidated }) => {
  const gmc = useOnboardingStore(state => state.gmc);
  const updateGmc = useOnboardingStore(state => state.updateGmc);
  const personalSalary = useOnboardingStore(state => state.personal.salary);
  const maritalStatus = useOnboardingStore(state => state.personal.maritalStatus);

  const { salaryThreshold, defaultPolicySingle, defaultPolicyMarried } = useEnrollmentRulesStore();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<GmcDetails>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: gmc,
  });

  const currentPolicyInForm = watch('policyAmount');
  const isGmcApplicable = personalSalary != null && personalSalary > salaryThreshold;

  useEffect(() => {
    if (!isGmcApplicable) {
      if (currentPolicyInForm) {
        setValue('policyAmount', '');
      }
      return;
    }

    const effectiveDefault = maritalStatus === 'Married' ? defaultPolicyMarried : defaultPolicySingle;

    if (currentPolicyInForm !== effectiveDefault) {
      setValue('policyAmount', effectiveDefault as GmcDetails['policyAmount']);
    }
  }, [isGmcApplicable, maritalStatus, defaultPolicySingle, defaultPolicyMarried, currentPolicyInForm, setValue]);

  const onSubmit: SubmitHandler<GmcDetails> = (formData) => {
    updateGmc(formData);
    onValidated();
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>

      <label>
        <input type="radio" value="true" {...register('isOptedIn')} />
        Opted In
      </label>
      <label>
        <input type="radio" value="false" {...register('isOptedIn')} />
        Opted Out
      </label>
      {errors.isOptedIn && <p className="error">{errors.isOptedIn.message}</p>}

      {watch('isOptedIn') === false && (
        <div>
          <label>Reason for opting out</label>
          <input {...register('optOutReason')} />
          {errors.optOutReason && <p className="error">{errors.optOutReason.message}</p>}
        </div>
      )}

      {watch('isOptedIn') === true && (
        <>
          <label>
            Select Policy Amount
            {maritalStatus === 'Married' && (
              <p>As a married employee, you are automatically enrolled in the {marriedPolicyText} policy.</p>
            )}
          </label>
          <select {...register('policyAmount')}>
            <option value="">Select</option>
            <option value="1L">1 Lakh Policy</option>
            <option value="2L">2 Lakh Policy</option>
          </select>
          {errors.policyAmount && <p className="error">{errors.policyAmount.message}</p>}

          <Input label="Nominee Name" {...register('nomineeName')} error={errors.nomineeName?.message} />
          <Select label="Nominee Relation" {...register('nomineeRelation')} options={['Spouse', 'Child', 'Father', 'Mother'].map(r => ({ value: r, label: r }))} error={errors.nomineeRelation?.message} />

          {/* Additional fields related to dependents, alternate insurance, etc., can be added here */}

          <button type="submit">Next</button>
        </>
      )}
    </form>
  );
};

export default GMCDetailsForm;
