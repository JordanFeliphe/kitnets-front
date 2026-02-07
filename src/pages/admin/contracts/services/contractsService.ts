const apiUrl = import.meta.env.VITE_API_URL;

// Tipos para as respostas
export interface ContractTenant {
  _id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

export interface ContractUnit {
  _id: string;
  code: string;
}

export interface AdminContract {
  _id: string;
  contractNumber: string;
  tenant: ContractTenant;
  unit: ContractUnit;
  startDate: string;
  endDate?: string;
  rentAmount: number;
  status: 'ACTIVE' | 'ENDED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface ContractFilters {
  status?: 'ACTIVE' | 'ENDED' | 'SUSPENDED';
  unitId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Função para listar contratos (admin)
export const fetchAdminContracts = async (
  token: string,
  filters?: ContractFilters
): Promise<{data: AdminContract[], pagination?: any}> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.unitId) params.append('unitId', filters.unitId);
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`${apiUrl}/contracts/admin?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch admin contracts');
  return response.json();
};

// Função para download de contrato (morador)
export const downloadTenantContract = async (
  contractId: string,
  token: string
): Promise<Blob> => {
  const response = await fetch(`${apiUrl}/contracts/${contractId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Você não tem permissão para baixar este contrato');
    }
    if (response.status === 404) {
      throw new Error('Contrato ou arquivo PDF não encontrado');
    }
    throw new Error('Erro ao baixar contrato');
  }

  return response.blob();
};

// Função para download de contrato (admin)
export const downloadAdminContract = async (
  contractId: string,
  token: string
): Promise<Blob> => {
  const response = await fetch(`${apiUrl}/contracts/admin/${contractId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Contrato ou arquivo PDF não encontrado');
    }
    throw new Error('Erro ao baixar contrato');
  }

  return response.blob();
};

// Função utilitária para fazer download do blob
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};