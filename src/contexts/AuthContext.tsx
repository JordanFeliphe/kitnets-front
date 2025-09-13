import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserRole, Permission } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; permissions: Permission[] } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'REFRESH_PERMISSIONS'; payload: Permission[] };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        permissions: action.payload.permissions,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        permissions: [],
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        permissions: [],
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'REFRESH_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccess: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock permissions for each role
const getRolePermissions = (role: UserRole): Permission[] => {
  const basePermissions: Permission[] = [
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
  ];

  const rolePermissions: Record<UserRole, Permission[]> = {
    ADMIN: [
      ...basePermissions,
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: '*' },
      { resource: 'units', action: '*' },
      { resource: 'leases', action: '*' },
      { resource: 'transactions', action: '*' },
      { resource: 'reports', action: '*' },
      { resource: 'settings', action: '*' },
      { resource: 'system', action: '*' },
      { resource: 'permissions', action: '*' },
      { resource: 'audit', action: 'read' },
    ],
    MANAGER: [
      ...basePermissions,
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'create', conditions: { role: ['RESIDENT'] } },
      { resource: 'units', action: '*' },
      { resource: 'leases', action: '*' },
      { resource: 'transactions', action: '*' },
      { resource: 'reports', action: 'read' },
    ],
    RESIDENT: [
      ...basePermissions,
      { resource: 'dashboard', action: 'read' },
      { resource: 'lease', action: 'read', conditions: { own: true } },
      { resource: 'transactions', action: 'read', conditions: { own: true } },
      { resource: 'payments', action: 'create', conditions: { own: true } },
    ],
  };

  return rolePermissions[role] || [];
};

// Mock login function
const mockLogin = async (email: string, password: string): Promise<{ user: User; permissions: Permission[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === 'admin@residencialrubim.com' && password === '123456') {
    const user: User = {
      id: '1',
      email: 'admin@residencialrubim.com',
      name: 'Administrador Sistema',
      cpf: '123.456.789-00',
      phone: '(85) 99999-9999',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'system',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    };
    return { user, permissions: getRolePermissions(user.role) };
  }

  if (email === 'manager@residencialrubim.com' && password === '123456') {
    const user: User = {
      id: '2',
      email: 'manager@residencialrubim.com',
      name: 'João Silva',
      cpf: '987.654.321-00',
      phone: '(85) 98888-8888',
      role: 'MANAGER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: {
          email: true,
          push: true,
          sms: true,
        },
      },
    };
    return { user, permissions: getRolePermissions(user.role) };
  }

  if (email === 'resident@residencialrubim.com' && password === '123456') {
    const user: User = {
      id: '3',
      email: 'resident@residencialrubim.com',
      name: 'Maria Santos',
      cpf: '456.789.123-00',
      phone: '(85) 97777-7777',
      role: 'RESIDENT',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: {
          email: true,
          push: false,
          sms: true,
        },
      },
    };
    return { user, permissions: getRolePermissions(user.role) };
  }

  throw new Error('Credenciais inválidas');
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          const user: User = JSON.parse(savedUser);
          const permissions = getRolePermissions(user.role);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, permissions },
          });
        } else {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user, permissions } = await mockLogin(email, password);
      localStorage.setItem('auth_user', JSON.stringify(user));
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, permissions },
      });
    } catch (error) {
      localStorage.removeItem('auth_user');
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: data });
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!state.isAuthenticated || !state.user) return false;

    return state.permissions.some(permission => {
      const resourceMatch = permission.resource === resource || permission.resource === '*';
      const actionMatch = permission.action === action || permission.action === '*';
      return resourceMatch && actionMatch;
    });
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const canAccess = (roles: UserRole[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};