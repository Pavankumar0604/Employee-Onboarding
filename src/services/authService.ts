import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthResponse, UserCredentials, UserProfile } from '../types/auth.ts';

export const signIn = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const { email, password } = credentials;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error: new Error(error.message || 'Sign in failed') };
  }

  return { user: data.user, session: data.session };
};

export const signUp = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const { email, password, options } = credentials;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options,
  });

  if (error) {
    return { user: null, session: null, error: new Error(error.message || 'Sign up failed') };
  }

  return { user: data.user, session: data.session };
};

export const signOut = async (): Promise<boolean> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out failed:", error.message);
    return false;
  }
  return true;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const fetchUserProfile = async (currentUser?: User): Promise<UserProfile | null> => {
  const user = currentUser || (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  // The user profile data is stored in the 'users' table (public.users) linked by auth.users(id)
  const { data: profileData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }

  const profile = profileData as any; // Cast to any to bypass Supabase typing issues

  // Map Supabase row to UserProfile interface (adjust fields as necessary)
  const userProfile: UserProfile = {
    id: user.id,
    full_name: profile.full_name || user.email,
    avatar_url: profile.avatar_url || '',
    email: user.email || '',
    role_id: profile.role_id || '',
  };

  return userProfile;
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    return { user: null, session: null, error: new Error(error.message || 'Google sign-in failed') };
  }
  // Supabase handles the redirect. Since this is a redirect flow, we return a successful empty response.
  return { user: null, session: null };
};
export const sendPasswordReset = async (email: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Optionally specify a redirect URL if needed, but usually handled by Supabase settings
    // redirectTo: `${window.location.origin}/auth/update-password`,
  });

  if (error) {
    return { error: new Error(error.message || 'Password reset failed') };
  }

  return { error: null };
};


export type { UserProfile, UserCredentials };