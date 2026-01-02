import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { OnboardingData } from '../../types/mindmesh.d';
import { Loader2, Search, Eye } from 'lucide-react';
import Toast from '../../components/ui/Toast';
import StatusChip from '../../components/ui/StatusChip';
import PageHeader from '../../components/layout/PageHeader';

// Main component for the My Submissions page
const MySubmissions: React.FC = () => {
    const [submissions, setSubmissions] = useState<OnboardingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true);
            try {
                // Fetching all submissions and filtering on the client-side
                const data = await api.getVerificationSubmissions();
                setSubmissions(data || []);
            } catch (error) {
                setToast({ message: 'Failed to load submissions.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    const filteredSubmissions = useMemo(() => {
        const statusMap: { [key: string]: OnboardingData['status'][] } = {
            'all': ['pending', 'rejected', 'verified' as OnboardingData['status']],
            'pending': ['pending' as OnboardingData['status']],
            'verified': ['verified' as OnboardingData['status']],
            'rejected': ['rejected' as OnboardingData['status']],
        };

        return submissions
            .filter(s => statusMap[statusFilter].includes(s.status))
            .filter(s =>
                `${s.personal.firstName} ${s.personal.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.personal.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.id.toLowerCase().includes(searchTerm.toLowerCase()) || // Assuming ID can be searched
                s.organization?.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming site can be searched
            );
    }, [submissions, statusFilter, searchTerm]);

    const filterTabs = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'verified', label: 'Verified' },
        { key: 'rejected', label: 'Rejected' },
    ];

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

            <div className="px-6 bg-white">
                <PageHeader
                    title="Onboarding Forms"
                    subtitle="Review and manage employee onboarding submissions"
                    tabs={
                        <div className="flex items-center justify-between py-3">
                            <div className="flex space-x-6">
                                {filterTabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setStatusFilter(tab.key as 'all' | 'pending' | 'verified' | 'rejected')}
                                        className={`text-body-small font-medium pb-3 transition-colors duration-150 ${statusFilter === tab.key
                                            ? 'border-b-2 border-sky-400 text-sky-700'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search by name, ID, site..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-gray-400"
                                />
                            </div>
                        </div>
                    }
                />
            </div>

            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Desktop table header - hidden on mobile */}
                    <div className="hidden md:grid md:grid-cols-5 gap-4 px-6 py-3 text-label uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                        <div>EMPLOYEE</div>
                        <div>SITE</div>
                        <div>STATUS</div>
                        <div>PORTAL VERIFICATION</div>
                        <div>ACTIONS</div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredSubmissions.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {filteredSubmissions.map(s => (
                                <Link
                                    to={`/onboarding/add/personal?id=${s.id}`}
                                    key={s.id}
                                    className="block md:grid md:grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 border-b md:border-0"
                                >
                                    {/* Mobile: Stack layout */}
                                    <div className="md:hidden space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.002 0 0114.998 0h-14.998z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{`${s.personal.firstName} ${s.personal.lastName}`}</p>
                                                    <p className="text-body-small text-gray-500">{s.organization?.shortName || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <StatusChip status={s.status} className="px-2 py-1 rounded-full text-xs" />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-body-small text-gray-500">{s.id}</span>
                                            <Eye className="w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>

                                    {/* Desktop: Grid layout */}
                                    <div className="hidden md:contents">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.002 0 0114.998 0h-14.998z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{`${s.personal.firstName} ${s.personal.lastName}`}</p>
                                                <p className="text-body-small text-gray-500">{s.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-body-small text-gray-800">{s.organization?.shortName || 'N/A'}</div>
                                        <div>
                                            <StatusChip status={s.status} className="px-2 py-1 rounded-full text-xs" />
                                        </div>
                                        <div className="text-body-small text-gray-800">-</div>
                                        <div className="text-body-small text-gray-600 flex justify-center">
                                            <Eye className="w-5 h-5 text-gray-500 hover:text-sky-700 cursor-pointer" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p>No submissions found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MySubmissions;