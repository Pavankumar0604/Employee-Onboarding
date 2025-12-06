import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;