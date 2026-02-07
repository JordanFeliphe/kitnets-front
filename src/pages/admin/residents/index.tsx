import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/app/shared/components/ui/breadcrumb';
import { Card, CardContent } from '@/app/shared/components/ui/card';
import { Button } from '@/app/shared/components/ui/button';
import { Input } from '@/app/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/shared/components/ui/select';
import { Badge } from '@/app/shared/components/ui/badge';
import { Skeleton } from '@/app/shared/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/shared/components/ui/alert-dialog';
import { StandardTable } from '@/app/shared/components/ui/standard-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserMinus,
  UserPlus,
  Download,
  Building,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu';
import CreateResidentModal from './components/CreateResidentModal';
import { useResidents, useDeleteResident, useResidentsStats, useBlockResident, useUnblockResident, useDownloadContract } from './hooks/useResidents';
import { ResidentsFilters as FiltersType, User } from './types/residents.types';
import { formatters } from '@/app/shared/utils/formatters';

const ResidentsPage: React.FC = () => {
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    limit: 20,
    search: '',
    status: '',
  });

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Alert dialogs state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [unblockingUser, setUnblockingUser] = useState<User | null>(null);

  // Queries
  const {
    data: residentsData,
    isLoading: residentsLoading,
    isError: residentsError,
    error: residentsErrorData,
    refetch: refetchResidents,
  } = useResidents(filters);

  const { data: statsData, isLoading: statsLoading } = useResidentsStats();

  // Mutations
  const deleteMutation = useDeleteResident();
  const blockMutation = useBlockResident();
  const unblockMutation = useUnblockResident();
  const downloadContractMutation = useDownloadContract();

  // Status badge component
  const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
    const variants = {
      ACTIVE: { variant: 'default' as const, label: 'Ativo', className: 'bg-green-100 text-green-800' },
      INACTIVE: { variant: 'secondary' as const, label: 'Inativo', className: 'bg-gray-100 text-gray-800' },
      BLOCKED: { variant: 'destructive' as const, label: 'Bloqueado', className: 'bg-red-100 text-red-800' },
      TRASH: { variant: 'outline' as const, label: 'Excluído', className: 'bg-gray-100 text-gray-800' },
    };

    const config = variants[status] || variants.INACTIVE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
      cell: ({ row }) => formatters.cpf(row.original.cpf),
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }) => formatters.phone(row.original.phone),
    },
    {
      accessorKey: 'contract',
      header: 'Unidade/Contrato',
      cell: ({ row }) => {
        const contract = row.original.contract;
        if (!contract || !contract.unit) {
          return <span className="text-muted-foreground">Sem unidade</span>;
        }
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span className="font-medium">{contract.unit.code}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              R$ {formatters.currency(contract.rentAmount)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Cadastrado em',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatters.date(row.original.createdAt)}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const user = row.original;
        const canBlock = user.status === 'ACTIVE';
        const canUnblock = user.status === 'BLOCKED';
        const canEdit = user.status !== 'TRASH';
        const canDelete = user.status !== 'TRASH';
        const hasContract = !!user.contract;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={() => handleEdit(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {hasContract && (
                <DropdownMenuItem onClick={() => handleDownloadContract(user)}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Contrato
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {canBlock && (
                <DropdownMenuItem
                  onClick={() => handleBlock(user)}
                  className="text-orange-600"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Bloquear
                </DropdownMenuItem>
              )}
              {canUnblock && (
                <DropdownMenuItem
                  onClick={() => handleUnblock(user)}
                  className="text-green-600"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Desbloquear
                </DropdownMenuItem>
              )}
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(user)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];


  // Handlers
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
  };

  const handleBlock = (user: User) => {
    setBlockingUser(user);
  };

  const handleUnblock = (user: User) => {
    setUnblockingUser(user);
  };

  const handleDownloadContract = async (user: User) => {
    if (!user.contract) return;

    try {
      await downloadContractMutation.mutateAsync(user._id);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    try {
      await deleteMutation.mutateAsync(deletingUser._id);
      setDeletingUser(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const confirmBlock = async () => {
    if (!blockingUser) return;

    try {
      await blockMutation.mutateAsync({
        id: blockingUser._id,
      });
      setBlockingUser(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const confirmUnblock = async () => {
    if (!unblockingUser) return;

    try {
      await unblockMutation.mutateAsync(unblockingUser._id);
      setUnblockingUser(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value === 'all' ? '' : value, page: 1 }));
  };

  const handleRefresh = () => {
    refetchResidents();
  };

  // Error state
  if (residentsError) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Residents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-xl font-semibold text-red-600">Error Loading Residents</h2>
            <p className="text-muted-foreground">
              {(residentsErrorData as any)?.message || 'Unable to connect to the server. Please try again.'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gerenciar Usuários</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">
            {(residentsData as any)?.pagination?.totalItems || 0} usuários cadastrados
          </p>
        </div>
        <Button onClick={handleCreate} className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{statsData?.total || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                    <p className="text-2xl font-bold text-green-600">{statsData?.active || 0}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                    <p className="text-2xl font-bold text-gray-600">{statsData?.inactive || 0}</p>
                  </div>
                  <UserX className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Bloqueados</p>
                    <p className="text-2xl font-bold text-red-600">{statsData?.blocked || 0}</p>
                  </div>
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ACTIVE">Ativos</SelectItem>
                  <SelectItem value="INACTIVE">Inativos</SelectItem>
                  <SelectItem value="BLOCKED">Bloqueados</SelectItem>
                  <SelectItem value="TRASH">Excluídos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residents Table */}
      <StandardTable
        columns={columns}
        data={(residentsData as any)?.data || []}
        loading={residentsLoading}
        searchPlaceholder="Buscar por nome, email ou CPF..."
        searchKey="name"
        filterOptions={[
          {
            label: 'Filtrar por status',
            value: 'ACTIVE,INACTIVE,BLOCKED,TRASH',
            key: 'status'
          }
        ]}
        onAdd={handleCreate}
        addButtonLabel="Novo Usuário"
        enableSelection={false}
        getCardTitle={(user) => user.name}
        getCardSubtitle={(user) => user.email}
        getCardFields={(user) => [
          { label: 'CPF', value: user.cpf },
          { label: 'Telefone', value: user.phone },
          { label: 'Status', value: user.status === 'ACTIVE' ? 'Ativo' :
                                     user.status === 'INACTIVE' ? 'Inativo' :
                                     user.status === 'BLOCKED' ? 'Bloqueado' : 'Excluído',
            type: 'status' },
          { label: 'Unidade', value: (user as any).unit || '-' },
          { label: 'Contrato', value: user.contract ? 'Sim' : 'Não' },
          { label: 'Criado em', value: new Date(user.createdAt).toLocaleDateString('pt-BR'), type: 'date' }
        ]}
        getCardActions={(user) => [
          {
            label: 'Editar',
            onClick: () => handleEdit(user)
          },
          {
            label: user.status === 'BLOCKED' ? 'Desbloquear' : 'Bloquear',
            onClick: () => user.status === 'BLOCKED' ? handleUnblock(user) : handleBlock(user),
            variant: user.status === 'BLOCKED' ? 'default' : 'destructive'
          },
          {
            label: 'Excluir',
            onClick: () => handleDelete(user),
            variant: 'destructive'
          }
        ]}
        emptyMessage="Nenhum usuário encontrado."
      />

      {/* Create/Edit Modal */}
      <CreateResidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <CreateResidentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        editingUser={editingUser}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o usuário <strong>{deletingUser?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Confirmation */}
      <AlertDialog open={!!blockingUser} onOpenChange={() => setBlockingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Bloqueio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja bloquear o usuário <strong>{blockingUser?.name}</strong>?
              O usuário não poderá mais acessar o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlock}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={blockMutation.isPending}
            >
              {blockMutation.isPending ? 'Bloqueando...' : 'Bloquear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Confirmation */}
      <AlertDialog open={!!unblockingUser} onOpenChange={() => setUnblockingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desbloqueio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja desbloquear o usuário <strong>{unblockingUser?.name}</strong>?
              O usuário poderá acessar o sistema novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnblock}
              className="bg-green-600 hover:bg-green-700"
              disabled={unblockMutation.isPending}
            >
              {unblockMutation.isPending ? 'Desbloqueando...' : 'Desbloquear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResidentsPage;