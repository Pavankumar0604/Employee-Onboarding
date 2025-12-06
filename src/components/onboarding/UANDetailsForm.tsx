import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { PersonalDetails } from '../../types/onboarding';
import Input from '../ui/Input';

const UANDetailsForm: React.FC = () => {
  const { personal, updatePersonal } = useOnboardingStore();
  const data = personal;

  const { register, control } = useForm<PersonalDetails>({ defaultValues: data });

  const hasPreviousPf = useWatch({ control, name: 'hasPreviousPf' });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonal({ ...data, hasPreviousPf: e.target.checked });
  };

  return (
    <form>
      <label>
        <input type="checkbox" checked={hasPreviousPf} onChange={handleCheckboxChange} />
          Do you have a previous PF account or UAN?
      </label>

      {hasPreviousPf && (
        <>
          <Input
            label="UAN Number"
            {...register('uanNumber')}
            defaultValue={data?.uanNumber}
            onChange={(e) => updatePersonal({ uanNumber: e.target.value })}
          />
          <Input
            label="PF Number"
            {...register('pfNumber')}
            defaultValue={data?.pfNumber}
            onChange={(e) => updatePersonal({ pfNumber: e.target.value })}
          />
        </>
      )}
    </form>
  );
};

export default UANDetailsForm;