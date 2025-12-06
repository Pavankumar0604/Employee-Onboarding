import React, { useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login'); // Redirect to login page if not authenticated
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering children if not authenticated (already redirecting)
  }

  return <>{children}</>;
};

export default AuthGuard;
