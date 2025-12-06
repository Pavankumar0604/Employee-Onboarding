import React, { ComponentType } from 'react';
import { useAuth } from '../../store/AuthContext';
import LoadingSpinner from '../layout/LoadingSpinner';
import { usePermissionsStore } from '../../store/permissionsStore';

interface WithAuthorizationProps {
  requiredRole?: string | string[];
  requiredPermission?: string;
}

const withAuthorization = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthorization: React.FC<P & WithAuthorizationProps> = (props) => {
    const { user, profile, isLoading } = useAuth();
    const { requiredRole, requiredPermission } = props;
    const { permissions } = usePermissionsStore();

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary-text mb-2">Authentication Required</h2>
            <p className="text-muted">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    // Permission-based check - use profile.role
    if (requiredPermission && profile?.role) {
      const rolePermissions = permissions[profile.role] || [];
      const hasPermission = rolePermissions.includes(requiredPermission as any);

      if (!hasPermission) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary-text mb-2">Unauthorized Access</h2>
              <p className="text-muted">You don't have permission to view this page.</p>
              <p className="text-sm text-muted mt-2">Required permission: <code className="bg-muted/20 px-2 py-1 rounded">{requiredPermission}</code></p>
              <p className="text-xs text-muted mt-2">Your role: <code className="bg-muted/20 px-2 py-1 rounded">{profile.role}</code></p>
            </div>
          </div>
        );
      }
    }

    // Role-based check - use profile.role
    if (requiredRole && profile?.role) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRole = allowedRoles.includes(profile.role);

      if (!hasRole) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary-text mb-2">Unauthorized Access</h2>
              <p className="text-muted">You don't have the required role to view this page.</p>
              <p className="text-sm text-muted mt-2">Your role: <code className="bg-muted/20 px-2 py-1 rounded">{profile.role}</code></p>
            </div>
          </div>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthorization;
};

export default withAuthorization;