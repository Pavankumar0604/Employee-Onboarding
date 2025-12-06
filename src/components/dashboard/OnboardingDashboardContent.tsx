import React, { useState } from 'react';
import StatusChip from '../ui/StatusChip';
import PortalSyncStatusChip from '../ui/PortalSyncStatusChip';
import { Eye, Check, X, Search, AlertCircle } from 'lucide-react'; // Import Lucide icons


// --- Mock Data ---
interface OnboardingItem {
    id: string;
    employeeName: string;
    site: string;
    status: 'Pending' | 'Verified' | 'Rejected';
    portalSync: boolean;
    isHighlighted: boolean;
}

const MOCK_DATA: OnboardingItem[] = [
    { id: 'PARA-1001', employeeName: 'Rohan Sharma', site: 'Site Alpha', status: 'Pending', portalSync: false, isHighlighted: false },
    { id: 'PARA-1002', employeeName: 'Priya Patel', site: 'Site Beta', status: 'Verified', portalSync: true, isHighlighted: true },
    { id: 'PARA-1003', employeeName: 'Amit Singh', site: 'Site Gamma', status: 'Verified', portalSync: false, isHighlighted: false },
    { id: 'PARA-1004', employeeName: 'Sneha Rao', site: 'Site Alpha', status: 'Rejected', portalSync: false, isHighlighted: false },
];

// --- Table Component (Step 6) ---
const OnboardingTable: React.FC = () => {
    
    const getActions = (item: OnboardingItem) => (
        <div className="dashboard-actionCell">
            <button aria-label="View form" title="View form"><Eye size={18} className="dashboard-iconView" /></button>
            {item.status !== 'Verified' && item.status !== 'Rejected' && (
                <button aria-label="Verify submission" title="Verify"><Check size={18} className="dashboard-iconVerify" /></button>
            )}
            {item.status !== 'Rejected' && (
                <button aria-label="Reject submission" title="Reject"><X size={18} className="dashboard-iconReject" /></button>
            )}
        </div>
    );

    return (
        <div className="dashboard-tableContainer">
            <table className="dashboard-onboardingTable">
                <thead>
                    <tr className="dashboard-tableHeader">
                        <th>Employee (Name + ID)</th>
                        <th>Site</th>
                        <th>Status</th>
                        <th>Portal Sync</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_DATA.map((item) => (
                        <tr key={item.id} className={`dashboard-tableRow ${item.isHighlighted ? 'dashboard-rowHighlighted' : ''}`}>
                            <td className={`dashboard-tableCell dashboard-employeeCell`}>
                                {item.isHighlighted && <AlertCircle size={18} className="dashboard-highlightIcon" />}
                                <div>
                                    <div>{item.employeeName}</div>
                                    <div style={{fontSize: '0.8rem', color: 'var(--color-ash-gray)', fontWeight: '400'}}>{item.id}</div>
                                </div>
                            </td>
                            <td className="dashboard-tableCell">{item.site}</td>
                            <td className="dashboard-tableCell">
                                <div className="flex gap-2">
                                    {item.status === 'Verified' && <StatusChip status={'Verified'} variant="success" />}
                                    {item.status === 'Pending' && <StatusChip status={'Pending'} variant="warning" />}
                                    {item.status === 'Rejected' && <StatusChip status={'Rejected'} variant="danger" />}
                                </div>
                            </td>
                            <td className="dashboard-tableCell">
                                <PortalSyncStatusChip isSynced={item.portalSync} />
                            </td>
                            <td className="dashboard-tableCell" style={{whiteSpace: 'nowrap'}}>
                                {getActions(item)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Main Content Component (Steps 4 & 5) ---
const OnboardingDashboardContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Pending', 'Verified', 'Rejected'];

    return (
        <div>
            <div className="dashboard-sectionHeader">
                <h2 className="dashboard-sectionTitle">Onboarding Forms</h2>
                <div className="dashboard-searchContainer">
                    <Search size={18} className="dashboard-searchIcon" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, site..."
                        className="dashboard-searchInput"
                        aria-label="Search onboarding forms"
                    />
                </div>
            </div>
            <div className="dashboard-tabsContainer">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`dashboard-tab ${activeTab === tab ? 'dashboard-tabActive' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        aria-selected={activeTab === tab}
                        role="tab"
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <OnboardingTable />
        </div>
    );
};

export default OnboardingDashboardContent;