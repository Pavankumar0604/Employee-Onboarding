// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/layout/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MindmeshLayout from './components/layout/MindmeshLayout';
import AuthenticationPage from './pages/auth/AuthenticationPage'; // Use the wrapper component
import withAuthorization from './components/auth/withAuthorization';

// --- Lazy Loaded Modules ---
const NewEnrollmentPage = lazy(() => import('./pages/enrollment/NewEnrollmentPage').then(module => ({ default: module.default })));
// Pages used in Protected Routes
const AllSubmissionsPage = lazy(() => import('./pages/submissions/AllSubmissionsPage'));
const APISettingsPage = lazy(() => import('./pages/settings/APISettingsPage').then(module => ({ default: module.ApiSettings })));
const AttendancePage = lazy(() => import('./pages/attendance/AttendancePage'));
const AttendanceDashboardPage = lazy(() => import('./components/attendance/AttendanceDashboardPage'));
const LeaveManagementModulePage = lazy(() => import('./pages/leave/LeaveManagementModulePage'));
const ApprovalWorkflowPage = lazy(() => import('./pages/leave/ApprovalWorkflowPage')); // NEW
const OperationsDashboardPage = lazy(() => import('./pages/dashboard/OperationsDashboardPage'));
const OnboardingDashboardPage = lazy(() => import('./pages/dashboard/OnboardingDashboardPage'));
const SiteDashboardPage = lazy(() => import('./pages/dashboard/SiteDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/user/UserManagementPage'));
const TaskManagementPage = lazy(() => import('./pages/operations/TaskManagementPage'));
const UniformManagementPage = lazy(() => import('./pages/management/UniformManagementPage'));
const AssetListPage = lazy(() => import('./pages/assetmanagement/AssetListPage'));
const AssetDetailsPage = lazy(() => import('./pages/assetmanagement/AssetDetailsPage'));
const AssetCreatePage = lazy(() => import('./pages/assetmanagement/AssetCreatePage'));
const AssetEditPage = lazy(() => import('./pages/assetmanagement/AssetEditPage'));
const TaskDetailsModal = lazy(() => import('./pages/supportdesk/TaskDetailsModal'));
const OnboardingProcessPage = lazy(() => import('./pages/onboarding/OnboardingProcessPage'));

const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const LeaveTrackerPage = lazy(() => import('./pages/leave/LeaveTrackerPage')); // NEW
const AttendanceRulesPage = lazy(() => import('./pages/attendance/AttendanceRulesPage')); // NEW
const RoleManagementPage = lazy(() => import('./pages/user/RoleManagementPage')); // NEW
const SiteManagementPage = lazy(() => import('./pages/management/SiteManagementPage')); // NEW
const InsuranceManagementPage = lazy(() => import('./pages/management/InsuranceManagementPage')); // NEW
const InvoiceSummaryPage = lazy(() => import('./pages/finance/InvoiceSummaryPage')); // NEW
const EnrollmentRulesPage = lazy(() => import('./pages/enrollment/EnrollmentRulesPage')); // NEW
const BackendSupportPage = lazy(() => import('./pages/management/BackendSupport')); // NEW

// Lazy Loaded Modules - Management Pages
const ClientManagementPage = lazy(() => import('./pages/management/ClientManagement'));
// Pages used in Protected Routes
const AdminRoute = withAuthorization(APISettingsPage);
const HRRoute = withAuthorization(LeaveManagementModulePage);
const ApprovalWorkflowRoute = withAuthorization(ApprovalWorkflowPage); // NEW Wrapper
const SiteManagerRoute = withAuthorization(SiteDashboardPage);
const UserMgmtRoute = withAuthorization(UserManagementPage);
const UniformRoute = withAuthorization(UniformManagementPage);
const AttendanceRulesRoute = withAuthorization(AttendanceRulesPage); // NEW Wrapper
const RoleMgmtRoute = withAuthorization(RoleManagementPage); // NEW Wrapper
const SiteMgmtRoute = withAuthorization(SiteManagementPage); // NEW Wrapper
const InsuranceRoute = withAuthorization(InsuranceManagementPage); // NEW Wrapper
const FinanceRoute = withAuthorization(InvoiceSummaryPage); // NEW Wrapper
const EnrollmentRulesRoute = withAuthorization(EnrollmentRulesPage); // NEW Wrapper
const BackendSupportRoute = withAuthorization(BackendSupportPage); // NEW Wrapper
const ClientManagementRoute = withAuthorization(ClientManagementPage); // NEW Wrapper for Client Management
const DeveloperRoute = withAuthorization(TaskManagementPage);

