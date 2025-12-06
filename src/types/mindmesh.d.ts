type Permission = string;
export type RegistrationType = string; // Added based on usage in ClientManagement.tsx

export interface OrganizationGroup {
    id: string;
    name: string;
    locations: string[]; // Added based on usage in ClientManagement.tsx
    companies: Company[];
}

export interface Company {
    id: string;
    name: string;
    entities: Entity[]; // Made mandatory based on usage in ClientManagement.tsx
}

export interface Entity {
    id: string;
    name: string;
    organizationId?: string;
    location?: string;
    registeredAddress?: string;
    companyName?: string;
    // Added properties based on CSV export/import logic in ClientManagement.tsx
    registrationType?: RegistrationType;
    registrationNumber?: string;
    gstNumber?: string;
    panNumber?: string;
    email?: string;
    eShramNumber?: string;
    shopAndEstablishmentCode?: string;
    epfoCode?: string;
    esicCode?: string;
    psaraLicenseNumber?: string;
    psaraValidTill?: string;
    insuranceIds?: string[];
    policyIds?: string[];
}

export interface Organization {
    id: string;
    name: string;
    shortName: string;
    fullName?: string;
    address?: string;
    manpowerApprovedCount?: number;
    location?: string;
    manager_id?: string;
}

export interface SiteStaffDesignation {
    id: string;
    designation: string;
    department: string;
    monthlySalary?: number | null; // Added for mock data, allowing null for empty/unknown salary
    permanentId: string; // Added for API mock data consistency
    temporaryId: string; // Added for API mock data consistency
}

export interface EnrollmentRules {
    enforceManpowerLimit: boolean;
    manpowerLimitRule: string;
    enableEsiRule: boolean;
    esiCtcThreshold: number;
    enableGmcRule: boolean;
    salaryThreshold: number;
    defaultPolicySingle: string;
    defaultPolicyMarried: string;
    allowSalaryEdit: boolean;
    enforceFamilyValidation: boolean;
    rulesByDesignation?: {
        [key: string]: {
            documents: DocumentRules;
            verifications: VerificationRules;
        };
    };
}

export interface DocumentRules {
    aadhaar: boolean;
    pan: boolean;
    bankProof: boolean;
    educationCertificate: boolean;
    salarySlip: boolean;
    uanProof: boolean;
    familyAadhaar: boolean;
}

export interface VerificationRules {
    requireBengaluruAddress: boolean;
    requireDobVerification: boolean;
}
export type UserRole = 'admin' | 'hr' | 'site_manager' | 'field_officer' | 'developer' | 'operation_manager' | 'guest';

export interface User {
    id: string;
    email: string | null;
    full_name: string | null;
    name: string;
    role: UserRole;
    organizationId: string | null;
    organizationName: string | null;
    is_active: boolean;
    created_at: string;
    phone_number: string | null;
    photo_url: string | null | undefined; // Changed from avatar_url
    location?: string | null;
    registeredAddress?: string | null;
    lastCheckInTime?: string | null; // Added for attendance status
    lastCheckOutTime?: string | null; // Added for attendance status
    // Ensure photo_url is present
    photo_url: string | null | undefined;
}

export type MindmeshUser = User;

export interface Asset {
    id: string;
    name: string;
    type: string;
    serialNumber: string;
    assignedToUserId: string | null;
    purchaseDate: string;
    status: 'Available' | 'Assigned' | 'Maintenance';
}

export interface Submission {
    id: string;
    userId: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedAt: string;
}

export interface OnboardingData {
    id: string;
    user_id: string;
    status: 'pending' | 'in_progress' | 'submitted' | 'verified' | 'rejected';
    personal: {
        firstName: string;
        lastName: string;
        employeeId: string;
        mobile: string; // Added mobile for lookup
    };
    portalSyncStatus: 'synced' | 'pending' | 'failed';
    organization?: Organization; // Added organization details
}

export interface LeaveBalance {
    userId: string;
    earnedTotal: number;
    earnedUsed: number;
    sickTotal: number;
    sickUsed: number;
    floatingTotal: number;
    floatingUsed: number;
}

