import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { EducationRecord, UploadedFile } from '../../types/onboarding';
import Input from '../ui/Input';
import Button from '../ui/Button';
import DocumentUploader from './DocumentUploader';
import Modal from '../ui/Modal';
import { Plus, Trash2 } from 'lucide-react';

const EducationDetailsForm: React.FC = () => {
  const { education, addEducationRecord, updateEducationRecord, removeEducationRecord } = useOnboardingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToRemove, setRecordToRemove] = useState<string | null>(null);

  const handleAddRecord = () => {
    addEducationRecord();
  };

  const handleRemoveClick = (id: string) => {
    setRecordToRemove(id);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (recordToRemove) {
      removeEducationRecord(recordToRemove);
      setIsModalOpen(false);
      setRecordToRemove(null);
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
        Are you sure you want to remove this education record? This action cannot be undone.
      </Modal>
      {education.map((record: EducationRecord) => (
        <div key={record.id} className="relative border p-4 my-2 rounded">
          <button
            type="button"
            onClick={() => handleRemoveClick(record.id)}
            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"
            aria-label="Remove education record"
          >
            <Trash2 size={16} />
          </button>
          <Input
            label="Degree"
            value={record.degree}
            onChange={(e) => updateEducationRecord(record.id, { degree: e.target.value })}
          />
          <Input
            label="Institution"
            value={record.institution}
            onChange={(e) => updateEducationRecord(record.id, { institution: e.target.value })}
          />
          <Input
            label="End Year"
            value={record.endYear}
            onChange={(e) => updateEducationRecord(record.id, { endYear: e.target.value })}
          />
          <DocumentUploader
            label="Document"
            file={record.document}
            onFileChange={(file: UploadedFile | null) => updateEducationRecord(record.id, { document: file })}
          />
        </div>
      ))}
      <Button type="button" icon={<Plus size={14} />} onClick={handleAddRecord}>
        Add Qualification
      </Button>
    </>
  );
};

export default EducationDetailsForm;