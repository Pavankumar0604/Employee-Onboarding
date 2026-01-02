import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { LeaveBalance, LeaveRequest, LeaveType, LeaveRequestStatus } from '../../types/mindmesh.d';
import type { UploadedFile } from '../../types/onboarding';
import { Loader2, Plus, Sun, Moon, Globe2, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import Select from '../../components/ui/Select';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, differenceInCalendarDays, isSameDay } from 'date-fns';
import DatePicker from '../../components/ui/DatePicker';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useSettingsStore } from '../../store/settingsStore';
import UploadDocument from '../../components/ui/UploadDocument';
import PageHeader from '../../components/layout/PageHeader';

// --- Reusable Components ---

const LeaveBalanceCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-card p-4 rounded-xl flex items-center gap-4 border border-border shadow-sm transition-shadow hover:shadow-md">
        <div className="bg-accent-light p-3 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-accent-dark" />
        </div>
        <div>
            <p className="text-sm text-muted font-medium">{title}</p>
            <p className="text-2xl font-extrabold text-primary-text">{value}</p>
        </div>
    </div>
);

const LeaveStatusChip: React.FC<{ status: LeaveRequestStatus }> = ({ status }) => {
    const statusMap: Record<LeaveRequestStatus, { text: string, className: string }> = {
        pending_manager_approval: { text: 'Pending Manager', className: 'bg-yellow-100 text-yellow-800' },
        pending_hr_confirmation: { text: 'Pending HR', className: 'bg-blue-100 text-blue-800' },
        approved: { text: 'Approved', className: 'bg-sky-100 text-sky-800' },
        rejected: { text: 'Rejected', className: 'bg-red-100 text-red-800' }
    };
    const { text, className } = statusMap[status];
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{text}</span>;
};


// --- Leave Request Form ---
type LeaveRequestFormData = {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    dayOption?: 'full' | 'half';
    doctorCertificate?: UploadedFile | null;
};

const getLeaveValidationSchema = (threshold: number) => yup.object({
    leaveType: yup.string<LeaveType>().oneOf(['Earned', 'Sick', 'Floating']).required('Leave type is required'),
    startDate: yup.string().required('Start date is required'),
    endDate: yup.string().required('End date is required')
        .test('is-after-start', 'End date must be on or after start date', function (value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return true;
            return new Date(value.replace(/-/g, '/')) >= new Date(startDate.replace(/-/g, '/'));
        }),
    reason: yup.string().required('A reason for the leave is required').min(10, 'Please provide a more detailed reason.'),
    dayOption: yup.string().oneOf(['full', 'half']).optional(),
    doctorCertificate: yup.object<UploadedFile>().nullable().when(['leaveType', 'startDate', 'endDate'], {
        is: (leaveType: string, startDate: string, endDate: string) => {
            if (leaveType !== 'Sick' || !startDate || !endDate) return false;
            const duration = differenceInCalendarDays(new Date(endDate.replace(/-/g, '/')), new Date(startDate.replace(/-/g, '/'))) + 1;
            return duration > threshold;
        },
        then: schema => schema.required(`A doctor's certificate is required for sick leave longer than ${threshold} days.`),
        otherwise: schema => schema.nullable(),
    })
});

