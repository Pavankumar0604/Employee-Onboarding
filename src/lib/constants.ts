// Application-wide constants

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    HR: 'hr',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    FIELD_OFFICER: 'field officer',
    GUEST: 'guest',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Onboarding Status
export const ONBOARDING_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
} as const;

// Task Priority
export const TASK_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
} as const;

// Leave Types
export const LEAVE_TYPES = {
    CASUAL: 'Casual Leave',
    SICK: 'Sick Leave',
    PRIVILEGE: 'Privilege Leave',
    MATERNITY: 'Maternity Leave',
    PATERNITY: 'Paternity Leave',
    COMPENSATION: 'Compensation Off',
} as const;

// Application Config
export const APP_CONFIG = {
    APP_NAME: 'MindMesh HR Platform',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

// API Response Messages
export const API_MESSAGES = {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'An error occurred. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
} as const;

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    DATETIME: 'MMM dd, yyyy HH:mm',
    TIME: 'HH:mm',
} as const;
