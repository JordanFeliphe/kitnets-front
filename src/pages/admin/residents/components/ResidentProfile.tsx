import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Home, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { Badge } from '@/app/shared/components/ui/badge';
import { useResident } from '../hooks/useResidents';

export default function ResidentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resident, isLoading, error } = useResident(id!, { enabled: !!id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar perfil do morador</p>
          <Button onClick={() => navigate('/admin/residents')}>
            Voltar para Moradores
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>;
      case 'BLOCKED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Bloqueado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/residents')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Perfil do Morador</h1>
          <p className="text-muted-foreground">
            Visualizar informações detalhadas do morador
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Informações Pessoais
                {getStatusBadge(resident.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="text-lg font-medium">{resident.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CPF</label>
                  <p className="text-lg">{resident.cpf}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                    <p className="text-lg">{resident.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="text-lg">{resident.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Unidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informações da Unidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma unidade atribuída
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Atribua uma unidade para este morador
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Ações e Informações Adicionais */}
        <div className="space-y-6">
          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/admin/residents/${id}/payments`)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Histórico de Pagamentos
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/admin/residents/${id}/documents`)}
              >
                📄 Documentos
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/admin/residents/${id}/edit`)}
              >
                ✏️ Editar Dados
              </Button>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cadastrado em</label>
                <p className="text-sm">
                  {new Date(resident.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {resident.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                  <p className="text-sm">
                    {new Date(resident.updatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de usuário</label>
                <p className="text-sm capitalize">{resident.type?.toLowerCase()}</p>
              </div>
              {resident.requirePasswordReset && (
                <div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Redefinição de senha pendente
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}