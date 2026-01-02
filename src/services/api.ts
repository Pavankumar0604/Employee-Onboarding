
import { SupportTicket } from '../types/support.ts';
import { LeaveRequest } from '../types/mindmesh';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase'; // Import Database from generated types
import { BackOfficeIdSeries } from '../types/backoffice';
import { FileObject } from '@supabase/storage-js';
import { Asset, Organization, OnboardingData, UserRole, User, OrganizationGroup, SiteConfiguration, IssuedTool, MasterToolsList } from '../types/mindmesh';


import { StatData, ChartData, AttendanceEvent } from '../types/attendance'; // Import AttendanceEvent, StatData, ChartData types
import { Users, UserCheck, UserX, Clock, BarChart3, TrendingUp, MapPin } from 'lucide-react'; // Import Lucide React icons
import { Task, TaskInsert, UpdateTaskData } from '../types/task'; // Import Task types

// NOTE: This API layer focuses on robust data fetching and error propagation.
// Interactive feedback (toasts, loading states, success/failure notifications)
// should be handled by the calling component (e.g., a React hook or component)
// by catching the errors thrown by these functions.

/**
 * Generic error handler for logging and propagating Supabase errors.
 * This function logs the error to the console and then re-throws a more
 * user-friendly error message to be caught by the calling component.
 * @param error The error object from Supabase.
 * @param context A string describing the operation that failed.
 */
const logError = (error: any, context: string): never => {
  console.error(`Error in ${context}:`, error);
  throw new Error(`Supabase API Error (${context}): ${error.message || JSON.stringify(error)}`);
};

/**
 * Generic wrapper for Supabase SELECT queries.
 * It executes the query, logs and throws an error if one occurs,
 * otherwise returns the data.
 * @param query The Supabase query builder instance.
 * @param context A string describing the query operation.
 * @returns The data returned by the query.
 * @throws Error if the Supabase query fails.
 */
const supabaseQuery = async (query: any, context: string): Promise<any> => {
  const { data, error } = await query;
  if (error) {
    logError(error, context);
  }
  return data;
};

/**
 * Generic wrapper for Supabase INSERT, UPDATE, DELETE mutations.
 * It executes the mutation, logs and throws an error if one occurs,
 * otherwise returns the data.
 * @param mutation The Supabase mutation builder instance.
 * @param context A string describing the mutation operation.
 * @returns The data returned by the mutation.
 * @throws Error if the Supabase mutation fails.
 */
const supabaseMutation = async (mutation: any, context: string): Promise<any> => {
  const { data, error } = await mutation;
  if (error) {
    logError(error, context);
  }
  return data;
};

// Define types directly from the Database structure for clarity and compatibility
export type UserRow = Database['public']['Tables']['users']['Row'] & {
  organizationId?: string | null;
  photo_url?: string | null; // Frontend expects photo_url
  phone?: string | null; // Added based on schema
  avatar_url?: string | null;
};

type UserUpdateBase = Database['public']['Tables']['users']['Update'];
export type UserUpdatePayload = UserUpdateBase & { photo_url?: string | null; full_name?: string | null; email?: string | null; phone_number?: string | null; photoUrl?: string | null; name?: string | null; phone?: string | null; }; // Frontend payload

type UniformRow = Database['public']['Tables']['uniform_requests']['Row'];
type UniformUpdate = Partial<UniformRow>;

type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Partial<InvoiceRow>;
type InvoiceUpdate = Partial<InvoiceRow>;

export type LeaveRow = Database['public']['Tables']['leave_requests']['Row'];
type LeaveInsert = Omit<Database['public']['Tables']['leave_requests']['Insert'], 'id' | 'submitted_at'>;
type LeaveUpdate = Partial<Database['public']['Tables']['leave_requests']['Update'] & { status: string; manager_approval_date: string; hr_confirmation_date: string; current_approver_id: null | string; rejection_reason: string | null | undefined }>;

type EnrollmentRow = Database['public']['Tables']['onboarding_submissions']['Row'];
type EnrollmentInsert = Omit<EnrollmentRow, 'created_at' | 'updated_at'>;
type EnrollmentUpdate = Partial<EnrollmentRow>;

// Attendance types based on AttendanceRecord from mindmesh.d.ts
export type AttendanceRow = Database['public']['Tables']['attendance']['Row'];

// Assuming a separate table for raw check-in/check-out events
// NOTE: We are defining a mock structure here as the actual DB schema is unknown.
export type AttendanceEventRow = {
  id: string;
  user_id: string;
  timestamp: string;
  type: 'check-in' | 'check-out';
  location?: string;
};

// Asset types based on Asset from mindmesh.d.ts
export type AssetRow = Asset;
type AssetInsert = Omit<Asset, 'id'>;
type AssetUpdate = Partial<Asset>;

type ActivityLogRow = Database['public']['Tables']['user_activity_logs']['Row'];
type ActivityLogInsert = Database['public']['Tables']['user_activity_logs']['Insert'];

// Insurance types
type InsuranceRow = Database['public']['Tables']['insurances']['Row'];
export type InsuranceInsert = Omit<InsuranceRow, 'id' | 'created_at'>;
export type InsuranceUpdate = Partial<InsuranceRow>;

