import { create } from 'zustand';
import { EnrollmentRules } from '../types/mindmesh';

interface EnrollmentRulesState extends EnrollmentRules {
    updateRules: (newRules: EnrollmentRules) => void;
}

export const useEnrollmentRulesStore = create<EnrollmentRulesState>((set) => ({
    enforceManpowerLimit: true,
    manpowerLimitRule: 'warn',
    enableEsiRule: false,
    esiCtcThreshold: 21000,
    enableGmcRule: false,
    salaryThreshold: 25000,
    defaultPolicySingle: '1L',
    defaultPolicyMarried: '2L',
    allowSalaryEdit: false,
    enforceFamilyValidation: false,
    rulesByDesignation: {}, // Initialize as an empty object

    updateRules: (newRules) => set(newRules),
}));