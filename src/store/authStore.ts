import { create } from 'zustand';
import { User } from '../types/mindmesh';
import { sendPasswordReset } from '../services/authService';
import { api, UserRow } from '../services/api'; // Import the API service and UserRow
import { supabase } from '../lib/supabase';

/**
 * Normalizes role display names from the database to match permission store keys.
 * Maps: 'Administrator'/'Admin' -> 'admin', 'HR'/'HR Manager' -> 'hr', etc.
 */
const normalizeRoleName = (displayName: string): User['role'] => {
  const normalized = displayName.toLowerCase().trim();

  // Map various display names to standardized role keys
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('hr')) return 'hr';
  if (normalized.includes('site') && normalized.includes('manager')) return 'site_manager';
  if (normalized.includes('field') && normalized.includes('officer')) return 'field_officer';
  if (normalized.includes('developer')) return 'developer';
  if (normalized.includes('operation') && normalized.includes('manager')) return 'operation_manager';
  if (normalized.includes('guest')) return 'guest';

  // Default fallback
  console.warn(`Unknown role display name: "${displayName}". Defaulting to 'guest'.`);
  return 'guest';
};

interface AuthState {
  user: User | null;
  profile: User | null; // Changed from UserProfile to User
  isCheckedIn: boolean;
  isAttendanceLoading: boolean;
  lastCheckInTime: string | null;
  lastCheckOutTime: string | null;
  currentAttendanceRecordId: string | null;
  isInitialized: boolean; // New state to track if session initialization is complete
  setUser: (user: User | null) => void;
  setProfile: (profile: User | null) => void; // Changed from UserProfile to User
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<{ success: boolean, message: string }>;
  removeProfilePhoto: () => Promise<{ success: boolean, message: string }>;
  setProfilePhotoUrl: (url: string | null) => void; // Non-persisting update for optimistic UI
  toggleCheckInStatus: () => Promise<{ success: boolean, message: string }>;
  initializeAttendanceStatus: (userId: string) => Promise<void>;
  initializeUserSession: () => Promise<void>; // Add this line
  logout: () => void;
  clearAuth: () => void;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Setup Supabase Auth Listener to handle session expiration (which causes Unauthorized errors)
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      set({ user: null, profile: null, isCheckedIn: false });
      // Auth state cleared
    } else if (event === 'TOKEN_REFRESHED' && !session?.user) {
      // If token refresh fails to yield a session, clear state
      set({ user: null, profile: null, isCheckedIn: false });
      // Token refresh failed, state cleared
    }
    // Note: For TOKEN_REFRESHED with a valid session, Supabase handles token renewal internally.
    // We rely on this to prevent subsequent API calls from failing with Unauthorized if the token was just renewed.
  });

  return {
    user: null,
    profile: null,
    isCheckedIn: false,
    isAttendanceLoading: false,
    lastCheckInTime: null,
    lastCheckOutTime: null,
    currentAttendanceRecordId: null,
    isInitialized: false, // Initialize to false
    setUser: (user) => {
      set({ user });
      if (user) {
        get().initializeAttendanceStatus(user.id); // Initialize attendance status when user is set
      }
    },
    setProfile: (profile) => set({ profile }),
    setProfilePhotoUrl: (url: string | null) => {
      const state = get();
      if (!state.user) return;
      set({
        user: { ...state.user, photo_url: url } as User,
        profile: { ...state.profile, photo_url: url } as User,
      });
    },
    updateUserProfile: async (updates: Partial<User>) => {
      const state = get();
      if (!state.user) {
        console.error("Cannot update profile: user is null.");
        throw new Error("User not authenticated.");
      }

      // Optimistic update for immediate UI feedback (Crucial for Profile Details Display fix)
      const updatedFields = updates.name ? { ...updates, name: updates.name } : updates;
      set({
        user: { ...state.user, ...updatedFields } as User,
        profile: { ...state.profile, ...updatedFields } as User,
      });

      // Persist changes to the backend
      try {
        const userId = state.user.id;
        await api.updateUserProfile(userId, updates);
        // After successful backend update, re-fetch the user to ensure store is in sync
        // After successful backend update, re-fetch the user to ensure store is in sync
        // await get().initializeUserSession();
      } catch (error) {
        console.error("Failed to update user profile on backend:", error);
        throw error; // Propagate error for component handling
      }
    },

    uploadProfilePhoto: async (file: File) => {
      const { user } = get();
      if (!user) return { success: false, message: 'User not authenticated.' };

      try {
        // 1. Upload file and update DB profile (avatar_url)
        const result = await api.uploadImage('avatars', file, user.id);

        if (!result || !result.publicUrl) {
          throw new Error("Upload failed or returned no URL.");
        }

        // 2. Update state immediately with the new URL from the upload service
        get().setProfilePhotoUrl(result.publicUrl);

        // 3. Refresh the entire session to ensure all other user data is consistent
        await get().initializeUserSession();

        return { success: true, message: 'Profile photo uploaded successfully!' };
      } catch (error: any) {
        console.error("Failed to upload profile photo:", error);
        // Attempt to extract a detailed message from the error object
        const errorMessage = error.message || (error.response?.data?.message) || 'Failed to upload profile photo. Check console for details.';
        return { success: false, message: errorMessage };
      }
    },

    removeProfilePhoto: async () => {
      const { user } = get();
      if (!user) return { success: false, message: 'User not authenticated.' };

      try {
        // 1. Update DB profile to remove photo_url
        await api.updateUserProfile(user.id, { photo_url: null });

        // 2. Refresh the entire session
        await get().initializeUserSession();

        return { success: true, message: 'Profile photo removed successfully!' };
      } catch (error: any) {
        console.error("Failed to remove profile photo:", error);
        return { success: false, message: error.message || 'Failed to remove profile photo.' };
      }
    },
    initializeUserSession: async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (error) throw error;

          const userRowData = data as UserRow;
          // role_id is the string ID (e.g., 'field_officer'), so we can use it directly or normalize it.
          // If role_id is null, default to 'guest'.
          const roleId = typeof userRowData.role_id === 'string' ? userRowData.role_id : 'guest';
          const normalizedRole = normalizeRoleName(roleId);

          // Validate photo_url to prevent 404 errors
          const rawPhotoUrl = userRowData.photo_url || userRowData.avatar_url;
          const isValidUrl = rawPhotoUrl &&
            typeof rawPhotoUrl === 'string' &&
            (rawPhotoUrl.startsWith('http://') ||
              rawPhotoUrl.startsWith('https://') ||
              rawPhotoUrl.startsWith('/'));

          const userProfile: User = {
            id: userRowData.id,
            email: userRowData.email,
            full_name: userRowData.name || null,
            name: userRowData.name || userRowData.email?.split('@')[0] || 'Unknown User',
            role: normalizedRole,
            organizationId: userRowData.organizationId || null,
            organizationName: null,
            is_active: true,
            created_at: userRowData.created_at,
            phone_number: userRowData.phone || null,
            photo_url: isValidUrl ? rawPhotoUrl : null,
          };

          set({ user: userProfile, profile: userProfile, isInitialized: true });
          // Explicitly initialize attendance status after restoring session
          await get().initializeAttendanceStatus(userProfile.id);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ user: null, profile: null, isInitialized: true });
        }
      } else {
        set({ user: null, profile: null, isInitialized: true });
      }
    },
    toggleCheckInStatus: async () => {
      const { user, isCheckedIn, currentAttendanceRecordId } = get();
      if (!user) {
        return { success: false, message: 'User not authenticated.' };
      }

      set({ isAttendanceLoading: true });
      let message = '';
      let success = false;

      try {
        if (isCheckedIn) {
          // Check Out
          if (!currentAttendanceRecordId) {
            throw new Error("No active check-in record found to check out from.");
          }
          const checkedOutRecord = await api.clockOut(currentAttendanceRecordId);
          if (checkedOutRecord) {
            set({
              isCheckedIn: false,
              lastCheckOutTime: checkedOutRecord.check_out_time,
              currentAttendanceRecordId: null,
            });
            await get().initializeAttendanceStatus(user.id); // Re-fetch to ensure UI is updated
            message = 'Checked out successfully!';
            success = true;
          } else {
            throw new Error("Failed to check out.");
          }
        } else {
          // Check In
          const checkedInRecord = await api.clockIn(user.id);
          if (checkedInRecord) {
            set({
              isCheckedIn: true,
              lastCheckInTime: checkedInRecord.check_in_time,
              currentAttendanceRecordId: checkedInRecord.id,
            });
            message = 'Checked in successfully!';
            success = true;
          } else {
            throw new Error("Failed to check in.");
          }
        }
      } catch (error: any) {
        console.error("Attendance action failed:", error);

        // Check for the specific business logic error from api.ts
        if (error.message && error.message.includes("User is already checked in for today.")) {
          // If the server says we are checked in, force a state refresh to synchronize client state
          await get().initializeAttendanceStatus(user.id);
          message = "Attendance status synchronized. You are already checked in.";
        } else {
          message = `Attendance update failed: ${error.message || 'Unknown error'}`;
        }

        success = false;
      } finally {
        set({ isAttendanceLoading: false });
      }
      return { success, message };
    },
    initializeAttendanceStatus: async (userId: string) => {
      set({ isAttendanceLoading: true });
      try {
        const record = await api.getTodayAttendanceRecord(userId);
        // Fetched today's attendance record
        if (record) {
          set({
            isCheckedIn: !!record.check_in_time && !record.check_out_time,
            lastCheckInTime: record.check_in_time,
            lastCheckOutTime: record.check_out_time,
            currentAttendanceRecordId: record.id,
          });
        } else {
          set({
            isCheckedIn: false,
            lastCheckInTime: null,
            lastCheckOutTime: null,
            currentAttendanceRecordId: null,
          });
        }
      } catch (error) {
        console.error("Failed to initialize attendance status:", error);
        set({
          isCheckedIn: false,
          lastCheckInTime: null,
          lastCheckOutTime: null,
          currentAttendanceRecordId: null,
        });
      } finally {
        // Attendance status initialized
        set({ isAttendanceLoading: false });
      }
    },
    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null, profile: null, isCheckedIn: false, lastCheckInTime: null, lastCheckOutTime: null, currentAttendanceRecordId: null });
    },
    clearAuth: () => set({ user: null, profile: null, isCheckedIn: false, lastCheckInTime: null, lastCheckOutTime: null, currentAttendanceRecordId: null }),
    sendPasswordReset: async (email: string) => {
      const { error } = await sendPasswordReset(email);
      return { error };
    },
  };
});
