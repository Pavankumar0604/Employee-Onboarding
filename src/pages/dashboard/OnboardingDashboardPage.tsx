import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore.ts';
import { useEnrollmentRulesStore } from '../../store/enrollmentRulesStore';
import type { OrganizationGroup, Company, Entity, Organization, SiteStaffDesignation } from '../../types/mindmesh';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Building, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

// Mock Data for testing purposes
const mockGroups: OrganizationGroup[] = [
    {
        id: 'group-1',
        name: 'Mindmesh Group',
        locations: ['Bangalore', 'Chennai'],
        companies: [
            {
                id: 'company-1',
                name: 'Mindmesh Solutions',
                entities: [
                    { id: 'entity-1', name: 'Headquarters', organizationId: 'org-1' },
                    { id: 'entity-2', name: 'Branch Office A', organizationId: 'org-2' },
                ],
            },
            {
                id: 'company-2',
                name: 'Mindmesh Innovations',
                entities: [
                    { id: 'entity-3', name: 'R&D Lab', organizationId: 'org-3' },
                ],
            },
        ],
    },
    {
        id: 'group-2',
        name: 'Global Tech Group',
        locations: ['Hyderabad', 'Pune'],
        companies: [
            {
                id: 'company-3',
                name: 'Global Tech Services',
                entities: [
                    { id: 'entity-4', name: 'Data Center', organizationId: 'org-4' },
                ],
            },
        ],
    },
];

const mockOrganizations: Organization[] = [
    { id: 'org-1', name: 'Mindmesh HQ', shortName: 'MMHQ', manpowerApprovedCount: 100 },
    { id: 'org-2', name: 'Mindmesh Branch A', shortName: 'MMBA', manpowerApprovedCount: 50 },
    { id: 'org-3', name: 'Mindmesh R&D', shortName: 'MMRD', manpowerApprovedCount: 75 },
    { id: 'org-4', name: 'Global Tech DC', shortName: 'GTDC', manpowerApprovedCount: 200 },
];

const mockSiteStaffDesignations: SiteStaffDesignation[] = [
    { id: 'desig-1', designation: 'Software Engineer', department: 'Engineering', monthlySalary: 80000, permanentId: '', temporaryId: '' },
    { id: 'desig-2', designation: 'Project Manager', department: 'Management', monthlySalary: 120000, permanentId: '', temporaryId: '' },
    { id: 'desig-3', designation: 'HR Executive', department: 'Human Resources', monthlySalary: 50000, permanentId: '', temporaryId: '' },
    { id: 'desig-4', designation: 'Field Officer', department: 'Operations', monthlySalary: 40000, permanentId: '', temporaryId: '' },
    { id: 'desig-5', designation: 'Security Guard', department: 'Security', monthlySalary: 25000, permanentId: '', temporaryId: '' },
];


