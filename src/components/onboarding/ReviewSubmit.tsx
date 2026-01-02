import React, { forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useOnboardingStore } from '../../store/onboardingStore';
import Button from '../ui/Button';
import type { OnboardingStep } from '../../types/onboarding';

interface ReviewSubmitProps {
  hideSubmit?: boolean;
  onEdit?: (step: OnboardingStep) => void;
}

export interface ReviewSubmitHandle {
  submit: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null | boolean | any }> = ({ label, value }) => {
  let displayValue = value;

  if (value && typeof value === 'object' && 'name' in value) {
    // Handle UploadedFile object
    displayValue = value.name;
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No';
  }

  const isEmpty = displayValue === null || displayValue === undefined || displayValue === '';

  return (
    <div className="my-1 flex justify-between border-b pb-1">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900 max-w-[60%] text-right truncate">
        {isEmpty ? '-' : String(displayValue)}
      </span>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; onEdit?: () => void }> = ({ title, onEdit }) => (
  <div className="flex justify-between items-center mt-6 mb-2">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-cyan-500 inline-block pr-2">{title}</h3>
    {onEdit && (
      <button
        onClick={onEdit}
        className="text-sm text-cyan-600 hover:text-cyan-800 underline"
      >
        Edit
      </button>
    )}
  </div>
);

const ReviewSubmit = forwardRef<ReviewSubmitHandle, ReviewSubmitProps>(({ hideSubmit, onEdit }, ref) => {
  const { personal, address, family, education, bank, gmc, esi, submitOnboarding } = useOnboardingStore();
  const [isDeclared, setIsDeclared] = React.useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!isDeclared) {
      showToast('Please check the declaration box to proceed.', { type: 'error' });
      return;
    }

    // Show loading state could be added here if needed, but for now just submit
    try {
      const result = await submitOnboarding();
      if (result.success) {
        navigate('/onboarding/success');
      } else {
        showToast(result.error || 'Submission failed. Please try again.', { type: 'error' });
      }
    } catch (error) {
      showToast('An unexpected error occurred.', { type: 'error' });
    }
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit();
    }
  }));

  const handleEdit = (step: OnboardingStep) => {
    if (onEdit) onEdit(step);
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Review Your Details</h2>

      <section>
        <SectionHeader title="Personal Details" onEdit={() => handleEdit('personal')} />
        <DetailItem label="Employee ID" value={personal.employeeId} />
        <DetailItem label="Full Name" value={`${personal.firstName} ${personal.lastName}`} />
        <DetailItem label="Date of Birth" value={personal.dob} />
        <DetailItem label="Gender" value={personal.gender} />
        <DetailItem label="Marital Status" value={personal.maritalStatus} />
        <DetailItem label="Blood Group" value={personal.bloodGroup} />
        <DetailItem label="Mobile" value={personal.mobile} />
        <DetailItem label="Email" value={personal.email} />
        {/* Add more personal fields if needed */}
      </section>

      <section>
        <SectionHeader title="Address Details" onEdit={() => handleEdit('address')} />
        <div className="mb-2">
          <h4 className="font-semibold text-gray-600 text-sm">Present Address</h4>
          <p className="text-sm">
            {address.present.line1}, {address.present.city}, {address.present.state} - {address.present.pincode}
          </p>
        </div>
        <div className="mb-2">
          <h4 className="font-semibold text-gray-600 text-sm">Permanent Address</h4>
          <p className="text-sm">
            {address.sameAsPresent ? 'Same as Present Address' :
              `${address.permanent.line1}, ${address.permanent.city}, ${address.permanent.state} - ${address.permanent.pincode}`
            }
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="Family Details" onEdit={() => handleEdit('family')} />
        {family.length > 0 ? (
          family.map((member, index) => (
            <div key={index} className="mb-2 bg-gray-50 p-2 rounded">
              <DetailItem label="Name" value={member.name} />
              <DetailItem label="Relation" value={member.relation} />
              <DetailItem label="DOB" value={member.dob} />
              <DetailItem label="Dependent" value={member.dependent} />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No family details added.</p>
        )}
      </section>

      <section>
        <SectionHeader title="Education Details" onEdit={() => handleEdit('education')} />
        {education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="mb-2 bg-gray-50 p-2 rounded">
              <DetailItem label="Degree" value={edu.degree} />
              <DetailItem label="Institution" value={edu.institution} />
              <DetailItem label="Year of Completion" value={edu.endYear} />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No education details added.</p>
        )}
      </section>

      <section>
        <SectionHeader title="Bank Details" onEdit={() => handleEdit('bank')} />
        <DetailItem label="Account Holder Name" value={bank.accountHolderName} />
        <DetailItem label="Bank Name" value={bank.bankName} />
        <DetailItem label="Account Number" value={bank.accountNumber} />
        <DetailItem label="IFSC Code" value={bank.ifscCode} />
        <DetailItem label="Branch Name" value={bank.branchName} />
      </section>

      <section>
        <SectionHeader title="GMC (Medical Cover)" onEdit={() => handleEdit('gmc')} />
        <DetailItem label="Opted In" value={gmc.isOptedIn} />
        {gmc.isOptedIn ? (
          <>
            <DetailItem label="Policy Amount" value={gmc.policyAmount} />
            <DetailItem label="Nominee Name" value={gmc.nomineeName} />
            <DetailItem label="Nominee Relationship" value={gmc.nomineeRelation} />
          </>
        ) : (
          <DetailItem label="Opt-out Reason" value={gmc.optOutReason} />
        )}
      </section>

      <section>
        <SectionHeader title="UAN Details" onEdit={() => handleEdit('uan')} />
        {personal.uanNumber ? (
          <>
            <DetailItem label="UAN Number" value={personal.uanNumber} />
            <DetailItem label="Previous PF" value={personal.hasPreviousPf} />
          </>
        ) : <p className="text-sm text-gray-500">No UAN details available.</p>}
      </section>

      <section>
        <SectionHeader title="ESI Details" onEdit={() => handleEdit('esi')} />
        {esi ? (
          <>
            <DetailItem label="Has ESI" value={esi.hasEsi} />
            <DetailItem label="ESI Number" value={esi.esiNumber} />
          </>
        ) : <p className="text-sm text-gray-500">No ESI details available.</p>}
      </section>

      <div className="mt-6 border-t pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isDeclared}
            onChange={(e) => setIsDeclared(e.target.checked)}
            className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
          />
          <span className="text-sm text-gray-700 italic">
            I hereby declare that the information provided is true and correct to the best of my knowledge.
          </span>
        </label>
      </div>

      {!hideSubmit && (
        <div className="mt-8">
          <Button onClick={handleSubmit} className="w-full" disabled={!isDeclared}>Submit Onboarding</Button>
        </div>
      )}
    </div>
  );
});

export default ReviewSubmit;