// New types for Invoice Summary
export type InvoiceStatus = 'Not Generated' | 'Generated' | 'Sent' | 'Paid';

export interface InvoiceItem {
  id: string;
  description: string;
  deployment: number;
  noOfDays: number;
  ratePerDay: number;
  ratePerMonth: number;
}

export interface InvoiceData {
  siteName: string;
  siteAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  statementMonth: string;
  lineItems: InvoiceItem[];
}


// --- User Profile and Role Management (Task 8) ---
/** Fetches all users with their role names. Requires Admin/Manager privileges via RLS. */
export const getAllUsersWithRoles = async (): Promise<(UserRow & { roles: { name: string } | null })[] | null> => {
  return supabaseQuery(
    supabase
      .from('users')
      .select(`
        *,
        roles ( display_name )
      `),
    'fetching all users with roles'
  );
};

/** Fetches all users and maps them to the User type. */
export const getUsers = async (): Promise<User[]> => {
  const usersWithRoles = await getAllUsersWithRoles();
  if (!usersWithRoles) return [];

  return usersWithRoles.map((u: any) => ({
    id: u.id,
    email: u.email,
    full_name: u.name,
    name: u.name || u.email?.split('@')[0] || 'Unknown User',
    role: u.roles?.name as UserRole || 'guest',
    organizationId: u.organizationId || null,
    organizationName: null,
    is_active: u.is_active,
    created_at: u.created_at,
    phone_number: u.phone,
    photo_url: u.photo_url,
  })) as unknown as User[];
};
/** Updates a user's profile (e.g., role, status). Requires Admin/Manager privileges via RLS. */
export const updateUserProfile = async (userId: string, updates: UserUpdatePayload): Promise<UserRow | null> => {
  const dbUpdates: Database['public']['Tables']['users']['Update'] = {};

  if (updates.name !== undefined) {
    (dbUpdates as any).name = updates.name;
  }

  if (updates.phone_number !== undefined) {
    (dbUpdates as any).phone = updates.phone_number;
  }

  if (updates.photo_url !== undefined) {
    (dbUpdates as any).photo_url = updates.photo_url;
  }

  if (updates.email !== undefined) {
    (dbUpdates as any).email = updates.email;
  }

  if (updates.photoUrl !== undefined) {
    (dbUpdates as any).photo_url = updates.photoUrl;
  }

  if (updates.phone !== undefined) {
    (dbUpdates as any).phone = updates.phone;
  }

  if (Object.keys(dbUpdates).length === 0) {
    console.warn("updateUserProfile called with no valid updates.");
    return null;
  }

  return supabaseMutation(
    (supabase.from('users') as any)
      .update(dbUpdates)
      .eq('id', userId)
      .select('id')
      .maybeSingle(),
    'updating user profile'
  );
};

/** Fetches all available roles. */
export const getRoles = async (): Promise<Database['public']['Tables']['roles']['Row'][] | null> => {
  return supabaseQuery(
    supabase.from('roles').select('*'),
    'fetching roles'
  );
};

// --- Uniforms CRUD ---

export const createUniform = async (uniform: any): Promise<UniformRow | null> => {
  return supabaseMutation(
    supabase.from('uniforms').insert(uniform as any).select().single(),
    'creating uniform'
  );
};

export const getUniforms = async (): Promise<UniformRow[] | null> => {
  return supabaseQuery(
    supabase.from('uniforms').select('*'),
    'fetching uniforms'
  );
};


export const updateUniform = async (id: string, updates: UniformUpdate): Promise<UniformRow | null> => {
  return supabaseMutation(
    (supabase
      .from('uniforms') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'updating uniform'
  );
};

export const deleteUniform = async (id: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('uniforms')
      .delete()
      .eq('id', id),
    'deleting uniform'
  );
};


// --- Tasks CRUD ---

export const createTask = async (task: TaskInsert): Promise<Task | null> => {
  return supabaseMutation(
    supabase
      .from('tasks')
      .insert(task as any)
      .select()
      .single(),
    'creating task'
  );
};

export const getTasks = async (userId?: string): Promise<Task[] | null> => {
  let query = supabase.from('tasks').select('*');
  if (userId) {
    query = query.eq('assigned_to', userId);
  }
  return supabaseQuery(query, 'fetching tasks');
};

export const getTask = async (taskId: string): Promise<Task | null> => {
  return supabaseQuery(
    supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single(),
    'fetching task'
  );
};

export const updateTask = async (id: string, updates: UpdateTaskData): Promise<Task | null> => {
  return supabaseMutation(
    (supabase
      .from('tasks') as any)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single(),
    'updating task'
  );
};

export const deleteTask = async (id: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('tasks')
      .delete()
      .eq('id', id),
    'deleting task'
  );
};

/**
 * @description Mocks fetching support tickets.
 * @returns {Promise<SupportTicket[]>} A promise that resolves to an array of mock support tickets.
 */
