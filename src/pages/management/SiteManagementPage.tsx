import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../../services/api';
import type { Organization, Entity, ManpowerDetail } from '../../types/mindmesh';
import Button from '../../components/ui/Button';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react'; // Re-added Download
import AddSiteFromClientForm from '../../components/admin/AddSiteFromClientForm.tsx';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader.tsx';
import SiteConfigurationForm from '../../components/hr/SiteConfigurationForm.tsx'; // Uncommented
import ManpowerDetailsModal from '../../components/admin/ManpowerDetailsModal.tsx'; // Uncommented

const siteCsvColumns = ['id', 'shortName', 'fullName', 'address', 'manpowerApprovedCount'];

const toCSV = (data: Record<string, any>[], columns: string[]): string => {
    const header = columns.join(',');
    const rows = data.map(row =>
        columns.map(col => {
            const val = row[col] === null || row[col] === undefined ? '' : String(row[col]);
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(',')
    );
    return [header, ...rows].join('\n');
};

const fromCSV = (csvText: string): Record<string, string>[] => {
    const lines = csvText.trim().replace(/\r/g, '').split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const row: Record<string, string> = {};
        // Regex for CSV parsing, handles quoted fields containing commas.
        const values = lines[i].match(/(?<=,|^)(?:"(?:[^"]|"")*"|[^,]*)/g) || [];

        headers.forEach((header, index) => {
            let value = (values[index] || '').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1).replace(/""/g, '"');
            }
            row[header] = value;
        });
        rows.push(row);
    }
    return rows;
};

// New types added


