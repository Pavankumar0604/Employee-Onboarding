import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserCredentials } from '../types/auth';
import { signIn, signOut, signUp } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { useAuthStore } from './authStore';
import { User as MindmeshUser } from '../types/mindmesh';

interface AuthContextType {
  user: User | null;
  profile: MindmeshUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  signInUser: (credentials: UserCredentials) => Promise<void>;
  signUpUser: (credentials: UserCredentials) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MindmeshUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { clearAuth, initializeUserSession } = useAuthStore();

  const isAuthenticated = !!user;

  useEffect(() => {
    const loadUser = async (session: any) => {
      if (session?.user) {
        setUser(session.user);
        await initializeUserSession();
        const updatedProfile = useAuthStore.getState().profile;
        setProfile(updatedProfile);
      } else {
        setUser(null);
        setProfile(null);
        clearAuth();
      }
      setIsLoading(false);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      loadUser(session);
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      loadUser(initialSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearAuth, initializeUserSession]);

  const handleSignIn = async (credentials: UserCredentials) => {
    try {
      setIsLoading(true);
      const { error } = await signIn(credentials);
      if (error) {
        throw error;
      }
      //Get session after signin
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await initializeUserSession();
        const updatedProfile = useAuthStore.getState().profile;
        setProfile(updatedProfile);
        showToast('Welcome back!', { type: 'success' });
      }
    } catch (error: any) {
      showToast(error.message || 'Login failed', { type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (credentials: UserCredentials) => {
    try {
      setIsLoading(true);
      const { error } = await signUp(credentials);
      if (error) {
        throw error;
      }
      // Get session after signup
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await initializeUserSession();
        const updatedProfile = useAuthStore.getState().profile;
        setProfile(updatedProfile);
        showToast('Account created successfully! Please check your email for verification.', { type: 'success' });
      }
    } catch (error: any) {
      showToast(error.message || 'Sign up failed', { type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      clearAuth();
      showToast('Logged out successfully.', { type: 'success' });
    } catch (error: any) {
      showToast(error.message || 'Logout failed', { type: 'error' });
    }
  };

  const refreshProfile = async () => {
    await initializeUserSession();
    const updatedProfile = useAuthStore.getState().profile;
    setProfile(updatedProfile);
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    loading,
    signInUser: handleSignIn,
    signUpUser: handleSignUp,
    signOutUser: handleSignOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};