export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  console.log("Mock fetching support tickets...");
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  // Return mock data that matches the SupportTicket interface
  return [
    {
      id: 'ticket-1',
      title: 'Issue with login functionality',
      ticketNumber: 'SUP-001',
      description: 'Users are unable to log in to the application.',
      priority: 'High',
      status: 'Open',
      raisedByName: 'John Doe',
      raisedAt: '2023-10-26T10:00:00Z',
      raisedById: 'user-1',
      commentsCount: 5,
    },
    {
      id: 'ticket-2',
      title: 'Feature request: Dark mode',
      ticketNumber: 'SUP-002',
      description: 'Requesting a dark mode option for the UI.',
      priority: 'Low',
      status: 'In Progress',
      raisedByName: 'Jane Smith',
      raisedAt: '2023-10-25T14:30:00Z',
      raisedById: 'user-2',
      assignedToId: 'admin-user',
      commentsCount: 2,
    },
    {
      id: 'ticket-3',
      title: 'Bug: Report generation failing',
      ticketNumber: 'SUP-003',
      description: 'The attendance report generation is failing for certain date ranges.',
      priority: 'Urgent',
      status: 'Pending Requester',
      raisedByName: 'Alice Johnson',
      raisedAt: '2023-10-24T09:15:00Z',
      raisedById: 'user-3',
      commentsCount: 1,
    },
    {
      id: 'ticket-4',
      title: 'Question about asset tracking',
      ticketNumber: 'SUP-004',
      description: 'How to track assets assigned to multiple users?',
      priority: 'Medium',
      status: 'Resolved',
      raisedByName: 'Bob Williams',
      raisedAt: '2023-10-23T11:45:00Z',
      raisedById: 'user-4',
      assignedToId: 'admin-user',
      commentsCount: 3,
    },
  ];
};

// --- Invoices CRUD ---


// --- Invoices CRUD ---

export const createInvoice = async (invoice: InvoiceInsert): Promise<InvoiceRow | null> => {
  return supabaseMutation(
    supabase
      .from('invoices')
      .insert(invoice as any)
      .select()
      .single(),
    'creating invoice'
  );
};

export const getInvoices = async (userId?: string): Promise<InvoiceRow[] | null> => {
  let query = supabase.from('invoices').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  return supabaseQuery(query, 'fetching invoices');
};

export const updateInvoice = async (id: string, updates: InvoiceUpdate): Promise<InvoiceRow | null> => {
  return supabaseMutation(
    (supabase
      .from('invoices') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'updating invoice'
  );
};

export const deleteInvoice = async (id: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('invoices')
      .delete()
      .eq('id', id),
    'deleting invoice'
  );
};


// --- Leaves CRUD ---

export const createLeave = async (leave: LeaveInsert): Promise<LeaveRow | null> => {
  return supabaseMutation(
    supabase
      .from('leaves')
      .insert(leave as any)
      .select()
      .single(),
    'creating leave'
  );
};

export const getLeaves = async (userId?: string): Promise<LeaveRow[] | null> => {
  let query = supabase.from('leaves').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  return supabaseQuery(query, 'fetching leaves');
};

/** Fetches leave requests based on filters. */
export const getLeaveRequests = async (filters: { userId?: string; status?: string } = {}): Promise<LeaveRequest[] | null> => {
  let query = supabase
    .from('leaves')
    .select(
      `
      *,
      requester_user:users!leaves_user_id_fkey(full_name),
      approver_user:users!leaves_current_approver_id_fkey(full_name),
      leave_types ( name )
    `
    )
    .order('created_at', { ascending: false });

  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const data = await supabaseQuery(query, 'fetching leave requests');
  if (!data) return null;

  // Map the data to the LeaveRequest type
  const leaveRequests: LeaveRequest[] = data.map((leave: any) => ({
    id: leave.id,
    user_id: leave.user_id,
    userName: leave.requester_user?.full_name || 'Unknown User',
    approverName: leave.approver_user?.full_name || 'Pending/Unknown',
    leaveType: leave.leave_types?.name || 'Unknown Type',
    startDate: leave.start_date,
    endDate: leave.end_date,
    reason: leave.reason,
    status: leave.status,
    submitted_at: leave.submitted_at,
    currentApproverId: leave.current_approver_id,
    managerApprovalDate: leave.manager_approval_date,
    hrConfirmationDate: leave.hr_confirmation_date,
    rejectionReason: leave.rejection_reason,
    dayOption: leave.day_option,
  }));

  return leaveRequests;
};
export const updateLeave = async (id: string, updates: LeaveUpdate): Promise<LeaveRow | null> => {
  return supabaseMutation(
    (supabase
      .from('leaves') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'updating leave'
  );
};

export const deleteLeave = async (id: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('leaves')
      .delete()
      .eq('id', id),
    'deleting leave'
  );
};


// --- Enrollments CRUD ---

export const createEnrollment = async (enrollment: EnrollmentInsert): Promise<EnrollmentRow | null> => {
  return supabaseMutation(
    supabase
      .from('onboarding_submissions')
      .insert(enrollment as any)
      .select()
      .single(),
    'creating enrollment'
  );
};

export const getEnrollments = async (userId?: string): Promise<EnrollmentRow[] | null> => {
  let query = supabase.from('onboarding_submissions').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  return supabaseQuery(query, 'fetching enrollments');
};

