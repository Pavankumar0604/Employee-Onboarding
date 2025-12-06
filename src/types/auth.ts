import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserCredentials {
  email: string;
  password: string;
  options?: {
    data: {
      full_name?: string;
      [key: string]: any;
    };
  };
}

export interface SignUpFormData extends UserCredentials {
  fullName: string;
  confirmPassword: string;
}

export type AuthView = 'login' | 'signup' | 'forgot';

export interface SignUpFormProps {
  onNavigate: (view: AuthView) => void;
}

export interface AuthResponse {
  user: SupabaseUser | null;
  session: any | null;
  error?: Error | null;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role_id: string | null;
}