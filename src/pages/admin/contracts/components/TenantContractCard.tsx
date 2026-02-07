import React from 'react';
import { useDownloadTenantContract } from '../hooks/useContracts';
import { Download } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TenantContractCardProps {
  contract: {
    _id: string;
    contractNumber: string;
    startDate: string;
    endDate?: string;
    rentAmount: number;
    status: 'ACTIVE' | 'ENDED' | 'SUSPENDED';
    unit: {
      code: string;
    };
  };
}

export const TenantContractCard: React.FC<TenantContractCardProps> = ({ contract }) => {
  const downloadMutation = useDownloadTenantContract();

  const handleDownload = () => {
    downloadMutation.mutate({ contractId: contract._id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'ENDED': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'ENDED': return 'Encerrado';
      case 'SUSPENDED': return 'Suspenso';
      default: return status;
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Contrato {contract.contractNumber}
          </h3>
          <p className="text-gray-600">Unidade {contract.unit.code}</p>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
          {getStatusText(contract.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Valor mensal:</span>
          <span className="font-medium">
            R$ {contract.rentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Início do contrato:</span>
          <span>{format(new Date(contract.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
        {contract.endDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Término do contrato:</span>
            <span>{format(new Date(contract.endDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        )}
      </div>

      <Button
        onClick={handleDownload}
        disabled={downloadMutation.isPending}
        className="w-full"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        {downloadMutation.isPending ? 'Baixando...' : 'Download do Contrato PDF'}
      </Button>
    </div>
  );
};