export const updateEnrollment = async (id: string, updates: EnrollmentUpdate): Promise<EnrollmentRow | null> => {
  return supabaseMutation(
    (supabase
      .from('onboarding_submissions') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'updating enrollment'
  );
};

export const deleteEnrollment = async (id: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('onboarding_submissions')
      .delete()
      .eq('id', id),
    'deleting enrollment'
  );
};


// --- User Activity Logs CRUD ---

export const createActivityLog = async (log: ActivityLogInsert): Promise<ActivityLogRow | null> => {
  return supabaseMutation(
    supabase
      .from('user_activity_logs')
      .insert(log as any)
      .select()
      .single(),
    'creating activity log'
  );
};

export const getActivityLogs = async (userId?: string): Promise<ActivityLogRow[] | null> => {
  let query = supabase.from('user_activity_logs').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  return supabaseQuery(query, 'fetching activity logs');
};


// --- Storage Integration (Task 11) ---

/** Uploads a file to a specified bucket and path. */
export const uploadFile = async (bucketName: string, path: string, file: File, options?: { upsert?: boolean, contentType?: string }): Promise<{ path: string } | null> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, options);

  if (error) {
    logError(error, `uploading file to ${bucketName}/${path}`);
  }
  return data;
};

/** Gets a public URL for a file. */
const getPublicUrl = (bucketName: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
  return data.publicUrl;
};

/** Lists files in a bucket path. Requires Admin/Manager privileges via RLS on storage policies. */
export const listFiles = async (bucketName: string, path: string): Promise<FileObject[] | null> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(path);

  if (error) {
    logError(error, `listing files in ${bucketName}/${path}`);
  }
  return data;
};

