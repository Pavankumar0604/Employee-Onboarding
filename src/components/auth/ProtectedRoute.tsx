import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

// Feature flag to temporarily disable authentication for testing
// Set VITE_DISABLE_AUTH=true in .env.local to bypass authentication
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // ⚠️ TEMPORARY: Bypass authentication if feature flag is enabled
  if (DISABLE_AUTH) {
    console.warn('⚠️ Authentication is DISABLED for testing. Re-enable before production!');
    return <Outlet />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;