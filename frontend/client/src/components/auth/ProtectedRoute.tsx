import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['admin', 'patient', 'doctor'], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  // Wait until the authentication state has been resolved before making any
  // routing decisions. This prevents a brief unauthenticated state on a page
  // refresh from causing an unwanted redirect to the login screen.
  if (loading) {
    // You can replace this with a more elaborate loading indicator if desired.
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect to={redirectTo} />;
  }

  // If authenticated but role not allowed, redirect to appropriate dashboard
  if (user && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Redirect to="/admin/dashboard" />;
    } else if (user.role === 'patient') {
      return <Redirect to="/patient/dashboard" />;
    } else if (user.role === 'doctor') {
      return <Redirect to="/doctor/dashboard" />;
    }
    // Fallback for any unexpected roles
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
} 