import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchAdminContracts,
  downloadTenantContract,
  downloadAdminContract,
  downloadBlob,
  ContractFilters
} from '../services/contractsService';
import { useAuth } from '@/app/shared/contexts/AuthContext';
import { useNotifications } from '@/app/shared/contexts/NotificationContext';

export const useAdminContracts = (filters?: ContractFilters) => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['contracts', 'admin', filters],
    queryFn: () => fetchAdminContracts(token!, filters),
    enabled: !!token && user?.type === 'ADMIN',
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useDownloadTenantContract = () => {
  const { token } = useAuth();
  const { success, error } = useNotifications();

  return useMutation({
    mutationFn: ({ contractId }: { contractId: string }) =>
      downloadTenantContract(contractId, token!),
    onSuccess: (blob, { contractId }) => {
      downloadBlob(blob, `contrato-${contractId}.pdf`);
      success('Download completo', 'Contrato baixado com sucesso!');
    },
    onError: (err: Error) => {
      error('Erro no download', err.message);
    },
  });
};

export const useDownloadAdminContract = () => {
  const { token } = useAuth();
  const { success, error } = useNotifications();

  return useMutation({
    mutationFn: ({ contractId }: { contractId: string }) =>
      downloadAdminContract(contractId, token!),
    onSuccess: (blob, { contractId }) => {
      downloadBlob(blob, `contrato-${contractId}.pdf`);
      success('Download completo', 'Contrato baixado com sucesso!');
    },
    onError: (err: Error) => {
      error('Erro no download', err.message);
    },
  });
};