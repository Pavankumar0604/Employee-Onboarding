import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { OnboardingData, Organization } from '../types/mindmesh';
import { useAuthStore } from '../store/authStore';

interface UseSiteDashboardData {
    submissions: OnboardingData[] | null;
    isLoading: boolean;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    organizations: Organization[] | null;
    selectedOrgId: string | undefined;
    setSelectedOrgId: (id: string | undefined) => void;
    canSelectOrg: boolean;
    currentOrgName: string | undefined | null;
    fetchSubmissions: () => Promise<void>;
}

export const useSiteDashboardData = (): UseSiteDashboardData => {
    const { user } = useAuthStore();
    
    const [submissions, setSubmissions] = useState<OnboardingData[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    
    const [organizations, setOrganizations] = useState<Organization[] | null>(null);
    const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(user?.organizationId || undefined);
    
    
    const canSelectOrg = !!user && (user.role === 'admin' || user.role === 'site_manager');
    // 1. Fetch Organizations
    useEffect(() => {
        if (canSelectOrg) {
            api.getOrganizations().then((orgs: Organization[] | null) => {
                setOrganizations(orgs);
                // If no organization is selected and we have organizations, default to the first one
                if (orgs && orgs.length > 0 && !selectedOrgId) {
                    setSelectedOrgId(orgs[0].id);
                }
            }).catch((error: Error) => {
                console.error("Failed to fetch organizations", error);
            });
        }
    }, [canSelectOrg, selectedOrgId]);

    // 2. Fetch Submissions
    const fetchSubmissions = useCallback(async () => {
        if (!selectedOrgId) {
            // If the user has an organizationId but no selectedOrgId is set yet (e.g., initial load), we wait for the useEffect above to potentially set it.
            // If the user has no organizationId and cannot select one, we stop here.
            if (user?.organizationId) setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const data = await api.getVerificationSubmissions(
                statusFilter === 'all' ? undefined : statusFilter,
                selectedOrgId
            );
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, selectedOrgId, user?.organizationId]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    // 3. Calculate currentOrgName
    const currentOrgName = organizations?.find(o => o.id === selectedOrgId)?.shortName || user?.organizationName;

    return {
        submissions,
        isLoading,
        statusFilter,
        setStatusFilter,
        organizations,
        selectedOrgId,
        setSelectedOrgId,
        canSelectOrg,
        currentOrgName,
        fetchSubmissions,
    };
};