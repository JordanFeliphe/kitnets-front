import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit,
  Trash2,
  User,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { 
  UserStatusBadge, 
  UserRoleBadge 
} from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useUI } from '@/contexts/UIContext';

import { User as UserType, UserFilter } from '@/types';
import { formatDate, formatPhone } from '@/utils/businessRules';

export default function Users() {
  const { user: currentUser, hasPermission } = useAuth();
  const { success, error } = useNotifications();
  const { openModal } = useUI();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState<UserFilter>({});

  const {
    users,
    loading,
    error: usersError,
    meta,
    fetchUsers,
    deleteUser,
    bulkUpdateStatus,
    userStats,
  } = useUsers();

  // Permission checks
  const canCreateUsers = hasPermission('users', 'create');
  const canEditUsers = hasPermission('users', 'update');
  const canDeleteUsers = hasPermission('users', 'delete');
  const canViewAllUsers = hasPermission('users', 'read');

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.cpf.includes(searchLower) ||
      user.phone.includes(searchLower)
    );
  }, [users, searchTerm]);

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

  const handleBulkStatusUpdate = async (status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') => {
    if (selectedUsers.length === 0) return;
    
    const userIds = selectedUsers.map(u => u.id);
    const statusText = {
      ACTIVE: 'ativar',
      INACTIVE: 'desativar',
      BLOCKED: 'bloquear',
    }[status];
    
    if (window.confirm(`Tem certeza que deseja ${statusText} ${selectedUsers.length} usuário(s)?`)) {
      try {
        await bulkUpdateStatus(userIds, status);
        setSelectedUsers([]);
        success('Status atualizado', `${selectedUsers.length} usuário(s) foram atualizados`);
      } catch (err) {
        error('Erro ao atualizar status', 'Não foi possível atualizar o status dos usuários');
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
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
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
      cell: ({ row }) => (
        <UserRoleBadge status={row.getValue('role')} size="sm" />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <UserStatusBadge status={row.getValue('status')} size="sm" />
      ),
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('cpf')}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{formatPhone(row.getValue('phone'))}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="text-red-600 focus:text-red-600"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, funções e permissões do sistema
          </p>
        </div>
        
        {canCreateUsers && (
          <Button onClick={() => openModal('create-user')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
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
              <div className="text-2xl font-bold">{userStats.total}</div>
              <p className="text-xs text-muted-foreground">
                +{userStats.recentlyCreated} nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userStats.byStatus.ACTIVE}</div>
              <p className="text-xs text-muted-foreground">
                {((userStats.byStatus.ACTIVE / userStats.total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.byRole.ADMIN}</div>
              <p className="text-xs text-muted-foreground">
                Usuários com acesso total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moradores</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.byRole.RESIDENT}</div>
              <p className="text-xs text-muted-foreground">
                Usuários residentes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por nome, email, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border">
          <span className="text-sm font-medium">
            {selectedUsers.length} usuário(s) selecionado(s)
          </span>
          <div className="flex items-center space-x-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('ACTIVE')}
              disabled={!canEditUsers}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Ativar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('INACTIVE')}
              disabled={!canEditUsers}
            >
              <UserX className="mr-2 h-4 w-4" />
              Desativar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('BLOCKED')}
              disabled={!canEditUsers}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Shield className="mr-2 h-4 w-4" />
              Bloquear
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
            {searchTerm && ` para "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredUsers}
            loading={loading}
            searchable={false} // We handle search manually
            selectable={true}
            onRowSelect={setSelectedUsers}
            exportable={true}
            refreshable={true}
            onRefresh={() => fetchUsers()}
            emptyMessage={
              searchTerm 
                ? "Nenhum usuário encontrado para sua busca."
                : "Nenhum usuário cadastrado ainda."
            }
            pageSize={20}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* Error Display */}
      {usersError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Erro ao carregar usuários</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{usersError}</p>
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