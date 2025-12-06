import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import type { Insurance } from '../../types/mindmesh';
import { Plus, Edit, FileText, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import InsuranceForm from '../../components/hr/InsuranceForm.tsx';

const TabButton: React.FC<{ icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => {
    const activeClasses = 'text-sky-700 border-sky-400';
    const inactiveClasses = 'text-gray-500 border-transparent hover:text-sky-700';
    
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-2 border-b-2 transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses}`}
        >
            <Icon className={`h-5 w-5 mr-2 ${isActive ? 'text-sky-700' : 'text-gray-400'}`} />
            <span className="font-medium">{label}</span>
        </button>
    );
};

const InsuranceManagement: React.FC = () => {
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentInsurance, setCurrentInsurance] = useState<Insurance | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = useState<'policies' | 'insurance'>('policies');
    
    const fetchInsurances = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getInsurances();
            if (data) {
                setInsurances(data);
            } else {
                setInsurances([]);
            }
        } catch (error) {
            setToast({ message: 'Failed to fetch insurance policies.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInsurances();
    }, [fetchInsurances]);
    
    const handleSave = async (data: Omit<Insurance, 'id'>) => {
        try {
            // Map camelCase fields to snake_case/DB fields for API payload
            const payload = {
                type: data.type,
                provider: data.provider,
                policy_number: data.policyNumber, // Mapping policyNumber (camelCase input) to policy_number (snake_case DB field)
                validTill: data.validTill, // Assuming DB uses camelCase for validTill based on previous error
                user_id: 'user_id', // Placeholder from original code
                start_date: '2023-01-01', // Placeholder from original code
                end_date: '2023-12-31' // Placeholder from original code
            };
            if (currentInsurance) {
                await api.updateInsurance(currentInsurance.id, payload);
                setToast({ message: 'Insurance updated.', type: 'success' });
            } else {
                await api.createInsurance(payload);
                setToast({ message: 'Insurance created.', type: 'success' });
            }
            setIsFormOpen(false);
            fetchInsurances();
        } catch (error) {
             setToast({ message: 'Failed to save insurance.', type: 'error' });
        }
    };

    const mockPolicies = [
        { id: 1, name: 'Code of Conduct', description: 'General code of conduct for all employees of Paradigm FMS.' },
        { id: 2, name: 'POSH (Prevention of Sexual Harassment)', description: 'Policy related to the prevention, prohibition, and redressal of sexual harassment at the workplace.' },
        { id: 3, name: 'Leave Policy', description: 'Rules and regulations regarding employee leaves.' },
    ];

    return (
        <div className="p-6 sm:p-8">
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
            {isFormOpen && <InsuranceForm onSave={handleSave} onClose={() => setIsFormOpen(false)} initialData={currentInsurance} />}

            <h1 className="text-3xl font-bold mb-6 text-foreground">Policies & Insurance</h1>

            {/* Tab Navigation */}
            <div className="flex border-b border-border mb-8">
                <TabButton
                    icon={FileText}
                    label="Company Policies"
                    isActive={activeTab === 'policies'}
                    onClick={() => setActiveTab('policies')}
                />
                <TabButton
                    icon={Shield}
                    label="Insurance Plans"
                    isActive={activeTab === 'insurance'}
                    onClick={() => setActiveTab('insurance')}
                />
            </div>

            {activeTab === 'policies' && (
                <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
                    {/* Policy Management Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Policy Management</h2>
                        <Button onClick={() => { setCurrentInsurance(null); setIsFormOpen(true); }} className="bg-sky-400 hover:bg-sky-500 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add Policy
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-page">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {mockPolicies.map((policy) => (
                                    <tr key={policy.id}>
                                        <td className="px-6 py-4 font-medium text-foreground">{policy.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{policy.description}</td>
                                        <td className="px-6 py-4">
                                            <Button variant="icon" size="sm" onClick={() => { /* Handle Edit Policy */ }}><Edit className="h-4 w-4 text-gray-500" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'insurance' && (
                <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
                    {/* Insurance Management Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Insurance Management</h2>
                        <Button onClick={() => { setCurrentInsurance(null); setIsFormOpen(true); }} className="bg-sky-400 hover:bg-sky-500 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add Insurance
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-page">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Till</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-500">Loading...</td></tr>
                                ) : insurances.map((ins) => (
                                    <tr key={ins.id}>
                                        {/* Styling updated to match the image: Type is bold, others are standard text */}
                                        <td className="px-6 py-4 font-medium text-foreground">{ins.type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{ins.provider}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{ins.policyNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{ins.validTill}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="icon" size="sm" onClick={() => { setCurrentInsurance(ins); setIsFormOpen(true); }}><Edit className="h-4 w-4 text-gray-500" /></Button>
                                                {/* Removed Trash2 button as it is not visible in the provided image for the Insurance Plans tab */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuranceManagement;