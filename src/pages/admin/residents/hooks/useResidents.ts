import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { residentsApi } from '../services/residentsApi';
import {
  ResidentsFilters,
  CreateUserRequest,
  UpdateUserRequest,
  User
} from '../types/residents.types';

// Query keys
export const RESIDENTS_QUERY_KEYS = {
  residents: (params: ResidentsFilters) => ['residents', params],
  resident: (id: string) => ['residents', id],
  availableUnits: () => ['available-units'],
  stats: () => ['residents', 'stats'],
} as const;

// Hook to fetch paginated residents
export const useResidents = (params: ResidentsFilters, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: RESIDENTS_QUERY_KEYS.residents(params),
    queryFn: () => residentsApi.getResidents(params),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to fetch single resident
export const useResident = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: RESIDENTS_QUERY_KEYS.resident(id),
    queryFn: () => residentsApi.getResident(id),
    enabled: (options?.enabled ?? true) && !!id,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch available units
export const useAvailableUnits = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: RESIDENTS_QUERY_KEYS.availableUnits(),
    queryFn: () => residentsApi.getAvailableUnits(),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create resident
export const useCreateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => residentsApi.createResident(data),
    onSuccess: () => {
      // Invalidate and refetch residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      // Invalidate available units (may have changed)
      queryClient.invalidateQueries({ queryKey: ['available-units'] });
      toast.success('Resident created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to create resident');
    },
  });
};

// Hook to update resident
export const useUpdateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      residentsApi.updateResident(id, data),
    onSuccess: (updatedUser, { id }) => {
      // Update specific resident in cache
      queryClient.setQueryData(RESIDENTS_QUERY_KEYS.resident(id), updatedUser);
      // Invalidate residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      // Invalidate available units (may have changed)
      queryClient.invalidateQueries({ queryKey: ['available-units'] });
      toast.success('Resident updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to update resident');
    },
  });
};

// Hook to delete resident
export const useDeleteResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => residentsApi.deleteResident(id),
    onSuccess: () => {
      // Invalidate residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      // Invalidate available units (may have changed)
      queryClient.invalidateQueries({ queryKey: ['available-units'] });
      toast.success('Resident deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete resident');
    },
  });
};

// Hook to export residents
export const useExportResidents = () => {
  return useMutation({
    mutationFn: (params: ResidentsFilters) => residentsApi.exportResidents(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `residents_${date}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Residents exported successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to export residents');
    },
  });
};

// Hook to reset user password
export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: (id: string) => residentsApi.resetUserPassword(id),
    onSuccess: (data) => {
      toast.success(`Password reset successfully! Temporary password: ${data.temporaryPassword}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to reset password');
    },
  });
};

// Hook to block user
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blockedUntil }: { id: string; blockedUntil?: string }) =>
      residentsApi.blockUser(id, blockedUntil),
    onSuccess: (updatedUser, { id }) => {
      // Update specific resident in cache
      queryClient.setQueryData(RESIDENTS_QUERY_KEYS.resident(id), updatedUser);
      // Invalidate residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast.success('User blocked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to block user');
    },
  });
};

// Hook to unblock user
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => residentsApi.unblockUser(id),
    onSuccess: (updatedUser, id) => {
      // Update specific resident in cache
      queryClient.setQueryData(RESIDENTS_QUERY_KEYS.resident(id), updatedUser);
      // Invalidate residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast.success('User unblocked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to unblock user');
    },
  });
};

// Aliases for better readability
export const useBlockResident = useBlockUser;
export const useUnblockResident = useUnblockUser;

// Hook to download contract PDF
export const useDownloadContract = () => {
  return useMutation({
    mutationFn: (userId: string) => residentsApi.downloadContract(userId),
    onSuccess: (blob, userId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `contrato_${userId}_${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Contrato baixado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Falha ao baixar contrato');
    },
  });
};

// Hook to bulk update status
export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, status }: { userIds: string[]; status: User['status'] }) =>
      residentsApi.bulkUpdateStatus(userIds, status),
    onSuccess: () => {
      // Invalidate residents list
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast.success('Users status updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message || 'Failed to update users status');
    },
  });
};

// Hook for residents statistics
export const useResidentsStats = (filters?: Partial<ResidentsFilters>) => {
  return useQuery({
    queryKey: RESIDENTS_QUERY_KEYS.stats(),
    queryFn: async () => {
      // Get all residents to calculate stats
      const response = await residentsApi.getResidents({
        page: 1,
        limit: 1000, // Large limit to get most users for stats
        ...filters
      });

      const users = response.data || [];
      const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'ACTIVE').length,
        inactive: users.filter(u => u.status === 'INACTIVE').length,
        blocked: users.filter(u => u.status === 'BLOCKED').length,
        trash: users.filter(u => u.status === 'TRASH').length,
      };

      return stats;
    },
    staleTime: 60000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};