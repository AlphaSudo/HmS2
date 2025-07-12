import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { z } from 'zod';

export type UserRole = 'admin' | 'patient' | 'doctor' | null;

// Use `z.coerce.string()` so we accept numbers (or any value) and convert to
// string automatically. This prevents a mismatch if the server returns a
// numeric ID and avoids a failed parse that would otherwise clear the stored
// session on page refresh.
const userSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "patient", "doctor"]),
  avatar: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

interface AuthContextType {
  user: User | null;
  register: (username:string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  /**
   * Dev-only helper: instantly authenticates a demo user for the given role so
   * that protected routes can be previewed without a real backend call. This
   * should be guarded with an environment flag in the UI to keep it hidden in
   * production.
   */
  quickLogin: (role: Exclude<UserRole, null>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPatient: boolean;
  isDoctor: boolean;
  /**
   * Indicates whether the authentication state is still being resolved on the
   * very first application load. While this flag is true, components such as
   * `ProtectedRoute` should avoid redirecting the user because we do not yet
   * know if a valid session exists in `localStorage`.
   */
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hms_user');
    if (storedUser) {
      try {
        const parsedUser = userSchema.parse(JSON.parse(storedUser));
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('hms_user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (username:string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { username, email, password });
      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { username, password, role });
      const { token, ...userData } = response.data;

      // Assuming the API returns user data that we can store
      const loggedInUser: User = {
        // Make sure the ID is stored as a string so it matches the Zod schema
        id: String(userData.user_id || userData.id),
        name: userData.username || username,
        email: userData.email || '',
        role: role as 'admin' | 'patient' | 'doctor' // casting as the role is validated by now
      };

      localStorage.setItem('hms_token', token);
      localStorage.setItem('hms_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Login request details:', { username, role }); // Debug log
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
  };

  /**
   * Immediately authenticates the app with a mock user object. Useful for
   * designers / QA to jump straight into a role-specific interface without
   * creating an account or calling the backend.
   */
  const quickLogin = (role: 'admin' | 'patient' | 'doctor') => {
    const demoUser: User = {
      id: 'demo-' + role,
      name: role.charAt(0).toUpperCase() + role.slice(1) + ' Demo',
      email: `${role}@demo.local`,
      role,
    };

    localStorage.setItem('hms_user', JSON.stringify(demoUser));
    localStorage.setItem('hms_token', 'demo-token');
    setUser(demoUser);
  };

  const value: AuthContextType = {
    user,
    register,
    login,
    logout,
    quickLogin,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 