import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { AddressDetails, Address } from '../../types/onboarding';
import Input from '../ui/Input';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';

const addressSchema = yup.object({
  line1: yup.string().required('Address line 1 is required'),
  line2: yup.string().optional(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().oneOf(['India'], 'Country must be India').required('Country is required'),
  pincode: yup.string().required('Pincode is required').matches(/^[1-9][0-9]{5}$/, 'Must be a valid 6-digit Indian pincode'),
  verifiedStatus: yup.object().optional(),
}).defined();

export const addressDetailsSchema = yup.object({
  present: addressSchema.required(),
  permanent: addressSchema.required(),
  sameAsPresent: yup.boolean().required(),
}).defined();

interface AddressDetailsFormProps {
  onValidated?: () => void;
  hideSubmit?: boolean;
}

export interface FormHandle {
  submit: () => void;
}

const AddressDetailsForm = forwardRef<FormHandle, AddressDetailsFormProps>(({ onValidated, hideSubmit }, ref) => {
  const { address, updateAddress, setAddressVerifiedStatus } = useOnboardingStore();
  const { address: addressSettings } = useSettingsStore();

  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const { register, handleSubmit, formState: { errors }, control, setValue, trigger, reset } = useForm<AddressDetails>({
    resolver: yupResolver(addressDetailsSchema) as any,
    defaultValues: address,
  });

  const sameAsPresent = useWatch({ control, name: 'sameAsPresent' });
  const presentAddress = useWatch({ control, name: 'present' });

  useEffect(() => {
    reset(address);
  }, [address, reset]);

  useEffect(() => {
    if (sameAsPresent) {
      setValue('permanent', presentAddress);
      trigger('permanent'); // re-validate to remove any errors
    }
  }, [sameAsPresent, presentAddress, setValue, trigger]);

  const handleManualInput = (type: 'present' | 'permanent', field: keyof Address) => {
    setAddressVerifiedStatus(type, { [field]: false });
  };

  const handlePincodeBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    handleManualInput('present', 'pincode');

    if (addressSettings.enablePincodeVerification && /^[1-9][0-9]{5}$/.test(pincode)) {
      setIsPincodeLoading(true);
      setPincodeError('');

      try {
        const details = await api.getPincodeDetails(pincode);
        setValue('present.city', details.city, { shouldValidate: true });
        setValue('present.state', details.state, { shouldValidate: true });
        setAddressVerifiedStatus('present', { city: true, state: true, pincode: true });
      } catch (error) {
        setPincodeError('Invalid Pincode. Please check and try again.');
      } finally {
        setIsPincodeLoading(false);
      }
    }
  };

  const onSubmit: SubmitHandler<AddressDetails> = async (formData) => {
    updateAddress(formData);
    if (onValidated) await onValidated();
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(onSubmit)();
    }
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Present Address</h3>
        <div className="space-y-4">
          <Input
            label="Address Line 1"
            {...register('present.line1')}
            error={errors.present?.line1?.message}
            onChange={() => handleManualInput('present', 'line1')}
          />
          <Input
            label="Address Line 2"
            {...register('present.line2')}
            error={errors.present?.line2?.message}
            onChange={() => handleManualInput('present', 'line2')}
          />
          <Input
            label="Pincode"
            {...register('present.pincode')}
            error={errors.present?.pincode?.message || pincodeError}
            onBlur={handlePincodeBlur}
            onChange={() => handleManualInput('present', 'pincode')}
          />
          {isPincodeLoading && <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />}
          <Input
            label="City"
            {...register('present.city')}
            error={errors.present?.city?.message}
            onChange={() => handleManualInput('present', 'city')}
          />
          <Input
            label="State"
            {...register('present.state')}
            error={errors.present?.state?.message}
            onChange={() => handleManualInput('present', 'state')}
          />
          <Input
            label="Country"
            {...register('present.country')}
            error={errors.present?.country?.message}
            onChange={() => handleManualInput('present', 'country')}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Permanent Address</h3>
        <label className="flex items-center gap-2 mb-4 text-sm">
          <input type="checkbox" {...register('sameAsPresent')} className="h-4 w-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500" />
          <span>Same as Present Address</span>
        </label>

        {!sameAsPresent && (
          <div className="space-y-4">
            <Input
              label="Address Line 1"
              {...register('permanent.line1')}
              error={errors.permanent?.line1?.message}
              onChange={() => handleManualInput('permanent', 'line1')}
            />
            <Input
              label="Address Line 2"
              {...register('permanent.line2')}
              error={errors.permanent?.line2?.message}
              onChange={() => handleManualInput('permanent', 'line2')}
            />
            <Input
              label="Pincode"
              {...register('permanent.pincode')}
              error={errors.permanent?.pincode?.message}
              onChange={() => handleManualInput('permanent', 'pincode')}
            />
            <Input
              label="City"
              {...register('permanent.city')}
              error={errors.permanent?.city?.message}
              onChange={() => handleManualInput('permanent', 'city')}
            />
            <Input
              label="State"
              {...register('permanent.state')}
              error={errors.permanent?.state?.message}
              onChange={() => handleManualInput('permanent', 'state')}
            />
            <Input
              label="Country"
              {...register('permanent.country')}
              error={errors.permanent?.country?.message}
              onChange={() => handleManualInput('permanent', 'country')}
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

export default AddressDetailsForm;