/** Uploads an image to Supabase storage after resizing, specifically for user avatars, and updates the user profile. */
export const uploadImage = async (bucketName: string, image: File, userId: string): Promise<{ path: string, publicUrl: string } | null> => {
  if (bucketName !== 'avatars') {
    logError(new Error("uploadImage is currently only configured for the 'avatars' bucket."), "uploadImage configuration");
  }

  // const resizedImage = await resizeImage(image, 800, 600); // Example dimensions
  const fileToUpload = image; // Use original file, bypassing placeholder resizeImage

  // Path structure: avatars/<user_id>/avatar.jpg
  const fileExtension = image.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/avatar.${fileExtension}`;

  // 1. Upload the file
  const uploadData = await uploadFile(bucketName, filePath, fileToUpload, { upsert: true, contentType: fileToUpload.type });

  if (!uploadData || !uploadData.path) {
    // uploadFile already logs and throws on Supabase error. This handles the case where data is unexpectedly empty.
    logError(new Error("Supabase upload succeeded but returned no path data."), "uploadImage path check");
  }

  const fullPath = uploadData!.path;

  // 2. Get the public URL
  const publicUrl = getPublicUrl(bucketName, fullPath);

  // 3. Update the user's profile with the new photo URL
  console.log(`[API] Upload successful. Attempting to update user profile ${userId} with URL: ${publicUrl}`);
  // Note: updateUserProfile uses the new error propagation pattern (throws on failure)
  const updateResult = await updateUserProfile(userId, { photo_url: publicUrl });
  console.log(`[API] Profile update result received: ${updateResult ? 'Success' : 'Failure'}`);

  if (!updateResult) {
    // If profile update fails, the error is already logged/thrown by updateUserProfile.
    // We return null here to stop execution.
    return null;
  }

  return { path: fullPath, publicUrl };
};

// --- Document Processing and Upload (New) ---

/** Uploads a document file to the 'documents' bucket. */
export const uploadDocument = async (file: File): Promise<{ url: string } | null> => {
  const bucketName = 'documents';
  const filePath = `uploads/${Date.now()}-${file.name}`;

  // Use the refactored uploadFile utility
  const uploadData = await uploadFile(bucketName, filePath, file, { upsert: true, contentType: file.type });

  if (!uploadData || !uploadData.path) {
    // uploadFile already handles Supabase errors. This handles unexpected empty data.
    logError(new Error("Upload succeeded but returned no path data."), "uploadDocument path check");
  }

  const publicUrl = getPublicUrl(bucketName, uploadData!.path);
  return { url: publicUrl };
};

/**
 * Mocks an API call to extract data from an image/document using OCR/AI.
 * In a real application, this would call a Supabase Edge Function or external service.
 */
export const extractDataFromImage = async (
  mimeType: string,
  ocrSchema: any,
  docType?: 'Aadhaar' | 'PAN' | 'Voter ID' | 'Bank' | 'Salary' | 'UAN'
): Promise<Record<string, any>> => {
  console.log(`Mock OCR processing for ${docType} (${mimeType}) with schema:`, ocrSchema);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  // Mock logic to satisfy the Aadhaar check in UploadDocument.tsx
  const isAadhaar = docType === 'Aadhaar';

  if (isAadhaar) {
    // Simulate successful Aadhaar extraction
    return {
      isAadhaar: true,
      aadhaarNumber: 'XXXX XXXX 1234',
      name: 'Mock User',
      dob: '1990-01-01',
    };
  }

  // Generic mock response
  return {
    isAadhaar: false, // Default for non-Aadhaar documents
    extractedText: 'Mock data extracted successfully.',
  };
};

// --- Attendance CRUD (Task 5) ---

/** Fetches today's attendance record for a user. */
export const getTodayAttendanceRecord = async (userId: string): Promise<AttendanceRow | null> => {
  // Use attendance_date (DATE type) for reliable filtering regardless of timezone
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  return supabaseQuery(
    supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('attendance_date', today) // Filter by date column
      .maybeSingle(), // Expect 0 or 1 result
    'fetching today\'s attendance record'
  );
};

/** Creates a new attendance record (Clock In). */

export const clockIn = async (
  userId: string
): Promise<AttendanceRow | null> => {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // First, check if the user is already checked in for today
  const existingRecord = await getTodayAttendanceRecord(userId);

  if (existingRecord && existingRecord.check_in_time && !existingRecord.check_out_time) {
    // User is already checked in and has not checked out (using check_out from generated types)
    logError(new Error("User is already checked in for today."), "clockIn business logic");
  }

  return supabaseMutation(
    (supabase
      .from('attendance') as any)
      .insert({
        user_id: userId,
        attendance_date: today,
        status: 'Present',
        check_in_time: now,
        is_approved: true, // Explicitly set to true for self-approved check-ins
        approved_by_id: userId, // Set approved_by_id to the signing in user's ID
      })
      .select()
      .single(),
    'creating clock-in record'
  );
};


/** Updates an existing attendance record (Clock Out). */
export const clockOut = async (recordId: string): Promise<AttendanceRow | null> => {
  const now = new Date().toISOString();

  return supabaseMutation(
    (supabase
      .from('attendance') as any)
      .update({ check_out_time: now, status: 'Present' })
      .eq('id', recordId)
      .select()
      .single(),
    'updating clock-out record'
  );
};

/** Fetches raw attendance events (check-in/check-out) for a user within a date range. */
export const getAttendanceEvents = async (userId: string, startDate: string, endDate: string): Promise<AttendanceEvent[]> => {
  // NOTE: Assuming a 'attendance_events' table or similar structure for raw events.
  // Since we don't have the actual table, we mock the data retrieval based on the existing 'attendance' table.
  // In a real scenario, this would query a dedicated events table.

  // Mock implementation: Fetching records and converting them to events (imperfect, but satisfies the type requirement)
  // We cast the result to AttendanceRow[] to satisfy the compiler, assuming the 'attendance' table structure is close enough.
  const records = await supabaseQuery(
    supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .gte('attendance_date', startDate) // Filter by date range
      .lte('attendance_date', endDate),
    'fetching attendance records for events'
  );

  if (!records) {
    // Return empty array on error (error is logged and thrown by supabaseQuery, but we catch it here by checking for null)
    return [];
  }

  const events: AttendanceEvent[] = [];
  (records as AttendanceRow[]).forEach(record => {
    if (record.check_in_time) {
      events.push({
        id: `${record.id}-in`,
        userId: record.user_id,
        timestamp: record.check_in_time,
        type: 'check-in',
      });
    }
    // Use check_out from generated types, assuming it maps to check_out_time in DB
    if (record.check_out_time) {
      events.push({
        id: `${record.id}-out`,
        userId: record.user_id,
        timestamp: record.check_out_time,
        type: 'check-out',
      });
    }
  });

  return events;
};

/** Fetches attendance records for reporting. */
export const getAttendanceRecords = async (userId?: string, dateRange?: { start: string, end: string }): Promise<AttendanceRow[] | null> => {
  let query = supabase.from('attendance').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (dateRange) {
    // Filter by attendance_date (DATE type) for reliable range filtering
    query = query.gte('attendance_date', dateRange.start).lte('attendance_date', dateRange.end);
  }

  return supabaseQuery(
    query.order('attendance_date', { ascending: false }),
    'fetching attendance records'
  );
};

/**
 * Fetches attendance statistics for the dashboard.
 * @returns {Promise<StatData[]>} A promise that resolves to an array of attendance statistics.
 */
export const getAttendanceStats = async (): Promise<StatData[]> => {
  // Mock implementation for now
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { title: 'Total Employees', value: 1250, icon: Users, color: 'text-blue-500' },
    { title: 'Present Today', value: 1180, icon: UserCheck, color: 'text-sky-500' },
    { title: 'Absent Today', value: 45, icon: UserX, color: 'text-red-500' },
    { title: 'On Leave Today', value: 25, icon: Clock, color: 'text-yellow-500' },
  ];
};

/**
 * Fetches attendance chart data for the dashboard.
 * @returns {Promise<ChartData[]>} A promise that resolves to an array of attendance chart data.
 */
export const getAttendanceCharts = async (): Promise<ChartData[]> => {
  // Mock implementation for now
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { title: '7-Day Attendance Trend', icon: BarChart3, type: 'bar', data: [85, 88, 90, 87, 92, 91, 89] },
    { title: 'Productivity Trend Avg. Hours', icon: TrendingUp, type: 'line', data: [7.5, 7.6, 7.4, 7.8, 7.7, 7.9, 8.0] },
    { title: 'Attendance Rate by Site', icon: MapPin, type: 'progress', data: [{ site: 'HQ', rate: 95 }, { site: 'Site A', rate: 88 }, { site: 'Site B', rate: 92 }] },
  ];
};

/**
 * @description Mocks the generation and download of an attendance report.
 * @param {string} reportType - The format of the report (e.g., 'PDF', 'CSV').
 * @param {string} period - The period for which the report is generated.
 * @returns {Promise<{ success: boolean; message: string; downloadUrl?: string }>}
 */
export const generateAttendanceReport = async (reportType: string, period: string): Promise<{ success: boolean; message: string; downloadUrl?: string }> => {
  console.log(`Mock generating ${reportType} report for period: ${period}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate generation time

  // Mock success scenario
  return {
    success: true,
    message: `Attendance Report (${reportType}) generated successfully.`,
    downloadUrl: `/mock-downloads/attendance-report-${period}.${reportType.toLowerCase()}`,
  };
};
// --- Asset Management CRUD (Task 6) ---

