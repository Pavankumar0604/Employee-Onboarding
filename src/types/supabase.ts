export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      onboarding_submissions: {
        Row: {
          id: string
          user_id: string | null
          status: string | null
          portal_sync_status: string | null
          organization_id: string | null
          organization_name: string | null
          enrollment_date: string | null
          requires_manual_verification: boolean
          forms_generated: boolean
          personal: Json | null
          address: Json | null
          family: Json | null
          education: Json | null
          bank: Json | null
          uan: Json | null
          esi: Json | null
          gmc: Json | null
          organization: Json | null
          uniforms: Json | null
          biometrics: Json | null
          salary_change_request: Json | null
          verification_usage: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string | null
          portal_sync_status?: string | null
          organization_id?: string | null
          organization_name?: string | null
          enrollment_date?: string | null
          requires_manual_verification?: boolean
          forms_generated?: boolean
          personal?: Json | null
          address?: Json | null
          family?: Json | null
          education?: Json | null
          bank?: Json | null
          uan?: Json | null
          esi?: Json | null
          gmc?: Json | null
          organization?: Json | null
          uniforms?: Json | null
          biometrics?: Json | null
          salary_change_request?: Json | null
          verification_usage?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['onboarding_submissions']['Row']>
      }
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          last_check_in_time: string | null
          last_check_out_time: string | null
          role_id: string | null
          site_id: string | null
          organization_id: string | null
          organization_name: string | null
          reporting_manager_id: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          phone?: string | null
          role_id?: string | null
          site_id?: string | null
          organization_id?: string | null
          organization_name?: string | null
          reporting_manager_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      roles: {
        Row: { id: string; display_name: string }
        Insert: { id: string; display_name: string }
        Update: Partial<Database['public']['Tables']['roles']['Row']>
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          site_id: string | null
          attendance_date: string
          status: string
          check_in_time: string | null
          check_out_time: string | null
          total_hours: number | null
          is_approved: boolean
          approved_by_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          site_id?: string | null
          attendance_date: string
          status: string
          check_in_time?: string | null
          check_out_time?: string | null
          total_hours?: number | null
          is_approved?: boolean
          approved_by_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['attendance']['Row']>
      }
      documents: {
        Row: {
          id: string
          user_id: string
          submission_id: string | null
          bucket_name: string
          file_path: string
          file_name: string
          mime_type: string | null
          size_bytes: number | null
          document_type: string | null
          uploaded_at: string
        }
        Insert: {
          user_id: string
          submission_id?: string | null
          bucket_name: string
          file_path: string
          file_name: string
          mime_type?: string | null
          size_bytes?: number | null
          document_type?: string | null
          uploaded_at?: string
        }
        Update: Partial<Database['public']['Tables']['documents']['Row']>
      }

      // Tables referenced in api.ts and schema.sql:

      uniform_requests: {
        Row: { id: string; site_id: string | null; site_name: string | null; gender: string | null; requested_date: string | null; status: string | null; items: Json | null; source: string | null; requested_by_id: string | null; requested_by_name: string | null; employee_details: Json | null; }
        Insert: { site_id?: string | null; site_name?: string | null; gender?: string | null; requested_date?: string | null; status?: string | null; items?: Json | null; source?: string | null; requested_by_id?: string | null; requested_by_name?: string | null; employee_details?: Json | null; }
        Update: Partial<Database['public']['Tables']['uniform_requests']['Row']>
      }

      invoices: {
        Row: { id: string; created_at: string; invoice_number: string; user_id: string | null; amount: number; status: string; due_date: string | null; paid_date: string | null }
        Insert: { invoice_number: string; user_id?: string | null; amount: number; status?: string; due_date?: string | null; paid_date?: string | null }
        Update: Partial<Database['public']['Tables']['invoices']['Row']>
      }

      leave_requests: {
        Row: { id: string; user_id: string; user_name: string | null; leave_type_id: string | null; start_date: string | null; end_date: string | null; reason: string | null; status: string | null; day_option: string | null; current_approver_id: string | null; approval_history: Json | null; doctor_certificate: Json | null; }
        Insert: { user_id: string; user_name?: string | null; leave_type_id?: string | null; start_date?: string | null; end_date?: string | null; reason?: string | null; status?: string | null; day_option?: string | null; current_approver_id?: string | null; approval_history?: Json | null; doctor_certificate?: Json | null; }
        Update: Partial<Database['public']['Tables']['leave_requests']['Row']>
      }

      user_activity_logs: {
        Row: { id: number; created_at: string; user_id: string; activity_type: string; details: Json | null }
        Insert: { user_id: string; activity_type: string; details?: Json | null }
        Update: Partial<Database['public']['Tables']['user_activity_logs']['Row']>
      }

      insurances: {
        Row: { id: string; type: string | null; provider: string | null; policyNumber: string | null; valid_till: string | null }
        Insert: { type?: string | null; provider?: string | null; policyNumber?: string | null; valid_till?: string | null }
        Update: Partial<Database['public']['Tables']['insurances']['Row']>
      }

      holidays: {
        Row: { id: string; date: string | null; name: string | null; type: string | null }
        Insert: { date?: string | null; name?: string | null; type?: string | null }
        Update: Partial<Database['public']['Tables']['holidays']['Row']>
      }

      tasks: {
        Row: { id: string; name: string | null; description: string | null; due_date: string | null; priority: string | null; status: string | null; created_at: string; assigned_to_id: string | null; assigned_to_name: string | null; completion_notes: string | null; completion_photo: Json | null; escalation_status: string | null; escalation_level1_user_id: string | null; escalation_level1_duration_days: number | null; escalation_level2_user_id: string | null; escalation_level2_duration_days: number | null; escalation_email: string | null; escalation_email_duration_days: number | null; }
        Insert: { name?: string | null; description?: string | null; due_date?: string | null; priority?: string | null; status?: string | null; assigned_to_id?: string | null; assigned_to_name?: string | null; completion_notes?: string | null; completion_photo?: Json | null; escalation_status?: string | null; escalation_level1_user_id?: string | null; escalation_level1_duration_days?: number | null; escalation_level2_user_id?: string | null; escalation_level2_duration_days?: number | null; escalation_email?: string | null; escalation_email_duration_days?: number | null; }
        Update: Partial<Database['public']['Tables']['tasks']['Row']>
      }

      assets: {
        Row: { id: string; name: string; description: string | null; asset_type: string | null; serial_number: string | null; assigned_to_id: string | null; status: string | null; purchase_date: string | null; warranty_till: string | null; created_at: string; updated_at: string; }
        Insert: { name: string; description?: string | null; asset_type?: string | null; serial_number?: string | null; assigned_to_id?: string | null; status?: string | null; purchase_date?: string | null; warranty_till?: string | null; }
        Update: Partial<Database['public']['Tables']['assets']['Row']>
      }

      back_office_id_series: {
        Row: { id: string; prefix: string; last_number: number; min_length: number; description: string | null; created_at: string; updated_at: string; }
        Insert: { id: string; prefix: string; last_number?: number; min_length?: number; description?: string | null; }
        Update: Partial<Database['public']['Tables']['back_office_id_series']['Row']>
      }

      site_staff_designations: {
        Row: { id: string; site_id: string | null; designation_name: string; description: string | null; created_at: string; updated_at: string; }
        Insert: { site_id?: string | null; designation_name: string; description?: string | null; }
        Update: Partial<Database['public']['Tables']['site_staff_designations']['Row']>
      }

      app_modules: {
        Row: { id: string; name: string; description: string | null; permissions: string[] | null }
        Insert: { id: string; name: string; description?: string | null; permissions?: string[] | null }
        Update: Partial<Database['public']['Tables']['app_modules']['Row']>
      }

      companies: {
        Row: { id: string; name: string; group_id: string | null }
        Insert: { name: string; group_id?: string | null }
        Update: Partial<Database['public']['Tables']['companies']['Row']>
      }

      comp_off_logs: {
        Row: { id: string; user_id: string; user_name: string | null; date_earned: string | null; reason: string | null; status: string | null; leave_request_id: string | null; granted_by_id: string | null; granted_by_name: string | null; created_at: string }
        Insert: { user_id: string; user_name?: string | null; date_earned?: string | null; reason?: string | null; status?: string | null; leave_request_id?: string | null; granted_by_id?: string | null; granted_by_name?: string | null; }
        Update: Partial<Database['public']['Tables']['comp_off_logs']['Row']>
      }

      entities: {
        Row: { id: string; name: string; company_id: string | null; organization_id: string | null; location: string | null; registered_address: string | null; registration_type: string | null; registration_number: string | null; gst_number: string | null; pan_number: string | null; email: string | null; e_shram_number: string | null; shop_and_establishment_code: string | null; epfo_code: string | null; esic_code: string | null; psara_license_number: string | null; psara_valid_till: string | null; insurance_ids: string[] | null; policy_ids: string[] | null; }
        Insert: { name: string; company_id?: string | null; organization_id?: string | null; location?: string | null; registered_address?: string | null; registration_type?: string | null; registration_number?: string | null; gst_number?: string | null; pan_number?: string | null; email?: string | null; e_shram_number?: string | null; shop_and_establishment_code?: string | null; epfo_code?: string | null; esic_code?: string | null; psara_license_number?: string | null; psara_valid_till?: string | null; insurance_ids?: string[] | null; policy_ids?: string[] | null; }
        Update: Partial<Database['public']['Tables']['entities']['Row']>
      }

      extra_work_logs: {
        Row: { id: string; user_id: string; user_name: string | null; work_date: string | null; work_type: string | null; claim_type: string | null; hours_worked: number | null; reason: string | null; status: string | null; approver_id: string | null; approver_name: string | null; approved_at: string | null; rejection_reason: string | null; created_at: string }
        Insert: { user_id: string; user_name?: string | null; work_date?: string | null; work_type?: string | null; claim_type?: string | null; hours_worked?: number | null; reason?: string | null; status?: string | null; approver_id?: string | null; approver_name?: string | null; approved_at?: string | null; rejection_reason?: string | null; }
        Update: Partial<Database['public']['Tables']['extra_work_logs']['Row']>
      }

      leave_types: {
        Row: { id: string; name: string; description: string | null; is_paid: boolean; max_days: number | null; requires_certificate: boolean; created_at: string; updated_at: string; }
        Insert: { name: string; description?: string | null; is_paid?: boolean; max_days?: number | null; requires_certificate?: boolean; }
        Update: Partial<Database['public']['Tables']['leave_types']['Row']>
      }

      notifications: {
        Row: { id: string; user_id: string; message: string | null; type: string | null; is_read: boolean; created_at: string; link_to: string | null }
        Insert: { user_id: string; message?: string | null; type?: string | null; is_read?: boolean; link_to?: string | null }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }

      organization_groups: {
        Row: { id: string; name: string }
        Insert: { name: string }
        Update: Partial<Database['public']['Tables']['organization_groups']['Row']>
      }

      policies: {
        Row: { id: string; name: string | null; description: string | null }
        Insert: { name?: string | null; description?: string | null }
        Update: Partial<Database['public']['Tables']['policies']['Row']>
      }

      settings: {
        Row: { id: string; attendance_settings: Json | null; approval_workflow_settings: Json | null; enrollment_rules: Json | null }
        Insert: { id?: string; attendance_settings?: Json | null; approval_workflow_settings?: Json | null; enrollment_rules?: Json | null }
        Update: Partial<Database['public']['Tables']['settings']['Row']>
      }

      sites: {
        Row: { id: string; short_name: string; full_name: string | null; address: string | null; manpower_approved_count: number | null; provisional_creation_date: string | null }
        Insert: { id: string; short_name: string; full_name?: string | null; address?: string | null; manpower_approved_count?: number | null; provisional_creation_date?: string | null }
        Update: Partial<Database['public']['Tables']['sites']['Row']>
      }

      support_tickets: {
        Row: { id: string; ticket_number: string | null; title: string | null; description: string | null; category: string | null; priority: string | null; status: string | null; raised_by_id: string | null; raised_by_name: string | null; raised_at: string; assigned_to_id: string | null; assigned_to_name: string | null; resolved_at: string | null; closed_at: string | null; rating: number | null; feedback: string | null; attachment_url: string | null }
        Insert: { title?: string | null; description?: string | null; category?: string | null; priority?: string | null; status?: string | null; raised_by_id?: string | null; raised_by_name?: string | null; assigned_to_id?: string | null; assigned_to_name?: string | null; resolved_at?: string | null; closed_at?: string | null; rating?: number | null; feedback?: string | null; attachment_url?: string | null }
        Update: Partial<Database['public']['Tables']['support_tickets']['Row']>
      }

      ticket_posts: {
        Row: { id: string; ticket_id: string; author_id: string | null; author_name: string | null; author_role: string | null; content: string | null; created_at: string; likes: string[] | null }
        Insert: { ticket_id: string; author_id?: string | null; author_name?: string | null; author_role?: string | null; content?: string | null; likes?: string[] | null }
        Update: Partial<Database['public']['Tables']['ticket_posts']['Row']>
      }

      ticket_comments: {
        Row: { id: string; post_id: string; author_id: string | null; author_name: string | null; content: string | null; created_at: string }
        Insert: { post_id: string; author_id?: string | null; author_name?: string | null; content?: string | null }
        Update: Partial<Database['public']['Tables']['ticket_comments']['Row']>
      }

      attendance_events: {
        Row: { id: string; user_id: string; timestamp: string; type: string; latitude: number | null; longitude: number | null }
        Insert: { user_id: string; timestamp: string; type: string; latitude?: number | null; longitude?: number | null }
        Update: Partial<Database['public']['Tables']['attendance_events']['Row']>
      }

    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_claim: {
        Args: { claim: string }
        Returns: Json
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      handle_user_role_update: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      create_storage_bucket_if_not_exists: {
        Args: { bucket_name: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database['public']['Tables'] & Database['public']['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
    Database['public']['Views'])
  ? (Database['public']['Tables'] &
    Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never