export type LeaveType = 'Earned' | 'Sick' | 'Floating';

export type LeaveRequestStatus = 'pending_manager_approval' | 'approved' | 'rejected' | 'pending_hr_confirmation';

export interface LeaveRequest {
    id: string;
    user_id: string;
    userName: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: LeaveRequestStatus;
    submitted_at: string;
    currentApproverId: string | null;
    managerApprovalDate: string | null;
    hrConfirmationDate: string | null;
    rejectionReason: string | null;
    dayOption?: 'full_day' | 'first_half' | 'second_half';
}

export interface Policy {
    id: string;
    name: string;
    description?: string;
    type: 'GMC' | 'GPA' | 'GTL';
}

export interface Insurance {
    id: string;
    type: string;
    provider: string;
    policyNumber: string;
    validTill: string;
    user_id: string;
    start_date: string;
    end_date: string;
}

export interface SiteConfiguration {
    organizationId: string;
    billingName?: string;
    keyAccountManager?: string;
    location?: string;
    entityId?: string;
    registeredAddress?: string;
    gstNumber?: string;
    panNumber?: string;
    email1?: string;
    email2?: string;
    email3?: string;
    eShramNumber?: string;
    shopAndEstablishmentCode?: string;
    siteAreaSqFt?: string;
    projectType?: string;
    apartmentCount?: string;
    agreementDetails?: Record<string, any>;
    siteOperations?: Record<string, any>;
}

export interface ManpowerDetail {
    id: string;
    designation: string;
    count: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
    id: string;
    name: string;
    description?: string;
    dueDate?: string | null;
    priority: TaskPriority;
    assignedToId?: string | null;
    assignedToName?: string | null;
    escalationLevel1UserId?: string | null;
    escalationLevel1DurationDays?: number | null;
    escalationLevel2UserId?: string | null;
    escalationLevel2DurationDays?: number | null;
    escalationEmail?: string | null;
    escalationEmailDurationDays?: number | null;
    escalationStatus?: 'none' | 'level1' | 'level2' | 'email_sent';
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    createdAt: string;
    completionNotes?: string | null;
    completionPhoto?: string | null;
}

export type MindmeshUser = User;


export interface ApiUserResponse {
    id: string;
    email: string | null;
    full_name: string | null;
    is_active: boolean;
    created_at: string;
    roles?: {
        name: UserRole;
    }[];
}

export type NotificationType = 'task_assigned' | 'task_escalated' | 'provisional_site_reminder' | 'support_ticket_update';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    linkTo?: string;
    isRead: boolean;
    createdAt: string;
}

export interface UserActivityRecord {
    id: string;
    userId: string;
    timestamp: string;
    activityType: string;
}

export interface UserActivity {
    userId: string;
    timestamp: string;
    activityType: string;
}


export type InvoiceStatus = 'Not Generated' | 'Generated' | 'Sent' | 'Paid';

export interface InvoiceItem {
    id: string;
    description: string;
    deployment: number;
    ratePerMonth: number;
    noOfDays: number;
    ratePerDay: number;
}

export interface InvoiceData {
    siteName: string;
    siteAddress: string;
    invoiceNumber: string;
    invoiceDate: string;
    statementMonth: string;
    lineItems: InvoiceItem[];
}

// --- Tool Management Types ---

export interface MasterTool {
    id: string;
    name: string;
    department: string;
}

export type MasterToolsList = Record<string, MasterTool[]>;

// Assuming file fields use a type similar to UploadedFile from onboarding.ts
type FileUploadType = any;

export interface IssuedTool {
    id: string;
    department: string;
    name: string;
    quantity: number;
    picture?: FileUploadType | null;
    inwardDcCopy?: FileUploadType | null;
    deliveryCopy?: FileUploadType | null;
    invoiceCopy?: FileUploadType | null;
    signedReceipt?: FileUploadType | null;
    receiverName?: string;
}


export interface SiteStaff {
    id: string;
    siteId: string;
    name: string;
    employeeCode: string;
    designation: string;
}
