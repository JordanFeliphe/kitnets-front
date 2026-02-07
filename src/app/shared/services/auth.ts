import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'ADMIN' | 'RESIDENT';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const data: LoginResponse = response.data;

      // Save to sessionStorage
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      // Propagate the structured error from the interceptor
      console.error('Login error in authService:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  },

  getCurrentUser(): User | null {
    const userString = sessionStorage.getItem(USER_KEY);
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  clearAuth(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
};

// TanStack Query mutation hook for login
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      // Invalidate and refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      authService.clearAuth();
    }
  });
}

// TanStack Query mutation hook for logout
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Still clear auth even if server logout fails
      authService.clearAuth();
    }
  });
}