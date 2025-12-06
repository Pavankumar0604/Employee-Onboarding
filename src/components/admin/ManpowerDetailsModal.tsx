import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { ManpowerDetail } from '../../types/mindmesh.d';

interface ManpowerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    siteName: string;
    details: ManpowerDetail[];
    isLoading: boolean;
    onSave: (details: ManpowerDetail[]) => void;
}

const ManpowerDetailsModal: React.FC<ManpowerDetailsModalProps> = ({
    isOpen,
    onClose,
    siteName,
    details,
    isLoading,
    onSave,
}) => {
    const [editableDetails, setEditableDetails] = useState<ManpowerDetail[]>(details);

    useEffect(() => {
        setEditableDetails(details);
    }, [details]);

    const handleCountChange = (id: string, newCount: string) => {
        setEditableDetails(prevDetails =>
            prevDetails.map(detail =>
                detail.id === id ? { ...detail, count: parseInt(newCount) || 0 } : detail
            )
        );
    };

    const handleSave = () => {
        onSave(editableDetails);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manpower Details - ${siteName}`}>
            <div>
                {isLoading ? (
                    <p>Loading manpower details...</p>
                ) : (
                    <div>
                        {editableDetails.map(detail => (
                            <div key={detail.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <p className="font-medium">{detail.designation}</p>
                                <Input
                                    type="number"
                                    value={detail.count.toString()}
                                    onChange={(e) => handleCountChange(detail.id, e.target.value)}
                                    className="w-20 text-right"
                                    min="0"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="button" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </Modal>
    );
};

export default ManpowerDetailsModal;