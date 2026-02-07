const apiUrl = import.meta.env.VITE_API_URL;

// Types for the responses
export interface PublicUnit {
  _id: string;
  code: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  rentDefaultAmount: number;
  notes: string;
}

export interface AdminUnit extends PublicUnit {
  address: string;
  createdAt: string;
  updatedAt: string;
  contract?: {
    _id: string;
    startDate: string;
    endDate?: string;
    rentAmount: number;
    status: string;
  };
  tenant?: {
    _id: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
}

// Service object used by useUnits hook
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unitService: Record<string, (...args: any[]) => Promise<any>> = {
  getUnits: async (filter?: any) => {
    const params = new URLSearchParams();
    if (filter?.page) params.append('page', filter.page.toString());
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.status) params.append('status', filter.status);
    const response = await fetch(`${apiUrl}/units?${params}`);
    if (!response.ok) return { success: false, message: 'Failed to fetch units' };
    const data = await response.json();
    return { success: true, data: Array.isArray(data) ? data : data.data || [] };
  },
  createUnit: async (unitData: any) => {
    const response = await fetch(`${apiUrl}/units`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unitData),
    });
    if (!response.ok) return { success: false, message: 'Failed to create unit' };
    return { success: true, data: await response.json() };
  },
  updateUnit: async (id: string, unitData: any) => {
    const response = await fetch(`${apiUrl}/units/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unitData),
    });
    if (!response.ok) return { success: false, message: 'Failed to update unit' };
    return { success: true, data: await response.json() };
  },
  deleteUnit: async (id: string) => {
    const response = await fetch(`${apiUrl}/units/${id}`, { method: 'DELETE' });
    if (!response.ok) return { success: false, message: 'Failed to delete unit' };
    return { success: true };
  },
  getUnitByCode: async (code: string) => {
    const response = await fetch(`${apiUrl}/units/code/${code}`);
    if (!response.ok) return { success: false, message: 'Unit not found' };
    return { success: true, data: await response.json() };
  },
  bulkUpdateStatus: async (unitIds: string[], status: string) => {
    const response = await fetch(`${apiUrl}/units/bulk-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitIds, status }),
    });
    if (!response.ok) return { success: false, message: 'Failed to update status' };
    return { success: true, data: await response.json() };
  },
  searchUnits: async (query: string) => {
    const response = await fetch(`${apiUrl}/units/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return { success: false, message: 'Search failed' };
    const data = await response.json();
    return { success: true, data: Array.isArray(data) ? data : data.data || [] };
  },
  addUnitImage: async (unitId: string, imageUrl: string) => {
    const response = await fetch(`${apiUrl}/units/${unitId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });
    if (!response.ok) return { success: false, message: 'Failed to add image' };
    return { success: true, data: await response.json() };
  },
  removeUnitImage: async (unitId: string, imageUrl: string) => {
    const response = await fetch(`${apiUrl}/units/${unitId}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });
    if (!response.ok) return { success: false, message: 'Failed to remove image' };
    return { success: true, data: await response.json() };
  },
  getUnitStats: async () => {
    const response = await fetch(`${apiUrl}/units/stats`);
    if (!response.ok) return { success: false, message: 'Failed to fetch stats' };
    return { success: true, data: await response.json() };
  },
};

// Function for public units (no auth)
export const fetchPublicUnits = async (page?: number, limit?: number): Promise<PublicUnit[]> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(`${apiUrl}/units?${params}`);
  if (!response.ok) throw new Error('Failed to fetch public units');
  return response.json();
};

// Function for admin units (with auth + ADMIN role)
export const fetchAdminUnits = async (
  token: string,
  page?: number,
  limit?: number
): Promise<AdminUnit[]> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(`${apiUrl}/units/admin?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch admin units');
  return response.json();
};