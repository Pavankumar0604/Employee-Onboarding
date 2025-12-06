import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { FamilyMember } from '../../types/onboarding';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

const FamilyDetailsForm: React.FC = () => {
  const { family, addFamilyMember, removeFamilyMember, updateFamilyMember } = useOnboardingStore();

  const { control } = useForm({ defaultValues: { family } });

  const { fields } = useFieldArray({
    control,
    name: 'family',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);

  const handleAddMember = () => {
    addFamilyMember();
  };

  const handleRemoveClick = (index: number) => {
    setMemberToRemove(index);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove !== null) {
      const memberId = fields[memberToRemove].id;
      removeFamilyMember(memberId);
      // We don't call react-hook-form's remove, since Zustand is the source of truth and component will re-render.
      setIsModalOpen(false);
      setMemberToRemove(null);
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Confirm Deletion"
      >
        Are you sure you want to remove this family member? This action cannot be undone.
      </Modal>
      {family.map((member, index) => (
        <div key={member.id} className="relative border p-4 my-2 rounded">
          <button
            type="button"
            onClick={() => handleRemoveClick(index)}
            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"
            aria-label="Remove family member"
          >
            <Trash2 size={16} />
          </button>
          <Select
            label="Relation"
            value={member.relation}
            options={['Spouse', 'Child', 'Father', 'Mother', 'Sibling', 'Other'].map(r => ({ value: r, label: r }))}
            onChange={(e) => updateFamilyMember(member.id, { relation: e.target.value as FamilyMember['relation'] })}
          />
          <Input
            label="Name"
            value={member.name}
            onChange={(e) => updateFamilyMember(member.id, { name: e.target.value })}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={member.dob}
            onChange={(e) => updateFamilyMember(member.id, { dob: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={member.dependent}
              onChange={(e) => updateFamilyMember(member.id, { dependent: e.target.checked })}
            />
            Dependent?
          </label>
        </div>
      ))}
      <Button type="button" icon={<Plus size={14} />} onClick={handleAddMember}>
        Add Family Member
      </Button>
    </>
  );
};

export default FamilyDetailsForm;