// Base types following PDS specifications
export type UserRole = 'ADMIN' | 'MANAGER' | 'RESIDENT';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export type UnitStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

export type LeaseStatus = 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'PENDING';

export type TransactionStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export type TransactionType = 'RENT' | 'DEPOSIT' | 'UTILITY' | 'MAINTENANCE' | 'FINE' | 'OTHER';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

// User entity
export interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  permissions: string[];
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt-BR' | 'en-US';
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

// Unit entity with code normalization
export interface Unit {
  id: string;
  code: string; // Normalized format: e.g., "10A", "5B"
  description?: string;
  floor: number;
  area: number; // in m²
  bedrooms: number;
  bathrooms: number;
  hasKitchen: boolean;
  hasPatio: boolean;
  status: UnitStatus;
  monthlyRent: number;
  deposit: number;
  utilities: {
    water: boolean;
    electricity: boolean;
    gas: boolean;
    internet: boolean;
  };
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Lease/Contract entity
export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  deposit: number;
  status: LeaseStatus;
  terms: string;
  documents: {
    contract: string;
    tenantId: string;
    guarantorId?: string;
    proofOfIncome: string[];
  };
  renewalOptions: {
    automatic: boolean;
    noticePeriod: number; // days
    rentIncrease: number; // percentage
  };
  createdAt: Date;
  updatedAt: Date;
  terminatedAt?: Date;
  terminationReason?: string;
}

// Transaction entity with business logic
export interface Transaction {
  id: string;
  leaseId: string;
  type: TransactionType;
  description: string;
  amount: number;
  discount: number;
  fine: number;
  interest: number;
  total: number; // amount - discount + fine + interest
  dueDate: Date;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
  status: TransactionStatus;
  reference?: string;
  receipt?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
  metadata: {
    recurringId?: string;
    parentTransactionId?: string;
    installmentNumber?: number;
    totalInstallments?: number;
  };
}

// Dashboard metrics
export interface DashboardMetrics {
  units: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    occupancyRate: number;
  };
  financial: {
    monthlyRevenue: number;
    pendingPayments: number;
    overdueAmount: number;
    collectionRate: number;
  };
  leases: {
    active: number;
    expiring: number;
    expired: number;
    newThisMonth: number;
  };
  trends: {
    revenue: Array<{
      month: string;
      amount: number;
    }>;
    occupancy: Array<{
      month: string;
      rate: number;
    }>;
  };
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Filter and search types
export interface BaseFilter {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilter extends BaseFilter {
  role?: UserRole;
  status?: UserStatus;
}

export interface UnitFilter extends BaseFilter {
  status?: UnitStatus;
  floor?: number;
  bedrooms?: number;
  minRent?: number;
  maxRent?: number;
}

export interface TransactionFilter extends BaseFilter {
  type?: TransactionType;
  status?: TransactionStatus;
  dateFrom?: Date;
  dateTo?: Date;
  leaseId?: string;
  tenantId?: string;
}

// Form schemas
export interface CreateUserForm {
  email: string;
  name: string;
  cpf: string;
  phone: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export interface CreateUnitForm {
  code: string;
  description?: string;
  floor: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  hasKitchen: boolean;
  hasPatio: boolean;
  monthlyRent: number;
  deposit: number;
  utilities: {
    water: boolean;
    electricity: boolean;
    gas: boolean;
    internet: boolean;
  };
}

export interface CreateLeaseForm {
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  deposit: number;
  terms: string;
}

export interface CreateTransactionForm {
  leaseId: string;
  type: TransactionType;
  description: string;
  amount: number;
  discount?: number;
  fine?: number;
  interest?: number;
  dueDate: Date;
  notes?: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: string;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Permission system
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  ADMIN: Permission[];
  MANAGER: Permission[];
  RESIDENT: Permission[];
}

// Audit trail
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}