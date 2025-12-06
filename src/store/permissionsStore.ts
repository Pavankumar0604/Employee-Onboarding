import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Permission } from '../types/mindmesh.d';

// Mock permissions structure based on the layout logic
interface PermissionsState {
  permissions: Record<string, Permission[]>;
  setRolePermissions: (role: string, permissions: Permission[]) => void;
}

const mockPermissions: Record<string, Permission[]> = {
  admin: [ // Changed from Administrator to admin
    'view_all_submissions', 'view_developer_settings', 'manage_approval_workflow',
    'view_own_attendance', 'manage_attendance_rules', 'view_entity_management',
    'manage_enrollment_rules', 'manage_insurance',
    'view_invoice_summary', 'manage_leave_requests', 'create_enrollment',
    'view_operations_dashboard', 'manage_roles_and_permissions', 'view_site_dashboard',
    'manage_sites', 'manage_tasks', 'manage_users', 'apply_for_leave', 'view_all_attendance', 'download_attendance_report', 'manage_policies', 'manage_insurance'
  ],
  hr: [ // Changed from HR to hr
    'view_all_submissions', 'manage_approval_workflow', 'view_own_attendance',
    'manage_attendance_rules', 'view_entity_management', 'manage_enrollment_rules',
    'manage_insurance', 'manage_leave_requests', 'create_enrollment',
    'manage_roles_and_permissions', 'manage_users', 'apply_for_leave', 'view_all_attendance', 'download_attendance_report', 'manage_policies', 'manage_insurance'
  ],
  site_manager: [ // Changed from SiteManager to site_manager
    'view_all_submissions', 'view_own_attendance',
    'manage_leave_requests', 'view_site_dashboard', 'manage_tasks',
    'apply_for_leave', 'view_all_attendance', 'download_attendance_report'
  ],
  field_officer: [
    'view_own_attendance', 'create_enrollment', 'apply_for_leave'
  ],
  developer: [ // Changed from Developer to developer
    'view_developer_settings', 'view_all_submissions', 'view_operations_dashboard'
  ],
  operation_manager: [
    'view_all_submissions', 'view_operations_dashboard', 'manage_tasks', 'view_own_attendance', 'apply_for_leave', 'view_all_attendance', 'download_attendance_report'
  ],
  guest: [
    'view_all_submissions', 'view_developer_settings', 'manage_approval_workflow',
    'view_own_attendance', 'manage_attendance_rules', 'view_entity_management',
    'manage_enrollment_rules', 'manage_insurance',
    'view_invoice_summary', 'manage_leave_requests', 'create_enrollment',
    'view_operations_dashboard', 'manage_roles_and_permissions', 'view_site_dashboard',
    'manage_sites', 'manage_tasks', 'manage_users', 'apply_for_leave', 'view_all_attendance', 'download_attendance_report', 'manage_policies', 'manage_insurance'
  ]
};

export const usePermissionsStore = create(
  immer<PermissionsState>((set) => ({
    permissions: mockPermissions,
    setRolePermissions: (role, permissions) =>
      set((state) => {
        state.permissions[role] = permissions;
      }),
  }))
);