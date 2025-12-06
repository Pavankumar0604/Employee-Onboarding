import { create } from 'zustand';
import type { GmcPolicySettings } from '../types/onboarding';

// Mocking necessary types/interfaces based on usage in AttendanceRulesPage.tsx
// Since we cannot resolve the external type import, we define it here minimally.
export interface Holiday {
    name: string;
    date: string;
    id: string; // Made mandatory to satisfy usage in removeHoliday
}

interface AttendanceSettings {
    minimumHoursFullDay: number;
    minimumHoursHalfDay: number;
    annualEarnedLeaves: number;
    annualSickLeaves: number;
    monthlyFloatingLeaves: number;
    sickLeaveCertDays: number;
    enableAttendanceNotifications: boolean;
}

interface AddressSettings {
    enablePincodeVerification: boolean;
}

interface SettingsState {
    attendance: AttendanceSettings;
    holidays: Holiday[];
    address: AddressSettings;
    gmcPolicy: GmcPolicySettings;
    updateAttendanceSettings: (settings: Partial<AttendanceSettings>) => void;
    addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
    removeHoliday: (id: string) => void;
    updateGmcPolicySettings: (settings: GmcPolicySettings) => void;
}

// Minimal implementation for testing import resolution
export const useSettingsStore = create<SettingsState>((set) => ({
    attendance: {
        minimumHoursFullDay: 8,
        minimumHoursHalfDay: 4,
        annualEarnedLeaves: 15,
        annualSickLeaves: 10,
        monthlyFloatingLeaves: 1,
        sickLeaveCertDays: 3,
        enableAttendanceNotifications: true,
    },
    holidays: [],
    address: {
        enablePincodeVerification: true,
    },
    gmcPolicy: {
        applicability: 'Optional - Opt-in Default', optInDisclaimer: '', coverageDetails: '',
        optOutDisclaimer: '', requireAlternateInsurance: false, collectProvider: false,
        collectStartDate: false, collectEndDate: false, collectExtentOfCover: false
    },
    updateAttendanceSettings: (settings) => set(state => ({
        attendance: { ...state.attendance, ...settings },
    })),
    addHoliday: (holiday) => set(state => ({
        holidays: [...state.holidays, { ...holiday, id: Date.now().toString() + Math.random() }], // Add mock ID
    })),
    removeHoliday: (id) => set(state => ({
        holidays: state.holidays.filter(h => h.id !== id),
    })),
    updateGmcPolicySettings: (settings) => set(() => ({
        gmcPolicy: settings,
    })),
}));