import { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Edit,
  Trash2,
  User,
  Shield,
  UserCheck,
  Mail,
  Phone,
  AlertTriangle,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/app/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/shared/components/ui/card';
import { StandardTable } from '@/app/shared/components/ui/standard-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu';

// import { useUsers } from './hooks/useUsers';
import { useAuth } from '@/app/shared/contexts/AuthContext';
import { useNotifications } from '@/app/shared/contexts/NotificationContext';
import { useUI } from '@/app/shared/contexts/UIContext';

import { User as UserType } from '@/app/shared/types';
import { formatDate, formatPhone } from '@/app/shared/utils/businessRules';

export default function Users() {
  const { user: currentUser, isAdmin } = useAuth();
  const { success, error } = useNotifications();
  const { openModal } = useUI();

  // Mock data temporarily until backend is ready
  const users: UserType[] = [];
  const loading = false;
  const usersError = null;
  const fetchUsers = async () => {};
  const deleteUser = async (_id: string) => {};
  const userStats = {
    total: 0,
    byStatus: { ACTIVE: 0, INACTIVE: 0, BLOCKED: 0 },
    byRole: { ADMIN: 0, MANAGER: 0, RESIDENT: 0 },
    recentlyCreated: 0
  };

  // Permission checks - simplified for admin users
  const canCreateUsers = isAdmin;
  const canEditUsers = isAdmin;
  const canDeleteUsers = isAdmin;
  const canViewAllUsers = isAdmin;


  // Handle user actions
  const handleEditUser = (user: UserType) => {
    openModal('edit-user', { user });
  };

  const handleDeleteUser = async (user: UserType) => {
    if (window.confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
      try {
        await deleteUser(user.id);
        success('Usuário excluído', `${user.name} foi excluído com sucesso`);
      } catch (err) {
        error('Erro ao excluir usuário', 'Não foi possível excluir o usuário');
      }
    }
  };

  // Table columns definition
  const columns: ColumnDef<UserType>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Usuário',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || ''} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">
                {user.name}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Função',
      cell: ({ row }) => {
        const roleLabels = {
          ADMIN: 'Administrador',
          MANAGER: 'Gerente',
          RESIDENT: 'Morador'
        };
        const role = row.getValue('role') as string;
        return (
          <span className="text-foreground text-xs">
            {roleLabels[role as keyof typeof roleLabels] || role}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusLabels = {
          ACTIVE: 'Ativo',
          INACTIVE: 'Inativo',
          BLOCKED: 'Bloqueado'
        };
        const status = row.getValue('status') as string;
        return (
          <span className="text-foreground text-xs">
            {statusLabels[status as keyof typeof statusLabels] || status}
          </span>
        );
      },
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-foreground">{row.getValue('cpf')}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-foreground">{formatPhone(row.getValue('phone'))}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue('createdAt'))}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Copiar email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.phone)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Copiar telefone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {canEditUsers && (
                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {canDeleteUsers && user.id !== currentUser?.id && (
                <DropdownMenuItem
                  onClick={() => handleDeleteUser(user)}
                  className="text-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!canViewAllUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Acesso restrito
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Você não tem permissão para visualizar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, funções e permissões do sistema
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {canCreateUsers && (
            <Button onClick={() => openModal('create-user')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userStats.total}</div>
              <p className="text-xs text-muted-foreground">
                +{userStats.recentlyCreated} nos últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userStats.byStatus.ACTIVE}</div>
              <p className="text-xs text-muted-foreground">
                {((userStats.byStatus.ACTIVE / userStats.total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userStats.byRole.ADMIN}</div>
              <p className="text-xs text-muted-foreground">
                Usuários com acesso total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moradores</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userStats.byRole.RESIDENT}</div>
              <p className="text-xs text-muted-foreground">
                Usuários residentes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <StandardTable
        columns={columns}
        data={users}
        loading={loading}
        searchPlaceholder="Buscar por nome, email, CPF ou telefone..."
        searchKey="name"
        filterOptions={[
          {
            label: 'Filtrar por status',
            value: 'ACTIVE,INACTIVE,BLOCKED',
            key: 'status'
          },
          {
            label: 'Filtrar por função',
            value: 'ADMIN,MANAGER,RESIDENT',
            key: 'role'
          }
        ]}
        onAdd={canCreateUsers ? () => openModal('create-user') : undefined}
        addButtonLabel="Novo Usuário"
        enableSelection={true}
        getCardTitle={(user) => user.name}
        getCardSubtitle={(user) => user.email}
        getCardFields={(user) => {
          const roleLabels = {
            ADMIN: 'Administrador',
            MANAGER: 'Gerente',
            RESIDENT: 'Morador'
          };
          const statusLabels = {
            ACTIVE: 'Ativo',
            INACTIVE: 'Inativo',
            BLOCKED: 'Bloqueado'
          };
          return [
            { label: 'Função', value: roleLabels[user.role as keyof typeof roleLabels] || user.role },
            { label: 'Status', value: statusLabels[user.status as keyof typeof statusLabels] || user.status },
            { label: 'CPF', value: user.cpf },
            { label: 'Telefone', value: formatPhone(user.phone) },
            { label: 'Criado em', value: formatDate(user.createdAt) }
          ];
        }}
        getCardActions={(user) => [
          {
            label: 'Copiar email',
            onClick: () => navigator.clipboard.writeText(user.email)
          },
          {
            label: 'Copiar telefone',
            onClick: () => navigator.clipboard.writeText(user.phone)
          },
          ...(canEditUsers ? [{
            label: 'Editar',
            onClick: () => handleEditUser(user)
          }] : []),
          ...(canDeleteUsers && user.id !== currentUser?.id ? [{
            label: 'Excluir',
            onClick: () => handleDeleteUser(user),
            variant: 'destructive' as const
          }] : [])
        ]}
        emptyMessage="Nenhum usuário cadastrado ainda."
      />

      {/* Error Display */}
      {usersError && (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-foreground">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Erro ao carregar usuários</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{usersError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers()}
              className="mt-3"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}