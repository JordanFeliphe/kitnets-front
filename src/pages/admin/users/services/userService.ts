import { User, UserFilter, ApiResponse, CreateUserForm, UserRole, UserStatus } from '@/app/shared/types';
import { isValidCPF, isValidPhone, isValidEmail } from '@/app/shared/utils/businessRules';

class UserService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@residencialrubim.com',
      name: 'Administrador Sistema',
      cpf: '123.456.789-00',
      phone: '(85) 99999-9999',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'system',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: { email: true, push: true, sms: false },
      },
    },
    {
      id: '2',
      email: 'manager@residencialrubim.com',
      name: 'João Silva',
      cpf: '987.654.321-00',
      phone: '(85) 98888-8888',
      role: 'MANAGER',
      status: 'ACTIVE',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: { email: true, push: true, sms: true },
      },
    },
    {
      id: '3',
      email: 'maria.santos@email.com',
      name: 'Maria Santos',
      cpf: '456.789.123-00',
      phone: '(85) 97777-7777',
      role: 'RESIDENT',
      status: 'ACTIVE',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: { email: true, push: false, sms: true },
      },
    },
    {
      id: '4',
      email: 'carlos.oliveira@email.com',
      name: 'Carlos Oliveira',
      cpf: '789.123.456-00',
      phone: '(85) 96666-6666',
      role: 'RESIDENT',
      status: 'INACTIVE',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: { email: false, push: true, sms: false },
      },
    },
    {
      id: '5',
      email: 'ana.costa@email.com',
      name: 'Ana Costa',
      cpf: '321.654.987-00',
      phone: '(85) 95555-5555',
      role: 'RESIDENT',
      status: 'BLOCKED',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'system',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: { email: true, push: true, sms: true },
      },
    },
  ];

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUsers(filter: UserFilter = {}): Promise<ApiResponse<User[]>> {
    await this.delay(500);

    let filteredUsers = [...this.users];

    // Apply filters
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.cpf.includes(searchTerm) ||
        user.phone.includes(searchTerm)
      );
    }

    if (filter.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filter.role);
    }

    if (filter.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filter.status);
    }

    // Apply sorting
    if (filter.sortBy) {
      filteredUsers.sort((a, b) => {
        const aValue = a[filter.sortBy as keyof User] as string;
        const bValue = b[filter.sortBy as keyof User] as string;
        
        if (filter.sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      });
    }

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedUsers,
      message: 'Users retrieved successfully',
      meta: {
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    };
  }

  async getUserById(id: string): Promise<ApiResponse<User | null>> {
    await this.delay(300);

    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        data: null,
        message: 'User not found',
        errors: ['User with provided ID does not exist'],
      };
    }

    return {
      success: true,
      data: user,
      message: 'User retrieved successfully',
    };
  }

  async createUser(userData: CreateUserForm): Promise<ApiResponse<User | null>> {
    await this.delay(800);

    // Validate data
    const errors: string[] = [];

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!isValidEmail(userData.email)) {
      errors.push('Email inválido');
    }

    if (this.users.some(u => u.email === userData.email)) {
      errors.push('Email já está em uso');
    }

    if (!isValidCPF(userData.cpf)) {
      errors.push('CPF inválido');
    }

    if (this.users.some(u => u.cpf === userData.cpf)) {
      errors.push('CPF já está cadastrado');
    }

    if (!isValidPhone(userData.phone)) {
      errors.push('Telefone inválido');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (userData.password !== userData.confirmPassword) {
      errors.push('Confirmação de senha não confere');
    }

    if (errors.length > 0) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors,
      };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: userData.name,
      cpf: userData.cpf,
      phone: userData.phone,
      role: userData.role,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [],
      preferences: {
        theme: 'system',
        language: 'pt-BR',
        timezone: 'America/Fortaleza',
        notifications: { email: true, push: true, sms: false },
      },
    };

    this.users.push(newUser);

    return {
      success: true,
      data: newUser,
      message: 'User created successfully',
    };
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User | null>> {
    await this.delay(500);

    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'User not found',
        errors: ['User with provided ID does not exist'],
      };
    }

    // Validate data
    const errors: string[] = [];

    if (userData.name && userData.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (userData.email && !isValidEmail(userData.email)) {
      errors.push('Email inválido');
    }

    if (userData.email && this.users.some(u => u.email === userData.email && u.id !== id)) {
      errors.push('Email já está em uso');
    }

    if (userData.cpf && !isValidCPF(userData.cpf)) {
      errors.push('CPF inválido');
    }

    if (userData.cpf && this.users.some(u => u.cpf === userData.cpf && u.id !== id)) {
      errors.push('CPF já está cadastrado');
    }

    if (userData.phone && !isValidPhone(userData.phone)) {
      errors.push('Telefone inválido');
    }

    if (errors.length > 0) {
      return {
        success: false,
        data: null,
        message: 'Validation failed',
        errors,
      };
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;

    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    };
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    await this.delay(400);

    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'User not found',
        errors: ['User with provided ID does not exist'],
      };
    }

    // Check if user can be deleted (business rules)
    const user = this.users[userIndex];
    if (user.role === 'ADMIN' && this.users.filter(u => u.role === 'ADMIN').length === 1) {
      return {
        success: false,
        data: null,
        message: 'Cannot delete the last admin user',
        errors: ['Pelo menos um usuário administrador deve existir'],
      };
    }

    this.users.splice(userIndex, 1);

    return {
      success: true,
      data: null,
      message: 'User deleted successfully',
    };
  }

  async bulkUpdateStatus(userIds: string[], status: UserStatus): Promise<ApiResponse<User[]>> {
    await this.delay(600);

    const updatedUsers: User[] = [];
    const errors: string[] = [];

    for (const id of userIds) {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        errors.push(`User with ID ${id} not found`);
        continue;
      }

      // Business rule: cannot block all admin users
      const user = this.users[userIndex];
      if (status === 'BLOCKED' && user.role === 'ADMIN') {
        const activeAdmins = this.users.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE').length;
        if (activeAdmins === 1) {
          errors.push(`Cannot block the last active admin user: ${user.name}`);
          continue;
        }
      }

      this.users[userIndex] = {
        ...user,
        status,
        updatedAt: new Date(),
      };
      
      updatedUsers.push(this.users[userIndex]);
    }

    return {
      success: errors.length === 0,
      data: updatedUsers,
      message: `${updatedUsers.length} users updated successfully`,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async getUsersByRole(role: UserRole): Promise<ApiResponse<User[]>> {
    await this.delay(300);

    const filteredUsers = this.users.filter(user => user.role === role);

    return {
      success: true,
      data: filteredUsers,
      message: 'Users retrieved successfully',
    };
  }

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    await this.delay(400);

    const searchTerm = query.toLowerCase();
    const filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.cpf.includes(searchTerm) ||
      user.phone.includes(searchTerm)
    );

    return {
      success: true,
      data: filteredUsers,
      message: 'Search completed successfully',
    };
  }

  // Statistics methods
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    byRole: Record<UserRole, number>;
    byStatus: Record<UserStatus, number>;
    recentlyCreated: number;
  }>> {
    await this.delay(300);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = {
      total: this.users.length,
      byRole: {
        ADMIN: this.users.filter(u => u.role === 'ADMIN').length,
        MANAGER: this.users.filter(u => u.role === 'MANAGER').length,
        RESIDENT: this.users.filter(u => u.role === 'RESIDENT').length,
      },
      byStatus: {
        ACTIVE: this.users.filter(u => u.status === 'ACTIVE').length,
        INACTIVE: this.users.filter(u => u.status === 'INACTIVE').length,
        BLOCKED: this.users.filter(u => u.status === 'BLOCKED').length,
      },
      recentlyCreated: this.users.filter(u => u.createdAt >= thirtyDaysAgo).length,
    };

    return {
      success: true,
      data: stats,
      message: 'User statistics retrieved successfully',
    };
  }
}

export const userService = new UserService();