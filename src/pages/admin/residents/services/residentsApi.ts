import api from '@/app/shared/services/api';
import {
  ResidentsFilters,
  ResidentsResponse,
  AvailableUnitsResponse,
  CreateUserRequest,
  UpdateUserRequest,
  User
} from '../types/residents.types';

export const residentsApi = {
  // Get paginated residents
  getResidents: async (params: ResidentsFilters): Promise<ResidentsResponse> => {
    const searchParams = new URLSearchParams();

    searchParams.append('page', params.page.toString());
    searchParams.append('limit', params.limit.toString());

    if (params.search) {
      searchParams.append('search', params.search);
    }

    if (params.status) {
      searchParams.append('status', params.status);
    }

    const response = await api.get(`/users?${searchParams.toString()}`);

    // If response.data is already in the expected format, return it
    if (response.data && response.data.data && response.data.pagination) {
      return response.data;
    }

    // If response.data is an array (current API format), transform it
    const users = Array.isArray(response.data) ? response.data : [];
    return {
      data: users,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(users.length / params.limit),
        totalItems: users.length,
        itemsPerPage: params.limit,
      }
    };
  },

  // Get single resident by ID
  getResident: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create new resident
  createResident: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update resident
  updateResident: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete resident
  deleteResident: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Get available units for select
  getAvailableUnits: async (): Promise<AvailableUnitsResponse> => {
    const response = await api.get('/units/available');

    // If response.data is already in the expected format, return it
    if (response.data && response.data.data) {
      return response.data;
    }

    // If response.data is an array (current API format), transform it
    const units = Array.isArray(response.data) ? response.data : [];

    // Transform units to match our expected structure
    const transformedUnits = units.map(unit => ({
      _id: unit._id,
      number: unit.code || unit.number || 'N/A',
      block: 'A', // Default block since API doesn't provide this
      floor: 1, // Default floor since API doesn't provide this
      type: 'HOUSE' as const, // Assuming houses for kitnetes
      bedrooms: 1, // Default since API doesn't provide this
      bathrooms: 1, // Default since API doesn't provide this
      area: 50, // Default since API doesn't provide this
      isAvailable: unit.status === 'AVAILABLE',
      rentValue: unit.rentDefaultAmount || 0,
    }));

    return {
      data: transformedUnits
    };
  },

  // Bulk operations
  bulkUpdateStatus: async (userIds: string[], status: User['status']): Promise<void> => {
    await api.patch('/users/bulk-status', { userIds, status });
  },

  // Export residents to CSV
  exportResidents: async (params: ResidentsFilters): Promise<Blob> => {
    const searchParams = new URLSearchParams();

    searchParams.append('format', 'csv');
    searchParams.append('page', params.page.toString());
    searchParams.append('limit', params.limit.toString());

    if (params.search) {
      searchParams.append('search', params.search);
    }

    if (params.status) {
      searchParams.append('status', params.status);
    }

    const response = await api.get(`/users/export?${searchParams.toString()}`, {
      responseType: 'blob'
    });

    return response.data;
  },

  // Reset password
  resetUserPassword: async (id: string): Promise<{ temporaryPassword: string }> => {
    const response = await api.post(`/users/${id}/reset-password`);
    return response.data;
  },

  // Block/Unblock user
  blockUser: async (id: string, blockedUntil?: string): Promise<User> => {
    const response = await api.patch(`/users/${id}/block`, { blockedUntil });
    return response.data;
  },

  unblockUser: async (id: string): Promise<User> => {
    const response = await api.patch(`/users/${id}/unblock`);
    return response.data;
  },

  // Download contract PDF
  downloadContract: async (userId: string): Promise<Blob> => {
    const response = await api.get(`/users/${userId}/contract/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default residentsApi;