import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { PersonalDetails, EducationRecord, FamilyMember, GmcDetails, AddressDetails, Address, BankDetails, EsiDetails } from '../types/onboarding';
import { api } from '../services/api'; // Import API service
import { useAuthStore } from './authStore'; // Import useAuthStore to get user ID

// Define the structure for the organization data being collected
interface OrganizationData {
    organizationId: string | null;
    organizationName: string | null;
    joiningDate: string | null;
    workType: string | null;
    designation: string | null;
    department: string | null;
    defaultSalary: number | null;
}

export interface OnboardingState {
    organization: OrganizationData;
    personal: PersonalDetails;
    education: EducationRecord[];
    family: FamilyMember[]; // Added family state
    gmc: GmcDetails; // Added GMC state
    address: AddressDetails; // Added address state
    bank: BankDetails;
    esi: EsiDetails; // Added ESI state
    data: any;
    submitOnboarding: () => Promise<{ success: boolean; error?: string }>;
    updateOrganization: (updates: Partial<OrganizationData>) => void;
    updatePersonal: (updates: Partial<PersonalDetails>) => void;
    updateAddress: (updates: Partial<AddressDetails>) => void; // Added method
    setAddressVerifiedStatus: (type: 'present' | 'permanent', updates: Partial<Address['verifiedStatus']>) => void; // Added method
    updateBank: (updates: Partial<BankDetails>) => void;
    updateEsi: (updates: Partial<EsiDetails>) => void; // Added ESI update method
    addEducationRecord: () => void;
    updateEducationRecord: (id: string, updates: Partial<EducationRecord>) => void;
    updateGmc: (updates: Partial<GmcDetails>) => void; // Added method
    removeEducationRecord: (id: string) => void;
    addFamilyMember: () => void; // Added method
    updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void; // Added method
    removeFamilyMember: (id: string) => void; // Added method
    addOrUpdateEmergencyContactAsFamilyMember: () => void;
    logVerificationUsage: (itemName: string) => void;
    reset: () => void;
}

const initialOrganizationState: OrganizationData = {
    organizationId: null,
    organizationName: null,
    joiningDate: null,
    workType: null,
    designation: null,
    department: null,
    defaultSalary: null,
};

const initialPersonalState: PersonalDetails = {
    employeeId: '',
    firstName: '',
    middleName: undefined,
    lastName: '',
    preferredName: undefined,
    dob: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    mobile: '',
    alternateMobile: null,
    email: '',
    idProofType: '',
    idProofNumber: undefined,
    photo: null,
    idProof: null,
    emergencyContactName: '',
    emergencyContactNumber: '',
    relationship: '',
    salary: null,
    verifiedStatus: undefined,
};

const initialEducationState: EducationRecord[] = [];
const initialFamilyState: FamilyMember[] = []; // Initialize family state

const initialGmcState: GmcDetails = {
    isOptedIn: null,
    optOutReason: undefined,
    policyAmount: undefined,
    nomineeName: undefined,
    nomineeRelation: undefined,
    wantsToAddDependents: undefined,
    selectedSpouseId: undefined,
    selectedChildIds: undefined,
    gmcPolicyCopy: null,
    declarationAccepted: undefined,
    alternateInsuranceProvider: undefined,
    alternateInsuranceStartDate: undefined,
    alternateInsuranceEndDate: undefined,
    alternateInsuranceCoverage: undefined,
};
const initialAddressState: AddressDetails = {
    present: {
        line1: '',
        line2: undefined,
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        verifiedStatus: {},
    },
    permanent: {
        line1: '',
        line2: undefined,
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        verifiedStatus: {},
    },
    sameAsPresent: false,
};

const initialBankState: BankDetails = {
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    bankProof: null,
};

const initialEsiState: EsiDetails = {
    hasEsi: false,
    esiNumber: undefined,
};