/** Creates a new asset. */
export const createAsset = async (asset: AssetInsert): Promise<AssetRow | null> => {
  return supabaseMutation(
    supabase
      .from('assets')
      .insert(asset as any)
      .select()
      .single(),
    'creating asset'
  );
};

/** Gets all assets. */
export const getAssets = async (): Promise<AssetRow[] | null> => {
  return supabaseQuery(
    supabase
      .from('assets')
      .select('*'),
    'fetching all assets'
  );
};

/** Gets a specific asset by ID. */
export const getAsset = async (assetId: string): Promise<AssetRow | null> => {
  return supabaseQuery(
    supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single(),
    'fetching asset by ID'
  );
};

/** Updates an existing asset. */
export const updateAsset = async (assetId: string, updates: AssetUpdate): Promise<AssetRow | null> => {
  return supabaseMutation(
    (supabase
      .from('assets') as any)
      .update(updates)
      .eq('id', assetId)
      .select()
      .single(),
    'updating asset'
  );
};

/** Deletes an asset. */
export const deleteAsset = async (assetId: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('assets')
      .delete()
      .eq('id', assetId),
    'deleting asset'
  );
};

/** Gets all assets and groups them by site ID. */
export const getAllSiteAssets = async (): Promise<Record<string, Asset[]>> => {
  const assets = await supabaseQuery(
    supabase
      .from('assets')
      .select('*'),
    'fetching all site assets'
  );

  if (!assets) {
    // Return empty object on error (error is logged and thrown by supabaseQuery, but we catch it here by checking for null)
    return {};
  }

  const groupedAssets: Record<string, Asset[]> = {};
  (assets as Asset[]).forEach((asset: any) => {
    // Assuming 'siteId' is the correct property for grouping
    if (asset.siteId) {
      if (!groupedAssets[asset.siteId]) {
        groupedAssets[asset.siteId] = [];
      }
      groupedAssets[asset.siteId].push(asset);
    }
  });

  return groupedAssets;
};

/** Gets all issued tools and groups them by site ID. */
export const getAllSiteIssuedTools = async (): Promise<Record<string, IssuedTool[]>> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    'org1': [
      { id: 't1', department: 'Security', name: 'Handheld Radio', quantity: 5, receiverName: 'John Doe' },
      { id: 't2', department: 'Maintenance', name: 'Wrench Set', quantity: 2, receiverName: 'Jane Smith' },
    ],
    'org2': [
      { id: 't3', department: 'Security', name: 'Flashlight', quantity: 10, receiverName: 'Alice Johnson' },
    ]
  } as Record<string, IssuedTool[]>;
};

/** Fetches the master list of tools grouped by department. */
export const getToolsList = async (): Promise<MasterToolsList> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    'Security': [
      { id: 'm1', name: 'Handheld Radio', department: 'Security' },
      { id: 'm2', name: 'Flashlight', department: 'Security' },
    ],
    'Maintenance': [
      { id: 'm3', name: 'Wrench Set', department: 'Maintenance' },
      { id: 'm4', name: 'Drill Machine', department: 'Maintenance' },
    ],
  };
};

/** Updates the issued tools list for a specific site. */
export const updateSiteIssuedTools = async (siteId: string, tools: IssuedTool[]): Promise<void> => {
  // Mock implementation: In a real app, this would update the database.
  console.log(`Updating tools for site ${siteId}:`, tools);
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate success
};

/** Fetches the full organization structure (Groups -> Companies -> Entities). */
export const getOrganizationStructure = async (): Promise<OrganizationGroup[]> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 'g1',
      name: 'Group Alpha',
      locations: ['Mumbai', 'Pune'],
      companies: [
        {
          id: 'c1',
          name: 'Company A',
          entities: [
            { id: 'e1', name: 'Client 1 Site', organizationId: 'org1' },
            { id: 'e2', name: 'Client 2 Site', organizationId: 'org2' },
          ] as any,
        } as any,
      ],
    } as OrganizationGroup,
  ];
};

/** Fetches all site configurations. */
export const getSiteConfigurations = async (): Promise<SiteConfiguration[]> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { organizationId: 'org1', billingName: 'Billing A', keyAccountManager: 'KAM 1' }
  ] as SiteConfiguration[];
};

// --- Invoice Summary Functions ---