const LeaveRequestForm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: { id: string, name: string };
    isMobile: boolean;
    setToast: (toast: { message: string, type: 'success' | 'error' } | null) => void;
}> = ({ isOpen, onClose, onSuccess, user: _user, isMobile, setToast }) => {
    const { attendance: { sickLeaveCertDays } } = useSettingsStore();
    const validationSchema = useMemo(() => getLeaveValidationSchema(sickLeaveCertDays), [sickLeaveCertDays]);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<LeaveRequestFormData>({
        resolver: yupResolver(validationSchema) as Resolver<LeaveRequestFormData>,
        defaultValues: { leaveType: 'Earned', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(), 'yyyy-MM-dd'), dayOption: 'full' }
    });

    const watchStartDate = watch('startDate');
    const watchEndDate = watch('endDate');
    const watchLeaveType = watch('leaveType');

    const isSingleDay = useMemo(() => {
        if (!watchStartDate || !watchEndDate) return false;
        return isSameDay(new Date(watchStartDate.replace(/-/g, '/')), new Date(watchEndDate.replace(/-/g, '/')));
    }, [watchStartDate, watchEndDate]);

    const showHalfDayOption = isSingleDay && watchLeaveType === 'Earned';
    const showDoctorCertUpload = useMemo(() => {
        if (watchLeaveType !== 'Sick' || !watchStartDate || !watchEndDate) return false;
        const duration = differenceInCalendarDays(new Date(watchEndDate.replace(/-/g, '/')), new Date(watchStartDate.replace(/-/g, '/'))) + 1;
        return duration > sickLeaveCertDays;
    }, [watchLeaveType, watchStartDate, watchEndDate, sickLeaveCertDays]);


    const onSubmit: SubmitHandler<LeaveRequestFormData> = async (formData) => {
        try {
            // Simulate API call success/failure
            // await api.submitLeaveRequest({ ...formData, userId: _user.id, userName: _user.name });
            console.log('Submitting leave request:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

            // Mock success for now
            onSuccess();
        } catch (err) {
            setToast({ message: 'Failed to submit leave request.', type: 'error' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-40 ${isMobile ? 'bg-white flex flex-col' : 'flex items-center justify-center bg-black/50 p-4'}`}>
            <div className={`w-full ${isMobile ? 'flex flex-col h-full bg-white' : 'max-w-2xl bg-white rounded-xl shadow-2xl'}`}>
                <header className={`p-4 flex-shrink-0 flex items-center gap-4 ${isMobile ? 'fo-mobile-header' : 'border-b border-border'}`}>
                    <Button variant="icon" onClick={onClose} aria-label="Go back"><ArrowLeft className="h-6 w-6 text-primary-text" /></Button>
                    <h1 className="text-xl font-bold text-primary-text">{isMobile ? 'New Leave Request' : 'Submit a New Leave Request'}</h1>
                </header>
                <form id="leave-form" onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6">
                    <Controller name="leaveType" control={control} render={({ field }) => (
                        <Select label="Leave Type" {...field} error={errors.leaveType?.message} className={isMobile ? 'pro-select pro-select-arrow' : ''}>
                            <option value="Earned">Earned Leave</option>
                            <option value="Sick">Sick Leave</option>
                            <option value="Floating">Floating Holiday</option>
                        </Select>
                    )} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Controller name="startDate" control={control} render={({ field }) => (
                            <DatePicker label="Start Date" id="startDate" value={field.value} onChange={field.onChange} error={errors.startDate?.message} />
                        )} />
                        <Controller name="endDate" control={control} render={({ field }) => (
                            <DatePicker label="End Date" id="endDate" value={field.value} onChange={field.onChange} error={errors.endDate?.message} />
                        )} />
                    </div>
                    {showHalfDayOption && (
                        <Controller name="dayOption" control={control} render={({ field }) => (
                            <Select label="Day Option" {...field} className={isMobile ? 'pro-select pro-select-arrow' : ''}>
                                <option value="full">Full Day</option><option value="half">Half Day</option>
                            </Select>
                        )} />
                    )}
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Reason</label>
                        <textarea {...register('reason')} rows={4} placeholder="Provide a detailed reason for your leave..." className={`mt-1 form-textarea w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent transition-colors ${errors.reason ? 'border-red-500' : 'border-border bg-input'}`} />
                        {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>}
                    </div>
                    {showDoctorCertUpload && (
                        <Controller name="doctorCertificate" control={control} render={({ field, fieldState }) => (
                            <UploadDocument label={`Doctor's Certificate (Required)`} file={field.value} onFileChange={field.onChange} error={fieldState.error?.message} allowCapture />
                        )} />
                    )}
                </form>
                <footer className={`p-4 flex-shrink-0 flex items-center justify-end gap-3 ${isMobile ? 'shadow-top' : 'border-t border-border'}`}>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="leave-form">Submit Request</Button>
                </footer>
            </div>
        </div>
    );
};

