import { create } from 'zustand';

interface EmailSettings {
  smtpServer: string;
  port: number;
  username: string;
  password: string;
  senderEmail: string;
}

interface ApiSettings {
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  clientSecret?: string; // Optional for Perfios
}

interface GeminiApiSettings {
  enabled: boolean;
}

interface SiteManagementSettings {
  enableProvisionalCreation: boolean;
}

interface NotificationSettings {
  email: {
    enabled: boolean;
  };
}

interface AddressSettings {
  enablePincodeVerification: boolean;
}

interface UiSettingsState {
  email: EmailSettings;
  perfiosApi: ApiSettings;
  geminiApi: GeminiApiSettings;
  siteManagement: SiteManagementSettings;
  otp: {
    enabled: boolean;
  };
  address: AddressSettings;
  notifications: NotificationSettings;
  autoScrollOnHover: boolean; // Added for MindmeshLayout scroll buttons
  isAutomaticTheme: boolean;
  isDarkMode: boolean;

  updateEmailSettings: (email: Partial<EmailSettings>) => void;
  toggleAutomaticTheme: () => void;
  toggleDarkMode: () => void;
  updatePerfiosApiSettings: (settings: Partial<ApiSettings>) => void;
  updateGeminiApiSettings: (settings: Partial<GeminiApiSettings>) => void;
  updateSiteManagementSettings: (settings: Partial<SiteManagementSettings>) => void;
  updateOtpSettings: (settings: Partial<{ enabled: boolean }>) => void;
  updateAddressSettings: (settings: Partial<AddressSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useUiSettingsStore = create<UiSettingsState>((set) => ({
  email: {
    smtpServer: '',
    port: 587,
    username: '',
    password: '',
    senderEmail: '',
  },
  perfiosApi: {
    enabled: false,
    endpoint: '',
    apiKey: '',
    clientSecret: '',
  },
  geminiApi: {
    enabled: false,
  },
  siteManagement: {
    enableProvisionalCreation: false,
  },
  otp: {
    enabled: false,
  },
  address: {
    enablePincodeVerification: false,
  },
  notifications: {
    email: {
      enabled: false,
    },
  },
  autoScrollOnHover: true, // Default to true
  isAutomaticTheme: true, // Default to automatic
  isDarkMode: false, // Default to light mode if not automatic

  updateEmailSettings: (email) => set((state) => ({ email: { ...state.email, ...email } })),
  toggleAutomaticTheme: () => set((state) => ({ isAutomaticTheme: !state.isAutomaticTheme })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  updatePerfiosApiSettings: (settings) => set((state) => ({ perfiosApi: { ...state.perfiosApi, ...settings } })),
  updateGeminiApiSettings: (settings) => set((state) => ({ geminiApi: { ...state.geminiApi, ...settings } })),
  updateSiteManagementSettings: (settings) => set((state) => ({ siteManagement: { ...state.siteManagement, ...settings } })),
  updateOtpSettings: (settings) => set((state) => ({ otp: { ...state.otp, ...settings } })),
  updateAddressSettings: (settings) => set((state) => ({ address: { ...state.address, ...settings } })),
  updateNotificationSettings: (settings) => set((state) => ({ notifications: { ...state.notifications, ...settings } })),
}));