/** Fetches invoice statuses for a given month. */
export const getInvoiceStatuses = async (date: Date): Promise<Record<string, InvoiceStatus>> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  const month = date.toISOString().substring(0, 7); // YYYY-MM
  const statuses: Record<string, InvoiceStatus> = {
    "site1": "Paid",
    "site2": "Sent",
    "site3": "Generated",
    "site4": "Not Generated"
  };
  console.log(`Fetching invoice statuses for month: ${month}`);
  return statuses;
};

/** Fetches invoice summary data for a given site and month. */
export const getInvoiceSummaryData = async (siteId: string, date: Date): Promise<InvoiceData> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  const month = date.toISOString().substring(0, 7); // YYYY-MM
  console.log(`Fetching invoice data for site: ${siteId}, month: ${month}`);
  const invoiceData: InvoiceData = {
    siteName: "Test Site",
    siteAddress: "123 Test Address",
    invoiceNumber: "INV-2023-123",
    invoiceDate: "2023-11-07",
    statementMonth: "2023-10",
    lineItems: [
      { id: "1", description: "Service 1", deployment: 10, noOfDays: 31, ratePerDay: 100, ratePerMonth: 3100 },
      { id: "2", description: "Service 2", deployment: 5, noOfDays: 31, ratePerDay: 150, ratePerMonth: 4650 }
    ]
  };
  return invoiceData;
};

// --- Organization/Site Management (Needed for SiteDashboard) ---

/** Fetches city and state details based on pincode. */
export const getPincodeDetails = async (pincode: string): Promise<{ city: string; state: string }> => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].Status === 'Success') {
      const postOffice = data[0].PostOffice[0];
      return {
        city: postOffice.District,
        state: postOffice.State
      };
    } else {
      throw new Error('Invalid Pincode');
    }
  } catch (error) {
    console.error('Error fetching pincode details:', error);
    // Fallback or re-throw based on desired UX. Re-throwing allows the UI to show the error.
    throw new Error('Failed to fetch pincode details. Please check connection or enter manually.');
  }
};
/** Mocks approving a leave request. */
export const approveLeaveRequest = async (leaveId: string, userId: string): Promise<void> => {
  console.log(`Mock approving leave request ${leaveId} for user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
};

/** Mocks rejecting a leave request. */
export const rejectLeaveRequest = async (leaveId: string, userId: string): Promise<void> => {
  console.log(`Mock rejecting leave request ${leaveId} for user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
};

/** Mocks confirming a leave request by HR. */
export const confirmLeaveByHR = async (leaveId: string, userId: string): Promise<void> => {
  console.log(`Mock confirming leave request ${leaveId} by HR for user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
};
/** Fetches all organizations (Sites). */
export const getOrganizations = async (): Promise<Organization[] | null> => {
  return supabaseQuery(
    supabase
      .from('sites')
      .select('*'),
    'fetching organizations (sites)'
  ) as Promise<Organization[] | null>;
};


/** Fetches verification submissions (OnboardingData) filtered by status and organization ID. */
export const getVerificationSubmissions = async (status?: string, organizationId?: string): Promise<OnboardingData[] | null> => {
  let query = supabase
    .from('onboarding_submissions') // Correct table name based on schema.sql
    .select('*');

  if (organizationId) {
    // Assuming site_id on users table links to organization/site ID
    query = query.eq('site_id', organizationId); // Assuming site_id is directly on the enrollments table
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  return supabaseQuery(query, 'fetching verification submissions') as Promise<OnboardingData[] | null>;
};


// --- Supabase Functions/Endpoints (Task 12) ---

/** RPC call to complete a task, referencing the Postman collection example. */
export const completeTaskRpc = async (taskId: string): Promise<boolean> => {
  const data = await supabaseQuery(
    supabase.rpc('complete_task', { task_id: taskId } as any),
    'calling complete_task RPC'
  );

  // If supabaseQuery throws an error, it is handled. If it returns null, we return false.
  return (data as boolean) || false;
};

/**
 * Sets up a real-time subscription to the 'notifications' table for a specific user.
 * This function is designed to be used within a React hook (e.g., useRealtimeNotifications).
 * @param userId The ID of the user to subscribe to.
 * @param callback The function to call when a new notification is inserted or updated.
 * @returns The Supabase Realtime Channel instance.
 */
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  // NOTE: Removed explicit type annotation for payload due to potential mismatch with generated Database type.
  const channel = supabase
    .channel(`notifications_user_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Realtime notification received:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to notifications for user ${userId}`);
      }
      if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to notifications for user ${userId}`);
      }
    });

  return channel;
};

