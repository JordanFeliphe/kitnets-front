import { useState, useEffect, useCallback } from 'react';
import { User, UserFilter, CreateUserForm, UserStatus, UserRole } from '@/app/shared/types';
import { userService } from '../services/userService';
import { useNotifications } from '@/app/shared/contexts/NotificationContext';
import { useUI } from '@/app/shared/contexts/UIContext';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;

  // CRUD operations
  fetchUsers: (filter?: UserFilter) => Promise<void>;
  createUser: (userData: CreateUserForm) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;

  // Bulk operations
  bulkUpdateStatus: (userIds: string[], status: UserStatus) => Promise<void>;

  // Search and filter
  searchUsers: (query: string) => Promise<void>;
  filterUsers: (filter: UserFilter) => void;
  clearFilters: () => void;

  // Utility functions
  getUsersByRole: (role: UserRole) => User[];
  getActiveUsers: () => User[];
  refreshUsers: () => Promise<void>;

  // Statistics
  userStats: {
    total: number;
    byRole: Record<UserRole, number>;
    byStatus: Record<UserStatus, number>;
    recentlyCreated: number;
  } | null;
  fetchUserStats: () => Promise<void>;
}

export const useUsers = (initialFilter?: UserFilter): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseUsersReturn['meta']>(null);
  const [currentFilter, setCurrentFilter] = useState<UserFilter>(initialFilter || {});
  const [userStats, setUserStats] = useState<UseUsersReturn['userStats']>(null);

  const { success, error: showError } = useNotifications();
  const { setComponentLoading } = useUI();

  const fetchUsers = useCallback(async (filter: UserFilter = currentFilter) => {
    setLoading(true);
    setError(null);
    setComponentLoading('users-table', { isLoading: true, message: 'Carregando usuários...' });

    try {
      const response = await userService.getUsers(filter);
      
      if (response.success) {
        setUsers(response.data);
        setMeta(response.meta || null);
        setCurrentFilter(filter);
      } else {
        setError(response.message);
        showError('Erro ao carregar usuários', response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao carregar usuários';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
      setComponentLoading('users-table', { isLoading: false });
    }
  }, [currentFilter, showError, setComponentLoading]);

  const createUser = useCallback(async (userData: CreateUserForm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.createUser(userData);
      
      if (response.success) {
        await fetchUsers(); // Refresh the list
        success('Usuário criado', `${response.data?.name} foi criado com sucesso`);
      } else {
        setError(response.message);
        showError('Erro ao criar usuário', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao criar usuário';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, success, showError]);

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.updateUser(id, userData);
      
      if (response.success) {
        setUsers(prevUsers =>
          prevUsers.map(user => user.id === id ? (response.data ?? user) : user)
        );
        success('Usuário atualizado', `${response.data?.name} foi atualizado com sucesso`);
      } else {
        setError(response.message);
        showError('Erro ao atualizar usuário', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao atualizar usuário';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const deleteUser = useCallback(async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await userService.deleteUser(id);
      
      if (response.success) {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
        success('Usuário excluído', `${user.name} foi excluído com sucesso`);
      } else {
        setError(response.message);
        showError('Erro ao excluir usuário', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao excluir usuário';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [users, success, showError]);

  const getUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);

  const bulkUpdateStatus = useCallback(async (userIds: string[], status: UserStatus) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.bulkUpdateStatus(userIds, status);
      
      if (response.success) {
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            userIds.includes(user.id) ? { ...user, status, updatedAt: new Date() } : user
          )
        );
        success('Status atualizado', `${response.data.length} usuários foram atualizados`);
      } else {
        setError(response.message);
        showError('Erro ao atualizar status', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao atualizar status';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchUsers({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userService.searchUsers(query);
      
      if (response.success) {
        setUsers(response.data);
        setMeta(null); // Search doesn't return pagination meta
      } else {
        setError(response.message);
        showError('Erro na busca', response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado na busca';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, showError]);

  const filterUsers = useCallback((filter: UserFilter) => {
    setCurrentFilter(filter);
    fetchUsers(filter);
  }, [fetchUsers]);

  const clearFilters = useCallback(() => {
    const emptyFilter: UserFilter = {};
    setCurrentFilter(emptyFilter);
    fetchUsers(emptyFilter);
  }, [fetchUsers]);

  const getUsersByRole = useCallback((role: UserRole) => {
    return users.filter(user => user.role === role);
  }, [users]);

  const getActiveUsers = useCallback(() => {
    return users.filter(user => user.status === 'ACTIVE');
  }, [users]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers(currentFilter);
  }, [fetchUsers, currentFilter]);

  const fetchUserStats = useCallback(async () => {
    try {
      const response = await userService.getUserStats();
      
      if (response.success) {
        setUserStats(response.data);
      } else {
        showError('Erro ao carregar estatísticas', response.message);
      }
    } catch (err) {
      showError('Erro', 'Erro inesperado ao carregar estatísticas');
    }
  }, [showError]);

  // Load users on mount
  useEffect(() => {
    fetchUsers(currentFilter);
  }, []); // Only run on mount

  // Load stats on mount
  useEffect(() => {
    fetchUserStats();
  }, []);

  return {
    users,
    loading,
    error,
    meta,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    bulkUpdateStatus,
    searchUsers,
    filterUsers,
    clearFilters,
    getUsersByRole,
    getActiveUsers,
    refreshUsers,
    userStats,
    fetchUserStats,
  };
};