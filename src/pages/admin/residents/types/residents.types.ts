export interface User {
  _id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'TRASH';
  type: 'ADMIN' | 'RESIDENT';
  password?: string; // Apenas na criação/edição
  blockedAt: string | null;
  blockedUntil: string | null;
  mfaEnabled: boolean;
  requirePasswordReset: boolean;
  contractId?: string;
  createdAt: string;
  updatedAt: string;

  // Populado quando buscar por ID
  contract?: {
    _id: string;
    startDate: string;
    rentAmount: number;
    depositAmount: number;
    dayOfMonthDue: number;
    status: string;
    unit: {
      _id: string;
      code: string;
      rentDefaultAmount: number;
      notes: string;
    }
  }
}

export interface CreateUserRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  type: 'RESIDENT'; // Sempre RESIDENT nesta tela
  status: 'ACTIVE' | 'INACTIVE';
  unitId?: string; // ID da unidade selecionada
  mfaEnabled?: boolean;
  requirePasswordReset?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  password?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  unitId?: string;
  mfaEnabled?: boolean;
  requirePasswordReset?: boolean;
}

export interface Unit {
  _id: string;
  number: string;
  block: string;
  floor: number;
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO';
  bedrooms: number;
  bathrooms: number;
  area: number;
  isAvailable: boolean;
  rentValue: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ResidentsFilters {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface ResidentsResponse {
  data: User[];
  pagination: PaginationInfo;
}

export interface AvailableUnitsResponse {
  data: Unit[];
}

export interface ResidentsStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  trash: number;
}

// Component Props
export interface ResidentsTableViewProps {
  data: ResidentsResponse;
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export interface ResidentsCardViewProps {
  data: ResidentsResponse;
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export interface CreateResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: User | null;
}

export interface ResidentsFiltersProps {
  filters: ResidentsFilters;
  onFiltersChange: (filters: ResidentsFilters) => void;
  loading?: boolean;
}

export interface ResidentsPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading?: boolean;
}

export interface StatusBadgeProps {
  status: User['status'];
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  loading?: boolean;
}