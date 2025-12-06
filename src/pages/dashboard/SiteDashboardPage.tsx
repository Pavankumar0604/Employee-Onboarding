import React, { useState, useMemo, useCallback } from 'react';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select'; // Import custom Select component
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Eye, FileText } from 'lucide-react';

// Mock Data (as requested by user to be in this file)
const MOCK_ORGANIZATIONS = [
    { value: 'org-1', label: 'TATA Power' },
    { value: 'org-2', label: 'Reliance Energy' },
    { value: 'org-3', label: 'Adani Green' },
    { value: 'org-4', label: 'NTPC Ltd' },
];

const MOCK_SUBMISSIONS = [
    {
        id: 'sub-1',
        name: 'Rohan Sharma',
        employeeId: 'MIME-1001',
        status: 'pending',
        portalSync: '-',
    },
];

// Helper to simulate fetching data based on selected site
const getSubmissionsForSite = (siteId: string) => {
    if (siteId === 'org-1') {
        return MOCK_SUBMISSIONS;
    }
    return [];
};

const SiteDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrgId, setSelectedOrgId] = useState(MOCK_ORGANIZATIONS[0].value); // Default to TATA Power
    
    const navigate = useNavigate();

    const currentOrgName = useMemo(() => {
        return MOCK_ORGANIZATIONS.find(o => o.value === selectedOrgId)?.label || 'N/A';
    }, [selectedOrgId]);

    const submissions = useMemo(() => getSubmissionsForSite(selectedOrgId), [selectedOrgId]);

    const filteredSubmissions = useMemo(() => {
        let filtered = submissions;

        // 1. Status Filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.status === statusFilter);
        }

        // 2. Search Term Filter
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(lowerCaseSearch) ||
                s.employeeId.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return filtered;
    }, [submissions, statusFilter, searchTerm]);
    
    const filterTabs = ['All', 'Pending', 'Verified', 'Rejected'];

    const handleNewEnrollment = useCallback(() => {
        // Assuming the route for new enrollment is '/enrollment/new'
        navigate('/enrollment/new');
    }, [navigate]);

    const handleViewDetails = useCallback((id: string) => {
        // Assuming the route for viewing details is '/onboarding/add/personal?id='
        navigate(`/onboarding/add/personal?id=${id}`);
    }, [navigate]);

    const handleDownloadForms = useCallback((id: string) => {
        // Assuming the route for downloading forms is '/onboarding/pdf/'
        navigate(`/onboarding/pdf/${id}`);
    }, [navigate]);


    return (
        <div className="h-full flex flex-col bg-gray-50 p-6">
            
            {/* Main Card Container */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Site Dashboard</h1>
                        <p className="text-base text-gray-600">
                            Viewing submissions for site: <span className="font-bold text-sky-700">{currentOrgName}</span>
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Site Selector Dropdown */}
                        <div className="w-48">
                            <Select
                                id="org-selector"
                                value={selectedOrgId}
                                onChange={(e) => setSelectedOrgId(e.target.value)}
                                options={MOCK_ORGANIZATIONS}
                                className="py-2 px-3 border-gray-300 rounded-lg text-sm shadow-sm"
                            />
                        </div>

                        {/* New Enrollment Button */}
                        <Button 
                            onClick={handleNewEnrollment} 
                            className="bg-sky-400 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            New Enrollment
                        </Button>
                    </div>
                </div>

                {/* Filter/Search Section */}
                <div className="flex items-center justify-between border-b border-gray-200 mb-4">
                    {/* Tabs */}
                    <div className="flex space-x-6">
                        {filterTabs.map(tab => (
                             <button
                                key={tab}
                                onClick={() => setStatusFilter(tab.toLowerCase())}
                                className={`${
                                statusFilter === tab.toLowerCase()
                                    ? 'border-b-2 border-sky-400 text-sky-700'
                                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                                } whitespace-nowrap py-3 px-1 font-medium text-base capitalize transition duration-150 ease-in-out`}
                             >
                                {tab}
                             </button>
                        ))}
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative w-64 mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                        />
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="col-span-1">EMPLOYEE</div>
                    <div className="col-span-1">STATUS</div>
                    <div className="col-span-1">PORTAL SYNC</div>
                    <div className="col-span-1 text-right">ACTIONS</div>
                </div>

                {/* Table Content */}
                <div className="divide-y divide-gray-100">
                    {filteredSubmissions.length === 0 ? (
                         <div className="text-center py-16 text-gray-500">
                            <p>No submissions found for this site or filter.</p>
                        </div>
                    ) : (
                        filteredSubmissions.map((s) => (
                            <div key={s.id} className="grid grid-cols-4 gap-4 px-2 py-4 hover:bg-gray-50 transition duration-100 ease-in-out">
                                {/* Employee Details */}
                                <div className="col-span-1">
                                    <p className="font-semibold text-gray-900">{s.name}</p>
                                    <p className="text-sm text-gray-500">{s.employeeId}</p>
                                </div>
                                
                                {/* Status */}
                                <div className="col-span-1 flex items-center">
                                    <StatusChip status={s.status as 'pending' | 'verified' | 'rejected'} />
                                </div>
                                
                                {/* Portal Sync */}
                                <div className="col-span-1 flex items-center text-gray-500">
                                    {s.portalSync}
                                </div>
                                
                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-end space-x-3">
                                    {/* View/Edit Details Icon Button */}
                                    <button 
                                        onClick={() => handleViewDetails(s.id)} 
                                        title="View/Edit Details"
                                        className="text-gray-500 hover:text-sky-700 transition duration-150 ease-in-out p-1 rounded-full"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    
                                    {/* Download Forms Icon Button */}
                                    <button 
                                        onClick={() => handleDownloadForms(s.id)} 
                                        title="Download Forms"
                                        className="text-gray-500 hover:text-sky-700 transition duration-150 ease-in-out p-1 rounded-full"
                                    >
                                        <FileText className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Scroll buttons (as seen in the image, but likely part of a layout component, adding them here for visual match) */}
            <div className="fixed bottom-8 right-8 flex flex-col space-y-2">
                <button className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900 border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
                <button className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900 border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SiteDashboard;