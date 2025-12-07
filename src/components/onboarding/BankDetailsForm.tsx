import { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { BankDetails, UploadedFile } from '../../types/onboarding';
import Input from '../ui/Input';
import DocumentUploader from './DocumentUploader';

const validationSchema = yup.object({
  accountHolderName: yup.string().required('Account holder name is required'),
  accountNumber: yup.string().required('Account number is required').matches(/^[0-9]+$/, 'Must be only digits'),
  confirmAccountNumber: yup.string()
    .oneOf([yup.ref('accountNumber')], 'Account numbers must match')
    .required('Please confirm your account number'),
  ifscCode: yup.string().required('IFSC code is required').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  bankName: yup.string().required('Bank name is required'),
  branchName: yup.string().required('Branch name is required'),
  bankProof: yup.mixed<UploadedFile>().optional().nullable(),
}).defined();

interface BankDetailsFormProps {
  onValidated?: () => void;
  hideSubmit?: boolean;
}

export interface FormHandle {
  submit: () => void;
}

const BankDetailsForm = forwardRef<FormHandle, BankDetailsFormProps>(({ onValidated, hideSubmit }, ref) => {
  const { bank, updateBank } = useOnboardingStore();

  const { register, handleSubmit, formState: { errors }, control } = useForm<BankDetails>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: bank,
  });

  const onSubmit: SubmitHandler<BankDetails> = (formData) => {
    updateBank(formData);
    if (onValidated) onValidated();
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(onSubmit)();
    }
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Account Holder Name" {...register('accountHolderName')} error={errors.accountHolderName?.message} />
      <Input label="Account Number" {...register('accountNumber')} error={errors.accountNumber?.message} />
      <Input label="Confirm Account Number" {...register('confirmAccountNumber')} error={errors.confirmAccountNumber?.message} />
      <Input label="IFSC Code" {...register('ifscCode')} error={errors.ifscCode?.message} />
      <Input label="Bank Name" {...register('bankName')} error={errors.bankName?.message} />
      <Input label="Branch Name" {...register('branchName')} error={errors.branchName?.message} />

      <Controller
        control={control}
        name="bankProof"
        render={({ field }) => (
          <DocumentUploader label="Bank Proof Document" file={field.value} onFileChange={field.onChange} />
        )}
      />

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

export default BankDetailsForm;