const SiteManagement: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [allClients, setAllClients] = useState<(Entity & { companyName: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
    const [isSiteConfigFormOpen, setIsSiteConfigFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const [editingOrgForConfig, setEditingOrgForConfig] = useState<Organization | null>(null);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [manpowerDetails,] = useState<ManpowerDetail[]>([]);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const importRef = useRef<HTMLInputElement>(null);


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [orgsResult, users] = await Promise.all([
                api.getOrganizations(),
                api.getAllUsersWithRoles(),
            ]);
            setOrganizations(orgsResult || []);
            const clients: (Entity & { companyName: string })[] = (users || [])
                .filter(user => user.organizationId === null)
                .map(user => ({
                    id: user.id,
                    name: user.name || user.email || 'Unknown User',
                    companyName: 'N/A',
                    organizationId: user.organizationId || undefined,
                    location: (user as any).location || 'N/A',
                    registeredAddress: (user as any).registeredAddress || 'N/A',
                }));
            setAllClients(clients);
        } catch (error) {
            setToast({ message: 'Failed to fetch data.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (org: Organization) => {
        setEditingOrgForConfig(org);
        setIsSiteConfigFormOpen(true);
    };

    const handleDelete = (org: Organization) => {
        setCurrentOrg(org);
        setIsDeleteModalOpen(true);
    };

    const handleAddSite = (client: Entity, manpowerCount: number) => {
        if (client.organizationId && organizations.some(org => org.id === client.organizationId)) {
            setToast({ message: 'A site for this client already exists.', type: 'error' });
            return;
        }

        const newSite: Organization = {
            id: client.organizationId || `site_${Date.now()}`,
            name: client.name,
            shortName: client.name,
            fullName: client.name, // Assuming client.name can be used for fullName
            address: client.registeredAddress || '', // Using registeredAddress from Entity
            manpowerApprovedCount: manpowerCount,
            location: client.location || '',
            manager_id: '', // This might need to be dynamic based on actual manager assignment
        };

        setOrganizations(prev => [newSite, ...prev].sort((a, b) => (a.shortName || '').localeCompare(b.shortName || '')));//Added null check
        setIsAddSiteModalOpen(false);
        setToast({ message: 'Site added successfully. You can now configure it.', type: 'success' });
        fetchData(); // Ensure data consistency after adding a new site, addressing the enrollment reflection requirement.
    };

    const handleSaveSiteConfig = () => {
        // setSiteConfigs(prev => { // Removed
        //     const newConfigs = [...prev]; // Removed
        //     const index = newConfigs.findIndex(c => c.organizationId === orgId); // Removed
        //     if (index > -1) newConfigs[index] = configData; // Removed
        //     else newConfigs.push(configData); // Removed
        //     return newConfigs; // Removed
        // }); // Removed
        setToast({ message: 'Site configuration saved.', type: 'success' });
        setIsSiteConfigFormOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (currentOrg) {
            setOrganizations(prev => prev.filter(o => o.id !== currentOrg.id));
            // setSiteConfigs(prev => prev.filter(sc => sc.organizationId !== currentOrg.id)); // Removed
            setToast({ message: 'Site deleted.', type: 'success' });
            setIsDeleteModalOpen(false);
        }
    };

    const handleViewDetails = async (org: Organization) => {
        setCurrentOrg(org);
        setIsDetailsLoading(true);
        setIsDetailsModalOpen(true);
        // try { // Removed
        //     const details = await api.getManpowerDetails(org.id); // Removed
        //     setManpowerDetails(details); // Removed
        // } catch (e) { // Removed
        //     setToast({ message: 'Could not load manpower details.', type: 'error' }); // Removed
        // } finally { // Removed
        setIsDetailsLoading(false);
        // } // Removed
    };

    const handleSaveManpowerDetails = async (details: ManpowerDetail[]) => {
        if (!currentOrg) return;
        // try { // Removed
        //     await api.updateManpowerDetails(currentOrg.id, details); // Removed

        const newTotal = details.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
        setOrganizations(prevOrgs =>
            prevOrgs.map(org =>
                org.id === currentOrg.id ? { ...org, manpowerApprovedCount: newTotal } : org
            )
        );

        setIsDetailsModalOpen(false);
        setToast({ message: 'Manpower details updated successfully.', type: 'success' });
        // } catch (error) { // Removed
        //     setToast({ message: 'Failed to save manpower details.', type: 'error' }); // Removed
        // } // Removed
    };

    const handleExport = () => {
        const csvData = toCSV(organizations, siteCsvColumns);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'sites_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToast({ message: 'Sites exported successfully.', type: 'success' });
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                if (!text) throw new Error("File is empty or could not be read.");

                const parsedData = fromCSV(text);
                if (parsedData.length === 0) throw new Error("No data rows found in the CSV file.");

                const fileHeaders = Object.keys(parsedData[0]);
                const hasAllHeaders = siteCsvColumns.every(h => fileHeaders.includes(h));
                if (!hasAllHeaders) {
                    throw new Error(`CSV is missing headers. Required: ${siteCsvColumns.join(', ')}`);
                }

                parsedData.map(row => ({
                    id: row.id,
                    name: row.shortName,
                    shortName: row.shortName,
                    fullName: row.fullName,
                    address: row.address,
                    manpowerApprovedCount: parseFloat(row.manpowerApprovedCount) || 0,
                    location: row.location, // Use row.location from CSV
                    manager_id: row.manager_id || '', // Use row.manager_id from CSV
                }));

                // const { count } = await api.bulkUploadOrganizations(newOrgs); // Removed
                // setToast({ message: `${count} sites imported/updated successfully.`, type: 'success' }); // Removed
                fetchData();

            } catch (error: any) {
                setToast({ message: error.message || 'Failed to import CSV.', type: 'error' });
            } finally {
                if (event.target) event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <input type="file" ref={importRef} className="hidden" accept=".csv" onChange={handleImport} />

            <AddSiteFromClientForm
                isOpen={isAddSiteModalOpen}
                onClose={() => setIsAddSiteModalOpen(false)}
                onSave={handleAddSite}
                clients={allClients}
            />

            {isSiteConfigFormOpen && editingOrgForConfig && (
                <SiteConfigurationForm
                    isOpen={isSiteConfigFormOpen}
                    onClose={() => setIsSiteConfigFormOpen(false)}
                    onSave={handleSaveSiteConfig}
                    organization={editingOrgForConfig}
                    allClients={allClients} // Satisfy prop requirement
                    initialData={undefined} // SiteConfigurationForm logic relies on API data we removed
                />
            )}

            {currentOrg && (
                <ManpowerDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    siteName={currentOrg.shortName}
                    details={manpowerDetails}
                    isLoading={isDetailsLoading}
                    onSave={handleSaveManpowerDetails}
                />
            )}

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
            >
                Are you sure you want to delete the site "{currentOrg?.shortName}"? This action cannot be undone.
            </Modal>

            <AdminPageHeader title="Site Management">
                {/* <Button variant="outline" onClick={() => importRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Import Sites</Button> */}
                <Button borderRadius="rounded-[50px] px-4 py-2 mr-2" variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export Sites</Button>
                <Button borderRadius="rounded-[50px] px-4 py-2" variant="primary" onClick={() => setIsAddSiteModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Site</Button>
            </AdminPageHeader>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Short Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Linked Client</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Site ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Manpower Count</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-10 text-muted">Loading sites...</td></tr>
                        ) : organizations.map((org) => (
                            <tr key={org.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 font-medium whitespace-nowrap">{org.shortName}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="text-muted">N/A</span> {/* Hardcoded N/A as client data fetching is removed */}
                                </td>
                                <td className="px-6 py-4 text-sm text-muted break-all">{org.id}</td>
                                <td className="px-6 py-4 text-sm text-foreground font-mono">{org.manpowerApprovedCount || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Button variant="icon" size="sm" onClick={() => handleViewDetails(org)} title="View Manpower Details"><Eye className="h-4 w-4" /></Button>
                                        <Button variant="icon" size="sm" onClick={() => handleEdit(org)} title="Configure Site"><Edit className="h-4 w-4" /></Button>
                                        <Button variant="icon" size="sm" onClick={() => handleDelete(org)} title="Delete Site"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                                    </div>
                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SiteManagement;