// --- Main Dashboard ---
const LeaveTrackerPage: React.FC = () => {
    const { user } = useAuthStore();
    const [balance, setBalance] = useState<LeaveBalance | null>(null);
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<LeaveRequestStatus | 'all'>('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Mock Data for demonstration since API calls are not live
    const mockLeaveBalances: LeaveBalance = {
        userId: user?.id || 'mock-user',
        earnedTotal: 20, earnedUsed: 5,
        sickTotal: 10, sickUsed: 1,
        floatingTotal: 5, floatingUsed: 2,
    };

    const mockLeaveRequests: LeaveRequest[] = [
        { id: '1', user_id: 'mock-user', userName: 'John Doe', leaveType: 'Earned', startDate: '2025-12-01', endDate: '2025-12-05', reason: 'Family vacation', status: 'pending_manager_approval', submitted_at: new Date().toISOString(), currentApproverId: 'manager-1', managerApprovalDate: null, hrConfirmationDate: null, rejectionReason: null },
        { id: '2', user_id: 'mock-user', userName: 'John Doe', leaveType: 'Sick', startDate: '2025-11-10', endDate: '2025-11-10', reason: 'Fever', status: 'approved', submitted_at: new Date().toISOString(), currentApproverId: null, managerApprovalDate: '2025-11-09', hrConfirmationDate: '2025-11-09', rejectionReason: null },
        { id: '3', user_id: 'mock-user', userName: 'John Doe', leaveType: 'Floating', startDate: '2025-12-25', endDate: '2025-12-25', reason: 'Christmas', status: 'rejected', submitted_at: new Date().toISOString(), currentApproverId: null, managerApprovalDate: '2025-12-20', hrConfirmationDate: null, rejectionReason: 'Not enough balance' },
        { id: '4', user_id: 'mock-user', userName: 'John Doe', leaveType: 'Earned', startDate: '2025-11-20', endDate: '2025-11-20', reason: 'Personal work', status: 'pending_hr_confirmation', dayOption: 'first_half', submitted_at: new Date().toISOString(), currentApproverId: 'hr-1', managerApprovalDate: '2025-11-18', hrConfirmationDate: null, rejectionReason: null },
    ];


    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Replace with actual API calls when ready
            // const [balanceData, requestsData] = await Promise.all([
            //     api.getLeaveBalancesForUser(user.id),
            //     api.getLeaveRequests({ 
            //         userId: user.id,
            //         status: filter === 'all' ? undefined : filter
            //     })
            // ]);

            // Mock data fetching
            await new Promise(resolve => setTimeout(resolve, 500));
            const filteredRequests = mockLeaveRequests.filter(req => filter === 'all' || req.status === filter);

            setBalance(mockLeaveBalances);
            setRequests(filteredRequests);
        } catch (error) {
            setToast({ message: 'Failed to load leave data.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [user, filter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFormSuccess = () => {
        setToast({ message: 'Leave request submitted successfully!', type: 'success' });
        setIsFormOpen(false);
        fetchData();
    };

    const formatTabName = (tab: string) => tab.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const filterTabs: Array<LeaveRequestStatus | 'all'> = ['all', 'pending_manager_approval', 'pending_hr_confirmation', 'approved', 'rejected'];

    const balanceCards = balance ? [
        { title: 'Earned Leave', value: `${balance.earnedTotal - balance.earnedUsed} / ${balance.earnedTotal}`, icon: Sun },
        { title: 'Sick Leave', value: `${balance.sickTotal - balance.sickUsed} / ${balance.sickTotal}`, icon: Moon },
        { title: 'Floating Holiday', value: `${balance.floatingTotal - balance.floatingUsed} / ${balance.floatingTotal}`, icon: Globe2 }
    ] : [];

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
            {user && <LeaveRequestForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleFormSuccess} user={user} isMobile={isMobile} setToast={setToast} />}

            <PageHeader
                title="Leave Tracker"
                subtitle="Manage your leave requests and view balance"
                primaryAction={
                    !isMobile ? (
                        <Button onClick={() => setIsFormOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> New Request
                        </Button>
                    ) : undefined
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {balanceCards.map(b => <LeaveBalanceCard key={b.title} {...b} />)}
            </div>

            {isMobile && (
                <div className="my-4">
                    <Button onClick={() => setIsFormOpen(true)} size="lg" className="w-full justify-center">
                        <Plus className="mr-2 h-5 w-5" /> New Request
                    </Button>
                </div>
            )}

            <div className="bg-card p-0 md:p-6 rounded-xl shadow-lg">
                <div className="mb-6 p-4 md:p-0">
                    <div className="w-full sm:w-auto md:border-b border-border">
                        <nav className="flex flex-col md:flex-row md:space-x-6 md:overflow-x-auto space-y-1 md:space-y-0" aria-label="Tabs">
                            {filterTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`whitespace-nowrap font-semibold text-sm rounded-lg md:rounded-none w-full md:w-auto text-left md:text-center px-4 py-3 md:px-1 md:py-3 md:bg-transparent md:border-b-2 transition-colors
                                    ${filter === tab
                                            ? 'bg-accent-light text-accent-dark md:border-accent'
                                            : 'text-muted hover:bg-accent-light hover:text-accent-dark md:border-transparent md:hover:border-accent'
                                        }`}
                                >
                                    {formatTabName(tab)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full responsive-table">
                        <thead>
                            <tr className="bg-secondary-bg">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Dates</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Reason</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-10 text-muted flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading Requests...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-10 text-muted">No requests found for this filter.</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id} className="hover:bg-secondary-bg transition-colors">
                                        <td data-label="Type" className="px-4 py-4 font-medium text-primary-text">{req.leaveType} {req.dayOption && `(${req.dayOption === 'first_half' ? 'First Half' : req.dayOption === 'second_half' ? 'Second Half' : 'Full Day'})`}</td>
                                        <td data-label="Dates" className="px-4 py-4 text-muted text-sm">{format(new Date(req.startDate.replace(/-/g, '/')), 'dd MMM yyyy')} - {format(new Date(req.endDate.replace(/-/g, '/')), 'dd MMM yyyy')}</td>
                                        <td data-label="Reason" className="px-4 py-4 text-muted max-w-xs truncate text-sm">{req.reason}</td>
                                        <td data-label="Status" className="px-4 py-4"><LeaveStatusChip status={req.status} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default LeaveTrackerPage;