export const useOnboardingStore = create(
    immer<OnboardingState>((set, get) => ({
        organization: initialOrganizationState,
        personal: initialPersonalState,
        education: initialEducationState,
        family: initialFamilyState,
        gmc: initialGmcState,
        address: initialAddressState,
        bank: initialBankState,
        esi: initialEsiState, // Initialize ESI state
        data: {},
        submitOnboarding: async () => {
            const { user } = useAuthStore.getState(); // Get user from authStore
            const state = get(); // Get current state using get()

            if (!user?.id) {
                console.error("No authenticated user found for onboarding submission.");
                return { success: false, error: 'User not authenticated' };
            }

            try {
                // Personal data ready
                let avatarUrl: string | null = null;
                let idProofUrl: string | null = null;
                let bankProofUrl: string | null = null;
                let gmcPolicyCopyUrl: string | null = null;
                // Education documents are handled inline

                // 1. Upload the avatar if it exists
                if (state.personal && state.personal.photo?.file) {
                    // Uploading avatar
                    // NOTE: Assuming employeeId is the user ID for now, but this should be replaced with the actual authenticated user ID (auth.uid())
                    const uploadResult = await api.uploadImage('avatars', state.personal.photo.file, state.personal.employeeId);
                    if (uploadResult) {
                        avatarUrl = uploadResult.publicUrl;
                        // Avatar uploaded
                    } else {
                        console.warn("Avatar upload failed, but continuing."); // Non-critical failure
                    }
                }

                // 2. Upload ID Proof if it exists
                if (state.personal && state.personal.idProof?.file) {
                    // Uploading ID Proof
                    const uploadResult = await api.uploadDocument(state.personal.idProof.file);
                    if (uploadResult) {
                        idProofUrl = uploadResult.url;
                        // ID Proof uploaded
                    } else {
                        console.warn("ID Proof upload failed, but continuing."); // Non-critical failure
                    }
                }

                // 3. Upload Bank Proof if it exists
                if (state.bank && state.bank.bankProof?.file) {
                    // Uploading Bank Proof
                    const uploadResult = await api.uploadDocument(state.bank.bankProof.file);
                    if (uploadResult) {
                        bankProofUrl = uploadResult.url;
                        // Bank Proof uploaded
                    } else {
                        console.warn("Bank Proof upload failed, but continuing."); // Non-critical failure
                    }
                }

                // 4. Upload GMC Policy Copy if it exists
                if (state.gmc && state.gmc.gmcPolicyCopy?.file) {
                    // Uploading GMC Policy Copy
                    const uploadResult = await api.uploadDocument(state.gmc.gmcPolicyCopy.file);
                    if (uploadResult) {
                        gmcPolicyCopyUrl = uploadResult.url;
                        // GMC Policy Copy uploaded
                    } else {
                        console.warn("GMC Policy Copy upload failed, but continuing."); // Non-critical failure
                    }
                }

                // 5. Upload Education Documents
                const updatedEducation = await Promise.all(state.education.map(async (edu: EducationRecord) => {
                    if (edu.document?.file) {
                        // Uploading education document
                        try {
                            const uploadResult = await api.uploadDocument(edu.document.file);
                            if (uploadResult) {
                                return { ...edu, document: { ...edu.document, url: uploadResult.url } };
                            }
                        } catch (e) {
                            console.warn(`Education document upload failed for ${edu.id}:`, e);
                        }
                    }
                    return edu;
                }));


                // 6. Prepare the final submission payload (mapping frontend fields to DB jsonb structure)
                const submissionPayload = {
                    id: crypto.randomUUID(), // Generate client-side ID to fix missing default value in DB
                    user_id: user.id, // Use the actual authenticated user ID
                    status: 'Draft',
                    portal_sync_status: 'Pending', // Default status
                    organization_id: state.organization.organizationId,
                    organization_name: state.organization.organizationName,
                    enrollment_date: state.organization.joiningDate, // Assuming joiningDate is enrollment_date
                    requires_manual_verification: false, // Default
                    forms_generated: false, // Default

                    // Store complex objects as JSONB - cast to any explicitly to satisfy Supabase Json type definition
                    personal: {
                        ...state.personal,
                        photo: avatarUrl, // Store URL instead of UploadedFile object
                        idProof: idProofUrl, // Store URL
                        verifiedStatus: state.personal.verifiedStatus || {}, // Ensure proper type
                    } as any,
                    address: state.address as any,
                    family: state.family as any,
                    education: updatedEducation.map((e: EducationRecord) => ({ ...e, document: e.document?.url || null })) as any, // Store URL
                    bank: {
                        ...state.bank,
                        bankProof: bankProofUrl, // Store URL
                    } as any,
                    uan: { uanNumber: state.personal.uanNumber, hasPreviousPf: state.personal.hasPreviousPf, pfNumber: state.personal.pfNumber } as any, // Extract UAN details
                    esi: state.esi as any,
                    gmc: {
                        ...state.gmc,
                        gmcPolicyCopy: gmcPolicyCopyUrl, // Store URL
                    } as any,
                    // Required fields for EnrollmentInsert
                    organization: state.organization as any,
                    uniforms: [] as any,
                    biometrics: {} as any,
                    salary_change_request: null,
                    verification_usage: {} as any,
                };

                // Final submission payload ready
                const submissionResult = await api.createEnrollment(submissionPayload);

                if (submissionResult) {
                    // Reset the form
                    set((s) => { s.reset() });
                    return { success: true };
                } else {
                    return { success: false, error: 'No data returned from submission' };
                }
            } catch (error: any) {
                console.error("Onboarding submission failed:", error);
                return { success: false, error: error.message || 'Unknown error' };
            }
        },
        updateOrganization: (updates) => {
            set((state) => {
                state.organization = { ...state.organization, ...updates };
            });
        },

        updatePersonal: (updates) => {
            set((state) => {
                state.personal = { ...state.personal, ...updates };
            });
        },

        updateAddress: (updates) => {
            set((state) => {
                state.address = { ...state.address, ...updates };
            });
        },

        setAddressVerifiedStatus: (type, updates) => {
            set((state) => {
                state.address[type].verifiedStatus = {
                    ...state.address[type].verifiedStatus,
                    ...updates,
                };
            });
        },

        updateBank: (updates) => {
            set((state) => {
                state.bank = { ...state.bank, ...updates };
            });
        },

        updateGmc: (updates) => {
            set((state) => {
                state.gmc = { ...state.gmc, ...updates };
            });
        },

        updateEsi: (updates) => {
            set((state) => {
                state.esi = { ...state.esi, ...updates };
            });
        },

        addEducationRecord: () => {
            set((state) => {
                const newRecord: EducationRecord = {
                    id: Date.now().toString(), // Simple unique ID generation
                    degree: '',
                    institution: '',
                    endYear: '',
                    document: null,
                };
                state.education.push(newRecord);
            });
        },

        updateEducationRecord: (id: string, updates: Partial<EducationRecord>) => {
            set((state) => {
                const index = state.education.findIndex((r: EducationRecord) => r.id === id);
                if (index !== -1) {
                    state.education[index] = { ...state.education[index], ...updates };
                }
            });
        },

        removeEducationRecord: (id: string) => {
            set((state) => {
                state.education = state.education.filter((r: EducationRecord) => r.id !== id);
            });
        },

        // --- Family Member Methods ---
        addFamilyMember: () => {
            set((state) => {
                const newMember: FamilyMember = {
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                    relation: 'Spouse', // Default to a valid value
                    name: '',
                    dob: '',
                    dependent: false,
                };
                state.family.push(newMember);
            });
        },

        updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => {
            set((state) => {
                const index = state.family.findIndex((m: FamilyMember) => m.id === id);
                if (index !== -1) {
                    state.family[index] = { ...state.family[index], ...updates };
                }
            });
        },

        removeFamilyMember: (id: string) => {
            set((state) => {
                state.family = state.family.filter((m: FamilyMember) => m.id !== id);
            });
        },
        // -----------------------------

        addOrUpdateEmergencyContactAsFamilyMember: () => {
            // Placeholder implementation for now
            // Emergency contact updated
        },

        logVerificationUsage: (_itemName) => {
            // Verification logged
        },

        reset: () => {
            set((state) => {
                state.organization = initialOrganizationState;
                state.personal = initialPersonalState;
                state.family = initialFamilyState; // Reset family state
                state.gmc = initialGmcState; // Reset GMC state
                state.address = initialAddressState; // Reset address state
                state.bank = initialBankState; // Reset bank state
                state.esi = initialEsiState; // Reset ESI state
            });
        },
    }))
);