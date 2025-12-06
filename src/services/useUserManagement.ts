// src/services/useUserManagement.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MindmeshUser, UserRole } from '@mindmesh-types/mindmesh';
import { supabase } from '../lib/supabase';
import { signUp } from './authService';

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  organizationId?: string | null;
  organizationName?: string | null;
  phone_number?: string | null;
}

export const createUser = async (payload: CreateUserPayload): Promise<MindmeshUser> => {
  const { email, password, full_name, role, organizationId, organizationName, phone_number } = payload;

  // 1. Sign up the user using Supabase Auth
  const { user, error: authError } = await signUp({ email, password });

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("User creation failed during authentication step.");
  }

  // 2. Insert user profile into the 'users' table with role
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: email,
      full_name: full_name,
      name: full_name, // Assuming name is the same as full_name for simplicity
      role_id: role, // Use role_id which is a string (e.g., 'admin')
      organizationId: organizationId,
      organizationName: organizationName,
      is_active: true,
      phone_number: phone_number,
      // created_at is handled by database default
    } as any) // Use 'as any' to bypass strict type checking for Supabase Insert type mismatch
    .select()
    .single();

  if (profileError) {
    // If profile insertion fails, consider deleting the auth user if possible, but for now, just throw.
    console.error("Error inserting user profile:", profileError);
    throw profileError;
  }

  return profileData as MindmeshUser;
};

// --- Mock Supabase API Functions ---

const fetchUsers = async (): Promise<MindmeshUser[]> => {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app:
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as MindmeshUser[];
};

const updateUser = async (user: MindmeshUser): Promise<MindmeshUser> => {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 300));

  // In a real app:
  // @ts-ignore: Supabase type inference issue with update payload
  const { data, error } = await supabase.from('users').update(user).eq('id', user.id).single();
  if (error) throw error;
  return data as MindmeshUser;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<MindmeshUser, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate the users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['mindmeshUsers'] });
    },
  });
};

// --- TanStack Query Hooks ---

export const useFetchUsers = () => {
  return useQuery<MindmeshUser[], Error>({
    queryKey: ['mindmeshUsers'],
    queryFn: fetchUsers,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<MindmeshUser, Error, MindmeshUser>({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Invalidate the users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['mindmeshUsers'] });

      // Optionally, update the cache directly for better UX
      queryClient.setQueryData(['mindmeshUsers', updatedUser.id], updatedUser);
    },
  });
};