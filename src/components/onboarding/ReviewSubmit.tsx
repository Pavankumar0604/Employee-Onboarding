import React, { forwardRef, useImperativeHandle } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import Button from '../ui/Button';

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="my-1 flex justify-between border-b pb-1">
    <span className="font-semibold">{label}</span>
    <span>{value ?? '-'}</span>
  </div>
);

interface ReviewSubmitProps {
  hideSubmit?: boolean;
}

export interface ReviewSubmitHandle {
  submit: () => void;
}

const ReviewSubmit = forwardRef<ReviewSubmitHandle, ReviewSubmitProps>(({ hideSubmit }, ref) => {
  const personal = useOnboardingStore(state => state.personal);
  const address = useOnboardingStore(state => state.address);
  const family = useOnboardingStore(state => state.family);
  const submitOnboarding = useOnboardingStore(state => state.submitOnboarding);

  const handleSubmit = async () => {
    await submitOnboarding();
    alert('Onboarding submitted successfully!');
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit();
    }
  }));

  return (
    <div>

      <section>
        <h3>Personal Details</h3>
        <DetailItem label="Employee ID" value={personal.employeeId} />
        <DetailItem label="Name" value={`${personal.firstName} ${personal.lastName}`} />
        <DetailItem label="Date of Birth" value={personal.dob} />
        <DetailItem label="Gender" value={personal.gender} />
        {/* Add other personal details as necessary */}
      </section>

      <section>
        <h3>Address Details</h3>
        <DetailItem label="Present Address" value={`${address.present.line1}, ${address.present.city}, ${address.present.state}`} />
        <DetailItem label="Permanent Address" value={`${address.permanent.line1}, ${address.permanent.city}, ${address.permanent.state}`} />
      </section>

      <section>
        <h3>Family Details</h3>
        {family.length > 0 ? (
          family.map((member: any) => (
            <DetailItem key={member.id} label={member.relation} value={member.name} />
          ))
        ) : (
          <p>No family details added.</p>
        )}
      </section>

      {/* Repeat sections for Education, Bank, UAN, ESI, GMC as needed */}

      {!hideSubmit && (
        <div className="mt-4">
          <Button onClick={handleSubmit}>Submit Onboarding</Button>
        </div>
      )}

      <p className="mt-4 text-xs italic">
        I hereby declare that the information provided is true and correct to the best of my knowledge.
      </p>
    </div>
  );
});

export default ReviewSubmit;