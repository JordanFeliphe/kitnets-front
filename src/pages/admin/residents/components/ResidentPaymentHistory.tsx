import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Download, Filter } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { Badge } from '@/app/shared/components/ui/badge';
import { Input } from '@/app/shared/components/ui/input';
import { Label } from '@/app/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/ui/select';
import { useResident } from '../hooks/useResidents';

// Mock data para demonstração
const mockPayments = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Aluguel - Janeiro 2024',
    amount: 1200.00,
    status: 'paid',
    dueDate: '2024-01-05',
    paymentMethod: 'PIX',
    reference: 'ALG-2024-01'
  },
  {
    id: '2',
    date: '2024-02-12',
    description: 'Aluguel - Fevereiro 2024',
    amount: 1200.00,
    status: 'paid',
    dueDate: '2024-02-05',
    paymentMethod: 'Boleto',
    reference: 'ALG-2024-02'
  },
  {
    id: '3',
    date: null,
    description: 'Aluguel - Março 2024',
    amount: 1200.00,
    status: 'pending',
    dueDate: '2024-03-05',
    paymentMethod: null,
    reference: 'ALG-2024-03'
  },
  {
    id: '4',
    date: null,
    description: 'Aluguel - Abril 2024',
    amount: 1200.00,
    status: 'overdue',
    dueDate: '2024-04-05',
    paymentMethod: null,
    reference: 'ALG-2024-04'
  }
];

export default function ResidentPaymentHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resident, isLoading } = useResident(id!, { enabled: !!id });

  const [filteredPayments] = useState(mockPayments);
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vencido</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Desconhecido</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const calculateSummary = () => {
    const total = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paid = filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const pending = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
    const overdue = filteredPayments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);

    return { total, paid, pending, overdue };
  };

  const summary = calculateSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/residents/${id}`)}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Histórico de Pagamentos</h1>
          {resident && (
            <p className="text-muted-foreground">
              {resident.name} • {resident.email}
            </p>
          )}
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{formatCurrency(summary.total)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pago</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(summary.paid)}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-lg font-semibold text-yellow-600">{formatCurrency(summary.pending)}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-3 w-3 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vencido</p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(summary.overdue)}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{payment.description}</h4>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                    <span>Vencimento: {formatDate(payment.dueDate)}</span>
                    {payment.date && <span>• Pago em: {formatDate(payment.date)}</span>}
                    {payment.paymentMethod && <span>• {payment.paymentMethod}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                  <span className="text-lg font-semibold">{formatCurrency(payment.amount)}</span>
                  {payment.status === 'paid' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Comprovante
                    </Button>
                  )}
                  {payment.status === 'pending' && (
                    <Button size="sm">
                      Pagar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}