const SelectOrganization: React.FC = () => {
    const navigate = useNavigate();
    const { updateOrganization, updatePersonal } = useOnboardingStore();
    const { enforceManpowerLimit, manpowerLimitRule } = useEnrollmentRulesStore();
    const { user } = useAuthStore();
    
    const [groups] = useState<OrganizationGroup[]>(mockGroups);
    const [organizations] = useState<Organization[]>(mockOrganizations);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [selectedEntityId, setSelectedEntityId] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [designationsForSite, setDesignationsForSite] = useState<SiteStaffDesignation[]>([]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const [manpowerStatus, setManpowerStatus] = useState({ isOverLimit: false, message: '' });
    const isMobileView = user?.role === 'field_officer' && isMobile;

    // Removed API call useEffect, using mock data directly
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setIsLoading(true);
    //         try {
    //             const [orgs, designations] = await Promise.all([
    //                 api.getOrganizations(),
    //                 api.getSiteStaffDesignations(),
    //             ]);

    //             const structure: OrganizationGroup[] = (orgs || []).map(org => ({
    //                 id: org.id,
    //                 name: org.name,
    //                 companies: [],
    //             }));

    //             setGroups(structure);
    //             setOrganizations(orgs || []);
    //             setSiteStaffDesignations(designations);
    //         } catch (error) {
    //             console.error("Failed to fetch organization structure", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const selectedGroup = useMemo(() => groups.find((g: OrganizationGroup) => g.id === selectedGroupId), [groups, selectedGroupId]);
    const companies = useMemo(() => selectedGroup?.companies || [], [selectedGroup]);
    
    const selectedCompany = useMemo(() => companies.find((c: Company) => c.id === selectedCompanyId), [companies, selectedCompanyId]);
    const entities = useMemo(() => selectedCompany ? selectedCompany.entities || [] : [], [selectedCompany]);

    useEffect(() => {
        // When the site selection changes, reset the designation
        setSelectedDesignation('');

        const selectedEntity = entities.find((e: Entity) => e.id === selectedEntityId);

        if (selectedEntity) {
            // As per user request, populate with all available staff designations from the master list.
            // This removes the dependency on a site-specific manpower plan.
            setDesignationsForSite(mockSiteStaffDesignations);
        } else {
            // If no site is selected, clear the designation list
            setDesignationsForSite([]);
        }
    }, [selectedEntityId, entities, mockSiteStaffDesignations]);

    useEffect(() => {
        const checkManpower = async () => {
            setManpowerStatus({ isOverLimit: false, message: '' });
            if (!selectedEntityId || !enforceManpowerLimit) {
                return;
            }

            const selectedEntity = entities.find((e: Entity) => e.id === selectedEntityId);
            const orgId = selectedEntity?.organizationId;
            if (!orgId) return;

            const organization = organizations.find((o: Organization) => o.id === orgId);
            const approvedCount = organization?.manpowerApprovedCount;

            if (approvedCount === undefined || approvedCount === null) {
                setManpowerStatus({ isOverLimit: false, message: 'Manpower limit not set for this site.' });
                return;
            }

            // Mock manpower count for testing
            const currentCount = 70; // Example mock current count

            if (currentCount >= approvedCount) {
                const message = `Manpower limit of ${approvedCount} reached (${currentCount} deployed).`;
                setManpowerStatus({ isOverLimit: true, message });
            } else {
                const message = `Manpower: ${currentCount} / ${approvedCount} deployed.`;
                setManpowerStatus({ isOverLimit: false, message });
            }
            // Original API call for manpower check (commented out for mock data)
            // try {
            //     const submissions = await api.getVerificationSubmissions();
            //     const currentCount = submissions?.filter(s => s.organizationId === orgId && (s.status === 'verified' || s.status === 'pending')).length || 0;

            //     if (currentCount >= approvedCount) {
            //         const message = `Manpower limit of ${approvedCount} reached (${currentCount} deployed).`;
            //         setManpowerStatus({ isOverLimit: true, message });
            //     } else {
            //         const message = `Manpower: ${currentCount} / ${approvedCount} deployed.`;
            //         setManpowerStatus({ isOverLimit: false, message });
            //     }
            // } catch (e) {
            //     setManpowerStatus({ isOverLimit: false, message: 'Could not verify manpower count.' });
            // }
        };

        checkManpower();
    }, [selectedEntityId, organizations, entities, enforceManpowerLimit]);

    const handleContinue = () => {
        const selectedEntity = entities.find((e: Entity) => e.id === selectedEntityId);
        if (selectedEntity?.organizationId) {
            const organization = organizations.find((o: Organization) => o.id === selectedEntity.organizationId);
            const designationDetails = mockSiteStaffDesignations.find(d => d.designation === selectedDesignation);

            if (organization && designationDetails) {
                updateOrganization({
                    organizationId: organization.id,
                    organizationName: organization.shortName,
                    joiningDate: format(new Date(), 'yyyy-MM-dd'),
                    workType: 'Full-time',
                    designation: selectedDesignation,
                    department: designationDetails.department,
                    defaultSalary: designationDetails.monthlySalary || null,
                });
                updatePersonal({
                    salary: designationDetails.monthlySalary || null
                });
                navigate('/onboarding/process');
            } else {
                console.error("Organization or Designation details not found.");
            }
        }
    };
    
    const canContinue = !selectedEntityId || !selectedDesignation || (manpowerStatus.isOverLimit && manpowerLimitRule === 'block');
    
    if (isMobileView) {
      return (
        <div className="h-full flex flex-col bg-background">
            <header className="p-4 flex-shrink-0 flex items-center gap-4 fo-mobile-header border-b border-border/50">
                <button onClick={() => navigate('/onboarding')} aria-label="Go back" className="text-primary-text hover:text-accent transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-primary-text">New Enrollment</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-5">
                <div className="bg-card rounded-2xl p-6 space-y-6 shadow-lg">
                    <div className="text-center">
                        <div className="inline-block bg-accent-light p-4 rounded-full mb-3">
                            <Building className="h-8 w-8 text-accent-dark" />
                        </div>
                        <h2 className="text-xl font-extrabold text-primary-text">Select Site & Role</h2>
                        <p className="text-sm text-muted-foreground mt-1">Choose the client, site, and designation for the new employee.</p>
                    </div>
                    <div className="space-y-5">
                        <select value={selectedGroupId} onChange={(e) => { setSelectedGroupId(e.target.value); setSelectedCompanyId(''); setSelectedEntityId(''); }} className="fo-select fo-select-arrow w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all">
                            <option value="">-- Select a Group --</option>
                            {groups.map((group: OrganizationGroup) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                        <select value={selectedCompanyId} onChange={(e) => { setSelectedCompanyId(e.target.value); setSelectedEntityId(''); }} disabled={!selectedGroupId} className="fo-select fo-select-arrow w-full p-3 border border-input rounded-lg disabled:opacity-50 transition-all">
                            <option value="">-- Select a Company --</option>
                            {companies.map((company: Company) => (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            ))}
                        </select>
                        <select value={selectedEntityId} onChange={(e) => setSelectedEntityId(e.target.value)} disabled={!selectedCompanyId} className="fo-select fo-select-arrow w-full p-3 border border-input rounded-lg disabled:opacity-50 transition-all">
                            <option value="">-- Select a Client/Site --</option>
                            {entities.map((entity: Entity) => (
                                <option key={entity.id} value={entity.id}>{entity.name}</option>
                            ))}
                        </select>
                        <select value={selectedDesignation} onChange={(e) => setSelectedDesignation(e.target.value)} disabled={!selectedEntityId} className="fo-select fo-select-arrow w-full p-3 border border-input rounded-lg disabled:opacity-50 transition-all">
                            <option value="">-- Select a Designation --</option>
                            {designationsForSite.map(desig => (
                                <option key={desig.id} value={desig.designation}>{desig.designation}</option>
                            ))}
                        </select>
                        {manpowerStatus.message && (
                            <div className={`mt-4 text-sm p-3 rounded-lg flex items-center gap-2 ${manpowerStatus.isOverLimit ? 'bg-red-900/50 text-red-300 border border-red-500/50' : 'bg-sky-900/50 text-sky-300 border border-sky-500/50'}`}>
                                {manpowerStatus.isOverLimit ? <AlertTriangle className="h-4 w-4 flex-shrink-0" /> : <CheckCircle className="h-4 w-4 flex-shrink-0" />}
                                {manpowerStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="p-4 flex-shrink-0 flex items-center justify-between gap-4 border-t border-border/50 bg-card">
                <button onClick={() => navigate('/onboarding')} className="fo-btn-secondary px-6 py-3 rounded-lg font-semibold">Back</button>
                <button onClick={handleContinue} disabled={canContinue} className="fo-btn-primary flex-1 py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity">
                    Continue <ArrowRight className="ml-2 h-4 w-4 inline" />
                </button>
            </footer>
        </div>
      );
    }

    // Desktop View
    return (
        <div className="p-4 md:p-4 min-h-screen flex items-center justify-center">
            <div className="bg-card p-4 rounded-2xl shadow-xl w-full max-w-5xl">
                
                {/* Header Section */}
                <div className="text-center mb-6">
                    <div className="inline-block bg-accent-light p-4 rounded-full mb-3">
                        <Building className="h-8 w-8 text-accent-dark" />
                    </div>
                    <h2 className="text-2xl font-semibold text-primary-text">Select Site</h2>
                    <p className="text-sm text-muted-foreground mt-1">Choose the client and site for the new employee.</p>
                </div>

                <div className="space-y-6">
                    {/* Select Components */}
                    <Select
                        label="Company Group"
                        id="group"
                        value={selectedGroupId}
                        onChange={(e) => {
                            setSelectedGroupId(e.target.value);
                            setSelectedCompanyId('');
                            setSelectedEntityId('');
                        }}
                    >
                        <option value="">-- Select a Group --</option>
                        {groups.map((group: OrganizationGroup) => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </Select>

                    <Select
                        label="Company"
                        id="company"
                        value={selectedCompanyId}
                        onChange={(e) => {
                            setSelectedCompanyId(e.target.value);
                            setSelectedEntityId('');
                        }}
                        disabled={!selectedGroupId}
                    >
                        <option value="">-- Select a Company --</option>
                        {companies.map((company: Company) => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </Select>

                    <Select
                        label="Client / Site"
                        id="entity"
                        value={selectedEntityId}
                        onChange={(e) => setSelectedEntityId(e.target.value)}
                        disabled={!selectedCompanyId}
                    >
                        <option value="">-- Select a Client/Site --</option>
                        {entities.map((entity: Entity) => (
                            <option key={entity.id} value={entity.id}>{entity.name}</option>
                        ))}
                    </Select>
                    
                    <Select
                        label="Designation"
                        id="designation"
                        value={selectedDesignation}
                        onChange={(e) => setSelectedDesignation(e.target.value)}
                        disabled={!selectedEntityId}
                    >
                        <option value="">-- Select a Designation --</option>
                        {designationsForSite.map(desig => (
                            <option key={desig.id} value={desig.designation}>{desig.designation}</option>
                        ))}
                    </Select>
                </div>
                

                {/* Footer/Action Button */}
                <div className="mt-8 pt-4 border-t border-border/50 flex justify-end">
                    <Button
                        onClick={handleContinue}
                        disabled={canContinue}
                        className="px-6 py-3 text-base font-semibold disabled:opacity-50 transition-opacity bg-sky-400 hover:bg-sky-500 text-white rounded-lg flex items-center"
                    >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SelectOrganization;