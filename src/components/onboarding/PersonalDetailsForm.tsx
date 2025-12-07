import { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { PersonalDetails } from '../../types/onboarding';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { AvatarUpload } from './AvatarUpload';

const validationSchema = yup.object({
  employeeId: yup.string().required(),
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().optional(),
  lastName: yup.string().required('Last name is required'),
  preferredName: yup.string().optional(),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().oneOf(['Male', 'Female', 'Other', '']).required('Gender is required'),
  maritalStatus: yup.string().oneOf(['Single', 'Married', 'Divorced', 'Widowed', '']).required('Marital status is required'),
  bloodGroup: yup.string().oneOf(['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).required('Blood group is required'),
  mobile: yup.string().required('Mobile number is required').matches(/^[6-9][0-9]{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  alternateMobile: yup.string().optional().nullable(),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  idProofType: yup.string<'Aadhaar' | 'PAN' | ''>().oneOf(['Aadhaar', 'PAN', '']).optional(),
  idProofNumber: yup.string().optional(),
  photo: yup.mixed().optional().nullable(),
  idProof: yup.mixed().optional().nullable(),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactNumber: yup.string().required('Emergency contact number is required').matches(/^[6-9][0-9]{9}$/, 'Must be a valid 10-digit number'),
  relationship: yup.string().oneOf(['Spouse', 'Child', 'Father', 'Mother', 'Sibling', 'Other', '']).required('Relationship is required'),
  salary: yup.number().typeError('Salary must be a number').min(0).required('Salary is required').nullable(),
  verifiedStatus: yup.object().optional(),
}).defined();

export interface PersonalDetailsFormProps {
  onValidated?: () => void;
  hideSubmit?: boolean;
}

export interface FormHandle {
  submit: () => void;
}

const PersonalDetailsForm = forwardRef<FormHandle, PersonalDetailsFormProps>(({ onValidated, hideSubmit }, ref) => {
  const { personal, updatePersonal, addOrUpdateEmergencyContactAsFamilyMember } = useOnboardingStore();

  const { register, handleSubmit, formState: { errors }, control } = useForm<PersonalDetails>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: personal,
  });

  const onSubmit: SubmitHandler<PersonalDetails> = (formData) => {
    updatePersonal(formData);
    addOrUpdateEmergencyContactAsFamilyMember();
    if (onValidated) onValidated();
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(onSubmit)();
    }
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Employee ID" {...register('employeeId')} error={errors.employeeId?.message} />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo</label>
          <Controller
            control={control}
            name="photo"
            render={({ field: { onChange, value } }) => (
              <>
                <AvatarUpload
                  file={value as any}
                  onFileChange={onChange}
                />
                {errors.photo?.message && <p className="text-sm text-red-500 mt-1">{errors.photo.message as string}</p>}
              </>
            )}
          />
        </div>
        <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Middle Name" {...register('middleName')} error={errors.middleName?.message} />
        <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
        <Input label="Preferred Name" {...register('preferredName')} error={errors.preferredName?.message} />
        <Input label="Date of Birth" type="date" {...register('dob')} error={errors.dob?.message} />
        <Select
          label="Gender"
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          {...register('gender')}
          error={errors.gender?.message}
        />
        <Select
          label="Marital Status"
          options={[
            { value: 'Single', label: 'Single' },
            { value: 'Married', label: 'Married' },
            { value: 'Divorced', label: 'Divorced' },
            { value: 'Widowed', label: 'Widowed' },
          ]}
          {...register('maritalStatus')}
          error={errors.maritalStatus?.message}
        />
        <Select
          label="Blood Group"
          options={[
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' },
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' },
          ]}
          {...register('bloodGroup')}
          error={errors.bloodGroup?.message}
        />
        <Input label="Mobile Number" {...register('mobile')} error={errors.mobile?.message} />
        <Input label="Alternate Mobile" {...register('alternateMobile')} error={errors.alternateMobile?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

        <Select
          label="ID Proof Type"
          options={[
            { value: 'Aadhaar', label: 'Aadhaar' },
            { value: 'PAN', label: 'PAN' },
          ]}
          {...register('idProofType')}
          error={errors.idProofType?.message}
        />
        <Input label="ID Proof Number" {...register('idProofNumber')} error={errors.idProofNumber?.message} />

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Emergency Contact</h3>
        </div>

        <Input label="Contact Name" {...register('emergencyContactName')} error={errors.emergencyContactName?.message} />
        <Input label="Contact Number" {...register('emergencyContactNumber')} error={errors.emergencyContactNumber?.message} />
        <Select
          label="Relationship"
          options={[
            { value: 'Spouse', label: 'Spouse' },
            { value: 'Child', label: 'Child' },
            { value: 'Father', label: 'Father' },
            { value: 'Mother', label: 'Mother' },
            { value: 'Sibling', label: 'Sibling' },
            { value: 'Other', label: 'Other' },
          ]}
          {...register('relationship')}
          error={errors.relationship?.message}
        />
        <Input label="Salary" type="number" {...register('salary')} error={errors.salary?.message} />

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

export default PersonalDetailsForm;