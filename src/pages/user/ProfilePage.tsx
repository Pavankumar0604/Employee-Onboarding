import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types/mindmesh';
import type { UploadedFile } from '../../types/onboarding';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { User as Loader2, LogOut, Crosshair } from 'lucide-react';
import { AvatarUpload } from '../../components/onboarding/AvatarUpload';
import { format } from 'date-fns';
import Modal from '../../components/ui/Modal';
import SlideToConfirm from '../../components/ui/SlideToConfirm';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useThemeStore } from '../../store/themeStore';
import Checkbox from '../../components/ui/Checkbox';

// --- Profile Section ---
const profileValidationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    phone_number: yup.string().matches(/^[6-9][0-9]{9}$/, 'Must be a valid 10-digit Indian mobile number').optional().nullable(),
}).defined();

type ProfileFormData = Pick<User, 'name' | 'email' | 'phone_number'>;


// --- Main Component ---
const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, setTheme, isAutomatic, setAutomatic } = useThemeStore();
    const { isLoading: authIsLoading, profile } = useAuth();
    const { updateUserProfile, setProfilePhotoUrl, isCheckedIn, isAttendanceLoading, toggleCheckInStatus, logout, lastCheckInTime, lastCheckOutTime } = useAuthStore();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const isMobile = useMediaQuery('(max-width: 767px)');
    const isMobileView = isMobile; // Apply mobile view for all users on mobile
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


    useEffect(() => {
        const checkPermissions = async () => {
            if (!navigator.permissions?.query) {
                return;
            }
            try {
                const cameraStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
                const locationStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

                if (cameraStatus.state === 'granted' && locationStatus.state === 'granted') {
                } else if (cameraStatus.state === 'denied' || locationStatus.state === 'denied') {
                } else {
                }

                cameraStatus.onchange = null;
                locationStatus.onchange = null;

                return () => {
                    cameraStatus.onchange = null;
                    locationStatus.onchange = null;
                };

            } catch (e) {
                console.warn("Permissions API not fully supported. Defaulting to 'prompt'.", e);
                return () => { }; // Return empty cleanup function in case of error
            }
        };

        checkPermissions();
    }, []);

    // Profile form
    const { register, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isDirty }, reset } = useForm<ProfileFormData>({
        resolver: yupResolver(profileValidationSchema) as Resolver<ProfileFormData>,
        defaultValues: { name: profile?.name || '', email: profile?.email || '', phone_number: profile?.phone_number || '' },
    });

    // Sync form fields with profile data when it changes (Fix 2)
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                email: profile.email || '',
                phone_number: profile.phone_number || '',
            });
        }
    }, []);

    const handlePhotoChange = async (file: UploadedFile | null) => {
        if (!profile) return;

        // Optimistic update for immediate UI feedback (Fix 1)
        if (file && file.preview) {
            // Use the local preview URL provided by AvatarUpload for immediate display
            setProfilePhotoUrl(file.preview);
        } else if (!file) {
            // Optimistic removal
            setProfilePhotoUrl(null);
        }
        // The actual upload/removal and backend update is handled by AvatarUpload internally,
        // which uses authStore actions and triggers a session refresh.
    };

    const onProfileSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
        if (!profile) return;
        setIsSaving(true);
        try {
            await updateUserProfile(formData); // Ensure we await the async operation
            showToast('Profile updated successfully!', { type: 'success' });
        } catch (error) {
            console.error("Profile update error:", error);
            showToast('Failed to update profile.', { type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAttendanceAction = async () => {
        // isAttendanceLoading from store handles the loading state globally
        const { success, message } = await toggleCheckInStatus();

        // If action failed due to state mismatch, show error without reloading
        if (!success && (message.includes('already checked in') || message.includes('already checked out'))) {
            showToast('Attendance status out of sync. Please refresh the page manually.', { type: 'error' });
        } else {
            showToast(message, { type: success ? 'success' : 'error' });
        }
    };

    const handleSlideConfirm = async () => {
        await handleAttendanceAction();
    };




    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
    };

    const formatTime = (isoString: string | null) => {
        if (!isoString) return '--:--';
        return format(new Date(isoString), 'hh:mm a');
    };

    const getRoleName = (role: string) => {
        return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (authIsLoading) return <div>Loading user profile...</div>;
    if (!profile) return <div>Loading user profile...</div>;

    // Append a timestamp to the photo URL to bust browser cache
    if (!profile) return <div>Loading user profile...</div>;
    const cacheBustedPhotoUrl = profile.photo_url ? `${profile.photo_url}?t=${new Date().getTime()}` : null;

    const avatarFile: UploadedFile | null = cacheBustedPhotoUrl
        ? { preview: cacheBustedPhotoUrl, name: 'Profile Photo', type: 'image/jpeg', size: 0, file: new File([], 'profile.jpg', { type: 'image/jpeg' }) }
        : null;

    if (isMobileView) {
        return (
            <div className="p-4 space-y-8">
                <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} title="Confirm Log Out">
                    Are you sure you want to log out?
                </Modal>

                <div className="flex flex-col items-center text-center gap-4">
                    <AvatarUpload file={avatarFile} onFileChange={handlePhotoChange} />
                    <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-muted">{profile.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <section>
                        <h3 className="fo-section-title mb-4">Profile Details</h3>
                        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                            <Input label="Full Name" id="name" error={profileErrors.name?.message} {...register('name')} />
                            <Input label="Email Address" id="email" type="email" error={profileErrors.email?.message} {...register('email')} />
                            <Input label="Phone Number" id="phone_number" type="tel" error={profileErrors.phone_number?.message} {...register('phone_number')} />
                            <div className="flex justify-end pt-2">
                                <Button type="submit" loading={isSaving} disabled={!isDirty || isSaving}>Save Changes</Button>
                            </div>
                        </form>
                    </section>

                    <section>
                        <h3 className="fo-section-title mb-4">Appearance</h3>
                        <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-4">
                            <Checkbox
                                id="theme-automatic-mobile"
                                label="Automatic Theme"
                                description="Automatically switch between light and dark themes based on system settings."
                                checked={isAutomatic}
                                onChange={setAutomatic}
                            />
                            <Checkbox
                                id="theme-dark-mode-mobile"
                                label="Dark Mode"
                                description="Manually enable or disable dark mode."
                                checked={theme === 'dark'}
                                onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                disabled={isAutomatic}
                            />
                        </div>
                    </section>

                    <section>
                        <h3 className="fo-section-title mb-4">Work Hours Tracking</h3>
                        <div className="fo-attendance-card space-y-4">
                            <div className="flex justify-around">
                                <div className="text-center">
                                    <p className="fo-attendance-time">Last Check In</p>
                                    <p className="fo-attendance-time"><strong>{formatTime(lastCheckInTime)}</strong></p>
                                </div>
                                <div className="text-center">
                                    <p className="fo-attendance-time">Last Check Out</p>
                                    <p className="fo-attendance-time"><strong>{formatTime(lastCheckOutTime)}</strong></p>
                                </div>
                            </div>

                            {isAttendanceLoading ? (
                                <div className="flex items-center justify-center text-muted h-[56px]"><Loader2 className="h-6 w-6 animate-spin" /></div>
                            ) : isCheckedIn ? (
                                <SlideToConfirm onConfirm={handleSlideConfirm} text="Slide to Check Out" confirmText={isAttendanceLoading ? "Checking Out..." : "Confirm..."} disabled={isAttendanceLoading} />
                            ) : (
                                <SlideToConfirm onConfirm={handleSlideConfirm} text="Slide to Check In" confirmText={isAttendanceLoading ? "Checking In..." : "Confirm..."} disabled={isAttendanceLoading} />
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="fo-section-title mb-4">Account Actions</h3>
                        <div className="space-y-4">
                            <Button onClick={() => navigate('/leaves/dashboard')} variant="secondary" className="w-full justify-center !py-3"><Crosshair className="mr-2 h-5 w-5" /> Leave Tracker</Button>
                            <Button onClick={handleLogoutClick} variant="danger" className="w-full justify-center !py-3"><LogOut className="mr-2 h-5 w-5" /> Log Out</Button>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
            <div className="max-w-4xl mx-auto space-y-8 p-4">
                <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} title="Confirm Log Out">
                    Are you sure you want to log out?
                </Modal>
                {/* Profile Header Card (Centered, Rounded, Shadow) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6">
                    <div className="flex flex-col items-center">
                        <AvatarUpload file={avatarFile} onFileChange={handlePhotoChange} />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-primary-text">{profile.name}</h2>
                        <p className="text-muted text-lg">{getRoleName(profile.role)}</p>
                        <p className="text-sm text-muted mt-1">{profile.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Details</h3>
                            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                                <Input label="Full Name" id="name" error={profileErrors.name?.message} registration={register('name')} />
                                <Input label="Email Address" id="email" type="email" error={profileErrors.email?.message} registration={register('email')} />
                                <Input label="Phone Number" id="phone_number" type="tel" error={profileErrors.phone_number?.message} registration={register('phone_number')} />
                                <div className="flex justify-end pt-2">
                                    <Button type="submit" loading={isSaving} disabled={!isDirty || isSaving}>Save Changes</Button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Work Hours Tracking</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`text-center p-4 rounded-lg transition-colors duration-300 ${isCheckedIn ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Check In</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(lastCheckInTime)}</p>
                                    </div>
                                    <div className="text-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Check Out</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(lastCheckOutTime)}</p>
                                    </div>
                                </div>

                                {isAttendanceLoading ? (
                                    <div className="flex items-center justify-center h-[56px]"><Loader2 className="h-6 w-6 animate-spin text-sky-500" /></div>
                                ) : isCheckedIn ? (
                                    <SlideToConfirm onConfirm={handleSlideConfirm} text="Slide to Check Out" confirmText={isAttendanceLoading ? "Checking Out..." : "Confirm..."} disabled={isAttendanceLoading} />
                                ) : (
                                    <SlideToConfirm onConfirm={handleSlideConfirm} text="Slide to Check In" confirmText={isAttendanceLoading ? "Checking In..." : "Confirm..."} disabled={isAttendanceLoading} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Appearance</h3>
                            <div className="space-y-4">
                                <Checkbox id="theme-automatic-desktop" label="Automatic Theme" description="Automatically switch between light and dark themes based on system settings." checked={isAutomatic} onChange={setAutomatic} />
                                <Checkbox id="theme-dark-mode-desktop" label="Dark Mode" description="Manually enable or disable dark mode." checked={theme === 'dark'} onChange={(checked) => setTheme(checked ? 'dark' : 'light')} disabled={isAutomatic} />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account Actions</h3>
                            <div className="space-y-3">
                                <Button onClick={() => navigate('/leaves/dashboard')} variant="secondary" className="w-full justify-center"><Crosshair className="mr-2 h-4 w-4" /> Leave Tracker</Button>
                                <Button onClick={handleLogoutClick} variant="danger" className="w-full justify-center"><LogOut className="mr-2 h-4 w-4" /> Log Out</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;