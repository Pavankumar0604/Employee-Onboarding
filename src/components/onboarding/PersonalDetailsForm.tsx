import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { PersonalDetails } from '../../types/onboarding';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { AvatarUpload } from './AvatarUpload.tsx';

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

interface PersonalDetailsFormProps {
  onValidated: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onValidated }) => {
  const { personal, updatePersonal, addOrUpdateEmergencyContactAsFamilyMember } = useOnboardingStore();

  const { register, handleSubmit, formState: { errors }, control } = useForm<PersonalDetails>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: personal,
  });

  const onSubmit: SubmitHandler<PersonalDetails> = (formData) => {
    updatePersonal(formData);
    addOrUpdateEmergencyContactAsFamilyMember();
    onValidated();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Employee ID" {...register('employeeId')} error={errors.employeeId?.message} />
      <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
      <Input label="Middle Name" {...register('middleName')} error={errors.middleName?.message} />
      <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
      <Input label="Preferred Name" {...register('preferredName')} error={errors.preferredName?.message} />
      <Input label="Date of Birth" type="date" {...register('dob')} error={errors.dob?.message} />
      <Select label="Gender" {...register('gender')} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} error={errors.gender?.message} />
      <Select label="Marital Status" {...register('maritalStatus')} options={[{ value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' }, { value: 'Divorced', label: 'Divorced' }, { value: 'Widowed', label: 'Widowed' }]} error={errors.maritalStatus?.message} />
      <Select label="Blood Group" {...register('bloodGroup')} options={[{ value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' }, { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' }, { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }]} error={errors.bloodGroup?.message} />
      <Input label="Mobile" {...register('mobile')} error={errors.mobile?.message} />
      <Input label="Alternate Mobile" {...register('alternateMobile')} error={errors.alternateMobile?.message} />
      <Input label="Email" {...register('email')} error={errors.email?.message} />
      <Input label="ID Proof Number" {...register('idProofNumber')} error={errors.idProofNumber?.message} />
      {/* Avatar upload for photo */}
      <Controller
        control={control}
        name="photo"
        render={({ field }) => (
          <AvatarUpload file={field.value} onFileChange={field.onChange} />
        )}
      />
      {/* Emergency contact info */}
      <Input label="Emergency Contact Name" {...register('emergencyContactName')} error={errors.emergencyContactName?.message} />
      <Input label="Emergency Contact Number" {...register('emergencyContactNumber')} error={errors.emergencyContactNumber?.message} />
      <Select label="Relationship" {...register('relationship')} options={[{ value: 'Spouse', label: 'Spouse' }, { value: 'Child', label: 'Child' }, { value: 'Father', label: 'Father' }, { value: 'Mother', label: 'Mother' }, { value: 'Sibling', label: 'Sibling' }, { value: 'Other', label: 'Other' }]} error={errors.relationship?.message} />
      <Input label="Salary" type="number" {...register('salary')} error={errors.salary?.message} />
      <button type="submit">Next</button>
    </form>
  );
};

export default PersonalDetailsForm;