import React, { useState, useMemo, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { Entity } from '../../types/mindmesh';

interface AddSiteFromClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Entity, manpowerCount: number) => void;
  clients: Entity[]; // Added clients prop based on architectural review
}

const AddSiteFromClientForm: React.FC<AddSiteFromClientFormProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [manpowerCount, setManpowerCount] = useState<number>(0);
  const [errors, setErrors] = useState<{ client: string; manpower: string }>({ client: '', manpower: '' });

  // Filter clients that do not have an organizationId yet (i.e., are not yet sites)
  const availableClients = useMemo(() => {
    return clients.filter(client => !client.organizationId);
  }, [clients]);

  const selectedClient = useMemo(() => {
    return availableClients.find(client => client.id === selectedClientId);
  }, [availableClients, selectedClientId]);

  const resetForm = () => {
    setSelectedClientId('');
    setManpowerCount(0);
    setErrors({ client: '', manpower: '' });
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      // If there's only one available client, select it automatically (optional enhancement)
      if (availableClients.length === 1) {
        setSelectedClientId(availableClients[0].id);
      }
    }
  }, [isOpen, availableClients.length]);

  const validate = (): boolean => {
    let isValid = true;
    const newErrors = { client: '', manpower: '' };

    if (!selectedClientId) {
      newErrors.client = 'Client selection is required.';
      isValid = false;
    }

    const count = Number(manpowerCount);
    if (isNaN(count) || count <= 0) {
      newErrors.manpower = 'Manpower count must be a positive number.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (selectedClient) {
        onSave(selectedClient, Number(manpowerCount));
      }
    }
  };

  const clientOptions = useMemo(() => [
    { value: '', label: 'Select a Client', disabled: true },
    ...availableClients.map(client => ({
      value: client.id,
      label: `${client.name} (${client.companyName || 'N/A'})`,
    }))
  ], [availableClients]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Site From Client"
      onConfirm={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
      confirmText="Add Site"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          id="client-select"
          label="Client Entity"
          options={clientOptions}
          value={selectedClientId}
          onChange={(e) => {
            setSelectedClientId(e.target.value);
            setErrors(prev => ({ ...prev, client: '' }));
          }}
          error={errors.client}
          required
        />

        <Input
          id="manpower-count"
          label="Approved Manpower Count"
          type="number"
          value={manpowerCount > 0 ? String(manpowerCount) : ''}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setManpowerCount(isNaN(val) ? 0 : val);
            setErrors(prev => ({ ...prev, manpower: '' }));
          }}
          error={errors.manpower}
          min="1"
          required
        />
        
        {selectedClient && (
            <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                <p><strong>Selected Client:</strong> {selectedClient.name}</p>
                <p><strong>Location:</strong> {selectedClient.location || 'N/A'}</p>
            </div>
        )}
      </form>
    </Modal>
  );
};

export default AddSiteFromClientForm;