/**
 * The main application component that defines the routing structure.
 * It uses lazy loading for improved performance.
 */
/**
 * Interface for the App component props
 */
interface AppProps { }
/**
 * @returns JSX.Element
 */
const App: React.FC<AppProps> = (): JSX.Element => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/*" element={<AuthenticationPage />} />
        {/* Protected Routes (Requires Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MindmeshLayout />} >
            {/* Nested routes for the dashboard layout */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="/dashboard" element={<OperationsDashboardPage />} />
            <Route path="/attendance-dashboard" element={<AttendanceDashboardPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/onboarding" element={<OnboardingDashboardPage />} /> {/* Added Onboarding Dashboard */}
            <Route path="/onboarding/add/:step" element={<OnboardingProcessPage />} />
            <Route path="/onboarding/process" element={<OnboardingProcessPage />} />
            <Route path="/enrollment/new" element={<NewEnrollmentPage />} />
            <Route path="/submissions" element={<AllSubmissionsPage />} /> {/* Accessible by default, internal checks needed */}
            {/* Role-Based Access Controlled Routes */}
            <Route path="/api-settings" element={<AdminRoute requiredPermission="view_developer_settings" />} />
            <Route path="/user-management" element={<UserMgmtRoute requiredRole="admin" />} /> {/* Assuming Admin */}
            <Route path="/leave-management" element={<HRRoute requiredRole={["hr", "admin"]} />} />
            <Route path="/approvals/leave" element={<HRRoute requiredRole={["hr", "admin", "site_manager"]} />} /> {/* NEW Route for Leave Approvals from Notifications */}
            <Route path="/leaves/dashboard" element={<LeaveTrackerPage />} /> {/* NEW Route for Leave Tracker */}
            <Route path="/leave/approval-workflow" element={<ApprovalWorkflowRoute requiredRole={["hr", "admin"]} />} /> {/* NEW Route */}
            <Route path="/site-dashboard" element={<SiteManagerRoute requiredRole={["site_manager", "admin"]} />} />
            <Route path="/assets" element={<UniformRoute requiredRole={["site_manager", "admin"]} />} /> {/* Assuming SiteManager manages assets */}
            <Route path="/asset-management" element={<SiteManagerRoute requiredRole={["site_manager", "admin"]} />} >
              <Route index element={<AssetListPage />} />
              <Route path=":assetId" element={<AssetDetailsPage />} />
              <Route path="create" element={<AssetCreatePage />} />
              <Route path="edit/:assetId" element={<AssetEditPage />} />
            </Route>
            <Route path="/operations/task-management" element={<DeveloperRoute requiredRole={["developer", "admin"]} />} > {/* Assuming Developer/Others use this for tasks */}
              <Route index element={<TaskManagementPage />} />
              <Route path=":taskId" element={<TaskDetailsModal />} />
            </Route>
            <Route path="profile" element={<ProfilePage />} />

            {/* NEW ROUTES based on MindmeshLayout paths */}
            <Route path="/attendance/rules" element={<AttendanceRulesRoute requiredRole={["hr", "admin"]} />} /> // Maps to Attendance Rules
            <Route path="/user/roles" element={<RoleMgmtRoute requiredRole="admin" />} /> // Maps to Role Management (Admin)
            <Route path="/site-management" element={<SiteMgmtRoute requiredRole={["site_manager", "admin"]} />} /> // Maps to Site Management (SiteManager)
            <Route path="/management/insurance" element={<InsuranceRoute requiredRole={["hr", "admin"]} />} /> // Maps to Insurance Management (HR)
            <Route path="/finance/summary" element={<FinanceRoute requiredRole="admin" />} /> // Maps to Invoice Summary (Admin/Billing)
            <Route path="/enrollment/rules" element={<EnrollmentRulesRoute requiredRole={["hr", "admin"]} />} /> // Maps to Enrollment Rules (HR)
            <Route path="/management/clients" element={<ClientManagementRoute requiredRole="admin" />} /> // Maps to Client Management (Admin)
            <Route path="/management/backendsupport" element={<BackendSupportRoute requiredRole="admin" />} /> // Maps to Backend Support & Audit
            <Route path="/management/sites" element={<SiteMgmtRoute requiredRole={["site_manager", "admin"]} />} /> // Maps to Site Management (SiteManager) - Reusing SiteMgmtRoute for consistency if SiteManager manages sites
            <Route path="/management/uniforms" element={<UniformRoute requiredRole={["site_manager", "admin"]} />} /> // Maps to Uniform Management (UniformRoute)

            {/* Add a redirect for the root path */}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

// Lazy loading is used for improved initial load time.  Consider monitoring performance and pre-loading components as needed.
export default App;