/** Tests the email connection. */
export const testEmailConnection = async (email: any): Promise<{ success: boolean; message: string }> => {
  // Placeholder implementation: Replace with actual API call
  console.log("Testing email connection with:", email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Email connection tested successfully." };
};

export const getUsersWithManagers = async (): Promise<any[]> => {
  console.log("Mock fetching users with managers...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const getApprovalWorkflowSettings = async (): Promise<any> => {
  console.log("Mock fetching approval workflow settings...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return {};
};

export const updateApprovalWorkflowSettings = async (settings: any): Promise<void> => {
  console.log("Mock updating approval workflow settings...", settings);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const updateUserReportingManager = async (userId: string, managerId: string): Promise<void> => {
  console.log(`Mock updating reporting manager for user ${userId} to ${managerId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
};

// --- Missing Functions (Restored) ---

export const exportAllData = async (): Promise<void> => {
  console.log("Mock exporting all data...");
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const getBackOfficeIdSeries = async (): Promise<BackOfficeIdSeries[] | null> => {
  return supabaseQuery(
    supabase
      .from('back_office_id_series')
      .select('*'),
    'fetching back office id series'
  );
};

export const updateBackOfficeIdSeries = async (id: string, updates: any): Promise<void> => {
  console.log("Mock updating back office id series...", id, updates);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const getManpowerDetails = async (): Promise<any[]> => {
  console.log("Mock fetching manpower details...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const getSiteStaffDesignations = async (): Promise<any[]> => {
  console.log("Mock fetching site staff designations...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const updateSiteStaffDesignations = async (id: string, updates: any): Promise<void> => {
  console.log("Mock updating site staff designations...", id, updates);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const getPolicies = async (): Promise<any[]> => {
  return supabaseQuery(
    supabase.from('policies').select('*'),
    'fetching policies'
  );
};

export const getInsurances = async (): Promise<any[]> => {
  return supabaseQuery(
    supabase.from('insurances').select('*'),
    'fetching insurances'
  );
};

export const createInsurance = async (insurance: any): Promise<any | null> => {
  return supabaseMutation(
    supabase.from('insurances').insert(insurance).select().single(),
    'creating insurance'
  );
};

export const updateInsurance = async (id: string, updates: any): Promise<any | null> => {
  return supabaseMutation(
    (supabase.from('insurances') as any).update(updates).eq('id', id).select().single(),
    'updating insurance'
  );
};

// --- Holidays CRUD ---

export const createHoliday = async (holiday: any): Promise<any | null> => {
  return supabaseMutation(
    supabase
      .from('holidays')
      .insert(holiday)
      .select()
      .single(),
    'creating holiday'
  );
};

export const getHolidays = async (): Promise<any[] | null> => {
  return supabaseQuery(
    supabase
      .from('holidays')
      .select('*'),
    'fetching holidays'
  );
};

export const updateHoliday = async (id: string, updates: any): Promise<any | null> => {
  return supabaseMutation(
    (supabase
      .from('holidays') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'updating holiday'
  );
};

export const deleteHoliday = async (id: string): Promise<void> => {
  return supabaseMutation(
    supabase
      .from('holidays')
      .delete()
      .eq('id', id),
    'deleting holiday'
  );
};

// Aggregate all exported functions into a single 'api' object
export const api = {
  // User Profile and Role Management
  getAllUsersWithRoles,
  getUsers,
  updateUserProfile,
  // createUserProfile,
  deleteUserProfile: async (userId: string): Promise<void> => {
    // Mock implementation for deleteUserProfile as it was missing in the original file but referenced in the api object
    console.log(`Mock deleting user profile ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  getRoles,

  // Uniforms CRUD
  createUniform,
  getUniforms,
  updateUniform,
  deleteUniform,

  // Tasks CRUD
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getSupportTickets,

  // Invoices CRUD
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,

  // Leaves CRUD
  createLeave,
  getLeaves,
  getLeaveRequests,
  updateLeave,
  deleteLeave,

  // Enrollments CRUD
  createEnrollment,
  getEnrollments,
  updateEnrollment,
  deleteEnrollment,

  // User Activity Logs CRUD
  createActivityLog,
  getActivityLogs,

  // Storage Integration
  uploadFile,
  listFiles,
  uploadImage,
  uploadDocument,
  extractDataFromImage,

  // Attendance CRUD
  getTodayAttendanceRecord,
  clockIn,
  clockOut,
  getAttendanceEvents,
  getAttendanceRecords,
  getAttendanceStats,
  getAttendanceCharts,
  generateAttendanceReport,

  // Asset Management CRUD
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset,
  getAllSiteAssets,

  // Tool Management
  getAllSiteIssuedTools,
  getToolsList,
  updateSiteIssuedTools,

  // Organization/Site Management
  getOrganizationStructure,
  getSiteConfigurations,
  getOrganizations,
  getVerificationSubmissions,

  // Invoice Summary Functions
  getInvoiceStatuses,
  getInvoiceSummaryData,
  getPincodeDetails,

  // Supabase Functions/Endpoints
  completeTaskRpc,
  testEmailConnection,
  exportAllData,
  approveLeaveRequest,
  rejectLeaveRequest,
  confirmLeaveByHR,

  // Real-time Subscriptions
  subscribeToNotifications,

  // Approval Workflow Management
  getUsersWithManagers,
  getApprovalWorkflowSettings,
  updateApprovalWorkflowSettings,
  updateUserReportingManager,

  // Back Office
  getBackOfficeIdSeries,
  updateBackOfficeIdSeries,

  // Costing & Resource Management (New)
  getManpowerDetails,

  // Site Staff Designation Management
  getSiteStaffDesignations,
  updateSiteStaffDesignations,

  // Policies and Insurance
  getPolicies,
  getInsurances,
  createInsurance,
  updateInsurance,

  // Holidays CRUD
  createHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday,
};