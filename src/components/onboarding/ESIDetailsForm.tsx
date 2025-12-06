import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { EsiDetails } from '../../types/onboarding';
import Input from '../ui/Input';

const ESIDetailsForm: React.FC = () => {
  const { esi, updateEsi } = useOnboardingStore();

  const { register, control } = useForm<EsiDetails>({ defaultValues: esi });

  const hasEsi = useWatch({ control, name: 'hasEsi' });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEsi({ hasEsi: e.target.checked });
  };

  return (
    <form>
      <label>
        <input type="checkbox" checked={hasEsi} onChange={handleCheckboxChange} />
        Are you covered under ESI?
      </label>

      {hasEsi && (
        <Input
          label="ESI Number"
          {...register('esiNumber')}
          defaultValue={esi.esiNumber}
          onChange={(e) => updateEsi({ esiNumber: e.target.value })}
        />
      )}
    </form>
  );
};

export default ESIDetailsForm;