import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Download, ShieldCheck, Settings, Mail, Image, Phone, Users } from 'lucide-react';
import { api } from '../../services/api';
import Toast from '../../components/ui/Toast';
import { useUiSettingsStore } from '../../store/uiSettingsStore';
import Checkbox from '../../components/ui/Checkbox';

const SettingsCard: React.FC<{ title: string; icon: React.ElementType, children: React.ReactNode, className?: string }> = ({ title, icon: Icon, children, className }) => (
    <div className={`bg-card p-6 rounded-xl shadow-card ${className || ''}`}>
        <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-accent-light mr-4">
                <Icon className="h-6 w-6 text-accent-dark" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-primary-text">{title}</h3>
            </div>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


export const ApiSettings: React.FC = () => {
    const store = useUiSettingsStore();
    const {
        perfiosApi,
        updatePerfiosApiSettings,
        geminiApi,
        updateGeminiApiSettings,
        siteManagement,
        updateSiteManagementSettings,
        otp,
        updateOtpSettings,
        address,
        updateAddressSettings,
        notifications,
        updateNotificationSettings,
    } = store;
    
    const [isExporting, setIsExporting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


    const handleExport = async () => {
        setIsExporting(true);
        setToast(null);
        try {
            const data = await api.exportAllData();
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = `paradigm_backup_${new Date().toISOString()}.json`;
            link.click();
            setToast({ message: 'Data exported successfully!', type: 'success'});
        } catch (error) {
            setToast({ message: 'Failed to export data.', type: 'error'});
        } finally {
            setIsExporting(false);
        }
    };

  return (
    <div className="space-y-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-primary-text">System Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* --- COLUMN 1: INTERFACE & INTEGRATIONS --- */}
            <div className="space-y-8">
                 <SettingsCard title="Page Interface" icon={Image}>
                    <p className="text-sm text-muted -mt-2">Customize the application's branding, login screen, and user interaction settings.</p>
                    <div className="pt-4">
                        <Button type="button">Open Interface Settings</Button>
                    </div>
                </SettingsCard>
                
                 <SettingsCard title="Verification APIs" icon={ShieldCheck}>
                    <p className="text-sm text-muted -mt-2">Configure third-party services for employee verification.</p>
                    <div className="space-y-6 pt-4">
                        {/* Gemini API OCR Verification */}
                        <div className="p-4 border rounded-lg bg-page/50">
                            <Checkbox
                                id="gemini-enabled"
                                label="Enable Gemini API OCR Verification"
                                checked={geminiApi?.enabled || false}
                                onChange={val => updateGeminiApiSettings({ enabled: val })}
                            />
                            <p className="text-xs text-muted mt-2">Use Google's Gemini API for document data extraction. This is a powerful fallback or primary OCR. API key must be configured on the backend.</p>
                        </div>

                        {/* Perfios API Verification */}
                        <div className="p-4 border rounded-lg bg-page/50">
                            <Checkbox
                                id="perfios-enabled"
                                label="Enable Perfios API Verification"
                                checked={perfiosApi.enabled}
                                onChange={val => updatePerfiosApiSettings({ enabled: val })}
                            />
                            <p className="text-xs text-muted mt-2">Use Perfios for Bank, Aadhaar, and UAN verification.</p>
                            <div className={`space-y-4 pt-4 mt-4 border-t transition-opacity ${!perfiosApi.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                <Input label="Perfios Client ID" value={perfiosApi.apiKey} onChange={e => updatePerfiosApiSettings({ apiKey: e.target.value })} />
                                <Input label="Perfios Client Secret" type="password" value={perfiosApi.clientSecret} onChange={e => updatePerfiosApiSettings({ clientSecret: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                 <SettingsCard title="Authentication Settings" icon={Phone}>
                    <p className="text-sm text-muted -mt-2">Manage how users sign in to the application.</p>
                    <div className="space-y-6 pt-4">
                        <Checkbox
                            id="otp-enabled"
                            label="Enable OTP Phone Sign-In"
                            checked={otp.enabled}
                            onChange={val => updateOtpSettings({ enabled: val })}
                        />
                        <p className="text-xs text-muted -mt-4">Allow users to sign in using a one-time password sent via SMS.</p>
                    </div>
                </SettingsCard>
            </div>

            {/* --- COLUMN 2: CLIENT & SITE MANAGEMENT, SYSTEM & DATA --- */}
            <div className="space-y-8">
                 <SettingsCard title="Client & Site Management" icon={Users}>
                    <p className="text-sm text-muted -mt-2">Control workflows for site creation and management.</p>
                    <div className="space-y-6 pt-4">
                        <Checkbox
                            id="provisional-site-creation"
                            label="Enable Provisional Site Creation"
                            checked={siteManagement?.enableProvisionalCreation || false}
                            onChange={val => updateSiteManagementSettings({ enableProvisionalCreation: val })}
                        />
                        <p className="text-xs text-muted -mt-4">Allows HR/Admins to create a site with just a name, providing a 90-day grace period to complete the full configuration for easier onboarding.</p>
                    </div>
                </SettingsCard>

                 <SettingsCard title="System & Data" icon={Settings}>
                    <p className="text-sm text-muted -mt-2">Manage core system settings and data operations.</p>
                     <div className="space-y-6 pt-4">
                         <Checkbox id="pincode-verification" label="Enable Pincode API Verification" checked={address.enablePincodeVerification} onChange={val => updateAddressSettings({ enablePincodeVerification: val })} />
                         <p className="text-xs text-muted -mt-4">Auto-fill City/State from pincode during onboarding.</p>
                         
                         <div className="pt-4 border-t">
                            <h4 className="font-semibold text-primary-text mb-2">Backup & Export</h4>
                            <p className="text-sm text-muted mb-4">Download all data from the active data source (Mock Data).</p>
                            <Button onClick={handleExport} loading={isExporting}>
                                <Download className="mr-2 h-4 w-4" /> Export All Data
                            </Button>
                        </div>
                     </div>
                </SettingsCard>

                <SettingsCard title="Notification Settings" icon={Mail}>
                    <p className="text-sm text-muted -mt-2">Configure how the system sends notifications.</p>
                    <div className="space-y-6 pt-4">
                        <Checkbox
                            id="email-notif-enabled"
                            label="Enable Email Notifications"
                            checked={notifications.email.enabled}
                            onChange={val => updateNotificationSettings({ email: { enabled: val } })}
                        />
                        <p className="text-xs text-muted -mt-4">Send emails for important events like task assignments. SMTP must be configured on the backend.</p>
                    </div>
                </SettingsCard>
            </div>
        </div>
    </div>
  );
};