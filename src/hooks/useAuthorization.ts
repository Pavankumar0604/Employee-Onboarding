import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/mindmesh';
import { useState, useEffect } from 'react';

export const useAuthorization = (requiredRole: UserRole | UserRole[]) => {
  const { user } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!user) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    // Check if the user's role matches the required role, or if the user is an admin (super user)
    const userRole = user.role;
    
    console.log('Authorization Check:', { userRole, requiredRole }); // DEBUG LOG
    
    let authorized = false;
    if (Array.isArray(requiredRole)) {
      // Admin users are authorized for any required role
      authorized = requiredRole.includes(userRole) || userRole.toLowerCase() === 'admin';
    } else {
      authorized = userRole.toLowerCase() === 'admin' || userRole === requiredRole;
    }
    console.log('Authorization Result:', authorized); // DEBUG LOG
    setIsAuthorized(authorized);
    setLoading(false);
  }, [user, requiredRole]);

  return { isAuthorized, loading };
};