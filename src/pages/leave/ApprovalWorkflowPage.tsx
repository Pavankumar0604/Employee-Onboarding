import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import type { User, UserRole } from '../../types/mindmesh.d';
import { Loader2, Save, Users, ShieldCheck } from 'lucide-react';

type ConfirmationRole = 'hr' | 'admin' | 'operation_manager';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

// Assuming User and UserRole types are defined in mindmesh.d.ts
type UserWithManager = User & { managerName?: string; reportingManagerId?: string | null };

const ApprovalWorkflowPage: React.FC = () => {
    const [users, setUsers] = useState<UserWithManager[]>([]);
    const [finalConfirmationRole, setFinalConfirmationRole] = useState<ConfirmationRole>('hr');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Mock API calls for demonstration, replace with actual implementation
            const [usersData, settingsData] = await Promise.all([
                api.getUsersWithManagers(),
                api.getApprovalWorkflowSettings()
            ]);
            setUsers(usersData);
            setFinalConfirmationRole(settingsData.finalConfirmationRole);
        } catch (error) {
            console.error('Failed to load workflow data:', error);
            setToast({ message: 'Failed to load workflow data.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleManagerChange = (userId: string, managerId: string) => {
        setUsers(currentUsers =>
            currentUsers.map(u => u.id === userId ? { ...u, reportingManagerId: managerId || undefined } : u)
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // In a real app, you might want to only send changed users
            await Promise.all(users.map(u => api.updateUserReportingManager(u.id, u.reportingManagerId || null)));
            await api.updateApprovalWorkflowSettings(finalConfirmationRole);
            setToast({ message: 'Workflow saved successfully!', type: 'success' });
            fetchData(); // re-fetch to confirm names
        } catch (error) {
            console.error('Failed to save workflow:', error);
            setToast({ message: 'Failed to save workflow.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const allRoles: ConfirmationRole[] = ['admin', 'hr', 'operation_manager'];

    const formatRole = (role: UserRole | ConfirmationRole) => role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <AdminPageHeader title="Leave Approval Workflow">
                <Button onClick={handleSave} loading={isSaving} disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" /> Save Workflow
                </Button>
            </AdminPageHeader>

            {/* Final Confirmation Step Card */}
            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Final Confirmation Step</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Select the role responsible for the final confirmation of a leave request after it has been approved by the reporting manager chain.
                </p>
                <div className="max-w-xs">
                     <Select label="Final Confirmation Role" id="final-approver" value={finalConfirmationRole} onChange={e => setFinalConfirmationRole(e.target.value as ConfirmationRole)}>
                        {allRoles.map(role => <option key={role} value={role}>{formatRole(role)}</option>)}
                    </Select>
                </div>
            </section>

            {/* Reporting Structure Card */}
            <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Reporting Structure</h3>
                </div>
                 <p className="text-sm text-gray-500 mb-6">
                    For each employee, assign a reporting manager. Leave requests will be sent to this manager for first-level approval.
                </p>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Manager</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={3} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600"/></td></tr>
                            ) : (
                                users.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-10 text-gray-500">No users found.</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRole(user.role)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                                                <Select label="" id={`manager-for-${user.id}`} value={user.reportingManagerId || ''} onChange={e => handleManagerChange(user.id, e.target.value)}>
                                                    <option value="">None (Reports to Final Approver)</option>
                                                    {users.filter(m => m.id !== user.id).map(manager => (
                                                        <option key={manager.id} value={manager.id}>{manager.name}</option>
                                                    ))}
                                                </Select>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
};

export default ApprovalWorkflowPage;