import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, useLoginMutation, useLogoutMutation, User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isResident: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setUser: (user: User) => void;
  canAccess: (userType: 'ADMIN' | 'RESIDENT') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = authService.getCurrentUser();
        const storedToken = authService.getToken();

        setUserState(storedUser);
        setTokenState(storedToken);
      } catch (error) {
        console.error('AuthContext: Error initializing auth', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const data = await loginMutation.mutateAsync({ email, password });

      setUserState(data.user);
      setTokenState(data.token);

      // Return success - let the component handle navigation and toast
      return;
    } catch (error: any) {
      // Clear any partial auth state
      setUserState(null);
      setTokenState(null);
      authService.clearAuth();

      // Log the error for debugging
      console.error('Login error in AuthContext:', error);

      // Re-throw the structured error for the component to handle
      throw error;
    }
  };

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        // Always clear state regardless of server response
        setUserState(null);
        setTokenState(null);
        authService.clearAuth();
        navigate("/auth", { replace: true });
      }
    });
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUserState(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const setUser = (newUser: User) => {
    setUserState(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
  };

  const canAccess = (userType: 'ADMIN' | 'RESIDENT'): boolean => {
    if (!user) return false;

    if (userType === 'ADMIN') {
      return user.type === 'ADMIN';
    }

    return user.type === userType;
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.type === "ADMIN",
    isResident: user?.type === "RESIDENT",
    isLoading: !isInitialized || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    updateUser,
    setUser,
    canAccess,
  }), [user, token, isInitialized, loginMutation.isPending, logoutMutation.isPending]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};