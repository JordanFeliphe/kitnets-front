import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Unit, Lease, Transaction, ApiResponse, UserFilter, UnitFilter, TransactionFilter } from '@/types';

interface DataState {
  users: {
    items: User[];
    loading: boolean;
    error: string | null;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } | null;
  };
  units: {
    items: Unit[];
    loading: boolean;
    error: string | null;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } | null;
  };
  leases: {
    items: Lease[];
    loading: boolean;
    error: string | null;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } | null;
  };
  transactions: {
    items: Transaction[];
    loading: boolean;
    error: string | null;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } | null;
  };
}

type DataAction =
  // Users
  | { type: 'FETCH_USERS_START' }
  | { type: 'FETCH_USERS_SUCCESS'; payload: ApiResponse<User[]> }
  | { type: 'FETCH_USERS_ERROR'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; data: Partial<User> } }
  | { type: 'DELETE_USER'; payload: string }
  // Units
  | { type: 'FETCH_UNITS_START' }
  | { type: 'FETCH_UNITS_SUCCESS'; payload: ApiResponse<Unit[]> }
  | { type: 'FETCH_UNITS_ERROR'; payload: string }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'UPDATE_UNIT'; payload: { id: string; data: Partial<Unit> } }
  | { type: 'DELETE_UNIT'; payload: string }
  // Leases
  | { type: 'FETCH_LEASES_START' }
  | { type: 'FETCH_LEASES_SUCCESS'; payload: ApiResponse<Lease[]> }
  | { type: 'FETCH_LEASES_ERROR'; payload: string }
  | { type: 'ADD_LEASE'; payload: Lease }
  | { type: 'UPDATE_LEASE'; payload: { id: string; data: Partial<Lease> } }
  | { type: 'DELETE_LEASE'; payload: string }
  // Transactions
  | { type: 'FETCH_TRANSACTIONS_START' }
  | { type: 'FETCH_TRANSACTIONS_SUCCESS'; payload: ApiResponse<Transaction[]> }
  | { type: 'FETCH_TRANSACTIONS_ERROR'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; data: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const initialState: DataState = {
  users: {
    items: [],
    loading: false,
    error: null,
    meta: null,
  },
  units: {
    items: [],
    loading: false,
    error: null,
    meta: null,
  },
  leases: {
    items: [],
    loading: false,
    error: null,
    meta: null,
  },
  transactions: {
    items: [],
    loading: false,
    error: null,
    meta: null,
  },
};

const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    // Users
    case 'FETCH_USERS_START':
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        users: {
          items: action.payload.data,
          loading: false,
          error: null,
          meta: action.payload.meta || null,
        },
      };
    case 'FETCH_USERS_ERROR':
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };
    case 'ADD_USER':
      return {
        ...state,
        users: {
          ...state.users,
          items: [...state.users.items, action.payload],
        },
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: {
          ...state.users,
          items: state.users.items.map(user =>
            user.id === action.payload.id
              ? { ...user, ...action.payload.data, updatedAt: new Date() }
              : user
          ),
        },
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: {
          ...state.users,
          items: state.users.items.filter(user => user.id !== action.payload),
        },
      };

    // Units
    case 'FETCH_UNITS_START':
      return {
        ...state,
        units: { ...state.units, loading: true, error: null },
      };
    case 'FETCH_UNITS_SUCCESS':
      return {
        ...state,
        units: {
          items: action.payload.data,
          loading: false,
          error: null,
          meta: action.payload.meta || null,
        },
      };
    case 'FETCH_UNITS_ERROR':
      return {
        ...state,
        units: { ...state.units, loading: false, error: action.payload },
      };
    case 'ADD_UNIT':
      return {
        ...state,
        units: {
          ...state.units,
          items: [...state.units.items, action.payload],
        },
      };
    case 'UPDATE_UNIT':
      return {
        ...state,
        units: {
          ...state.units,
          items: state.units.items.map(unit =>
            unit.id === action.payload.id
              ? { ...unit, ...action.payload.data, updatedAt: new Date() }
              : unit
          ),
        },
      };
    case 'DELETE_UNIT':
      return {
        ...state,
        units: {
          ...state.units,
          items: state.units.items.filter(unit => unit.id !== action.payload),
        },
      };

    // Leases
    case 'FETCH_LEASES_START':
      return {
        ...state,
        leases: { ...state.leases, loading: true, error: null },
      };
    case 'FETCH_LEASES_SUCCESS':
      return {
        ...state,
        leases: {
          items: action.payload.data,
          loading: false,
          error: null,
          meta: action.payload.meta || null,
        },
      };
    case 'FETCH_LEASES_ERROR':
      return {
        ...state,
        leases: { ...state.leases, loading: false, error: action.payload },
      };
    case 'ADD_LEASE':
      return {
        ...state,
        leases: {
          ...state.leases,
          items: [...state.leases.items, action.payload],
        },
      };
    case 'UPDATE_LEASE':
      return {
        ...state,
        leases: {
          ...state.leases,
          items: state.leases.items.map(lease =>
            lease.id === action.payload.id
              ? { ...lease, ...action.payload.data, updatedAt: new Date() }
              : lease
          ),
        },
      };
    case 'DELETE_LEASE':
      return {
        ...state,
        leases: {
          ...state.leases,
          items: state.leases.items.filter(lease => lease.id !== action.payload),
        },
      };

    // Transactions
    case 'FETCH_TRANSACTIONS_START':
      return {
        ...state,
        transactions: { ...state.transactions, loading: true, error: null },
      };
    case 'FETCH_TRANSACTIONS_SUCCESS':
      return {
        ...state,
        transactions: {
          items: action.payload.data,
          loading: false,
          error: null,
          meta: action.payload.meta || null,
        },
      };
    case 'FETCH_TRANSACTIONS_ERROR':
      return {
        ...state,
        transactions: { ...state.transactions, loading: false, error: action.payload },
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          items: [...state.transactions.items, action.payload],
        },
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          items: state.transactions.items.map(transaction =>
            transaction.id === action.payload.id
              ? { ...transaction, ...action.payload.data, updatedAt: new Date() }
              : transaction
          ),
        },
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: {
          ...state.transactions,
          items: state.transactions.items.filter(transaction => transaction.id !== action.payload),
        },
      };

    default:
      return state;
  }
};

interface DataContextType extends DataState {
  // Users
  fetchUsers: (filter?: UserFilter) => Promise<void>;
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;

  // Units
  fetchUnits: (filter?: UnitFilter) => Promise<void>;
  createUnit: (data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Unit>;
  updateUnit: (id: string, data: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  getUnitById: (id: string) => Unit | undefined;

  // Leases
  fetchLeases: () => Promise<void>;
  createLease: (data: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lease>;
  updateLease: (id: string, data: Partial<Lease>) => Promise<void>;
  deleteLease: (id: string) => Promise<void>;
  getLeaseById: (id: string) => Lease | undefined;

  // Transactions
  fetchTransactions: (filter?: TransactionFilter) => Promise<void>;
  createTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'total'>) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;

  // Utility functions
  refreshData: () => Promise<void>;
  clearErrors: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Mock API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Users
  const fetchUsers = async (filter?: UserFilter) => {
    dispatch({ type: 'FETCH_USERS_START' });
    try {
      await delay(800);
      // Mock API response
      const mockUsers: User[] = [
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
      ];

      const response: ApiResponse<User[]> = {
        success: true,
        data: mockUsers,
        message: 'Users fetched successfully',
        meta: {
          total: mockUsers.length,
          page: filter?.page || 1,
          limit: filter?.limit || 10,
          totalPages: Math.ceil(mockUsers.length / (filter?.limit || 10)),
        },
      };

      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: 'Failed to fetch users' });
    }
  };

  const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    await delay(500);
    const newUser: User = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
    return newUser;
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    await delay(300);
    dispatch({ type: 'UPDATE_USER', payload: { id, data } });
  };

  const deleteUser = async (id: string) => {
    await delay(300);
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const getUserById = (id: string) => {
    return state.users.items.find(user => user.id === id);
  };

  // Units
  const fetchUnits = async (filter?: UnitFilter) => {
    dispatch({ type: 'FETCH_UNITS_START' });
    try {
      await delay(800);
      const mockUnits: Unit[] = [
        {
          id: '1',
          code: '10A',
          description: 'Quitinete completa com banheiro',
          floor: 1,
          area: 25,
          bedrooms: 0,
          bathrooms: 1,
          hasKitchen: true,
          hasPatio: false,
          status: 'OCCUPIED',
          monthlyRent: 800,
          deposit: 800,
          utilities: { water: true, electricity: true, gas: false, internet: true },
          images: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
        {
          id: '2',
          code: '10B',
          description: 'Quitinete ampla com área externa',
          floor: 1,
          area: 30,
          bedrooms: 0,
          bathrooms: 1,
          hasKitchen: true,
          hasPatio: true,
          status: 'AVAILABLE',
          monthlyRent: 900,
          deposit: 900,
          utilities: { water: true, electricity: true, gas: false, internet: true },
          images: [],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
      ];

      const response: ApiResponse<Unit[]> = {
        success: true,
        data: mockUnits,
        message: 'Units fetched successfully',
        meta: {
          total: mockUnits.length,
          page: filter?.page || 1,
          limit: filter?.limit || 10,
          totalPages: Math.ceil(mockUnits.length / (filter?.limit || 10)),
        },
      };

      dispatch({ type: 'FETCH_UNITS_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'FETCH_UNITS_ERROR', payload: 'Failed to fetch units' });
    }
  };

  const createUnit = async (data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> => {
    await delay(500);
    const newUnit: Unit = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_UNIT', payload: newUnit });
    return newUnit;
  };

  const updateUnit = async (id: string, data: Partial<Unit>) => {
    await delay(300);
    dispatch({ type: 'UPDATE_UNIT', payload: { id, data } });
  };

  const deleteUnit = async (id: string) => {
    await delay(300);
    dispatch({ type: 'DELETE_UNIT', payload: id });
  };

  const getUnitById = (id: string) => {
    return state.units.items.find(unit => unit.id === id);
  };

  // Leases
  const fetchLeases = async () => {
    dispatch({ type: 'FETCH_LEASES_START' });
    try {
      await delay(800);
      const mockLeases: Lease[] = [
        {
          id: '1',
          unitId: '1',
          tenantId: '3',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2025-02-28'),
          monthlyRent: 800,
          deposit: 800,
          status: 'ACTIVE',
          terms: 'Contrato padrão de locação residencial',
          documents: {
            contract: 'contract_001.pdf',
            tenantId: 'id_maria_santos.pdf',
            proofOfIncome: ['comprovante_renda_maria.pdf'],
          },
          renewalOptions: {
            automatic: false,
            noticePeriod: 30,
            rentIncrease: 10,
          },
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date(),
        },
      ];

      const response: ApiResponse<Lease[]> = {
        success: true,
        data: mockLeases,
        message: 'Leases fetched successfully',
        meta: {
          total: mockLeases.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      dispatch({ type: 'FETCH_LEASES_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'FETCH_LEASES_ERROR', payload: 'Failed to fetch leases' });
    }
  };

  const createLease = async (data: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lease> => {
    await delay(500);
    const newLease: Lease = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_LEASE', payload: newLease });
    return newLease;
  };

  const updateLease = async (id: string, data: Partial<Lease>) => {
    await delay(300);
    dispatch({ type: 'UPDATE_LEASE', payload: { id, data } });
  };

  const deleteLease = async (id: string) => {
    await delay(300);
    dispatch({ type: 'DELETE_LEASE', payload: id });
  };

  const getLeaseById = (id: string) => {
    return state.leases.items.find(lease => lease.id === id);
  };

  // Transactions
  const fetchTransactions = async (filter?: TransactionFilter) => {
    dispatch({ type: 'FETCH_TRANSACTIONS_START' });
    try {
      await delay(800);
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          leaseId: '1',
          type: 'RENT',
          description: 'Aluguel Março 2024',
          amount: 800,
          discount: 0,
          fine: 0,
          interest: 0,
          total: 800,
          dueDate: new Date('2024-03-05'),
          paymentDate: new Date('2024-03-03'),
          paymentMethod: 'PIX',
          status: 'PAID',
          reference: 'PIX-123456',
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-03-03'),
          createdBy: '2',
          metadata: {},
        },
        {
          id: '2',
          leaseId: '1',
          type: 'RENT',
          description: 'Aluguel Abril 2024',
          amount: 800,
          discount: 0,
          fine: 0,
          interest: 0,
          total: 800,
          dueDate: new Date('2024-04-05'),
          status: 'PENDING',
          createdAt: new Date('2024-04-01'),
          updatedAt: new Date('2024-04-01'),
          createdBy: '2',
          metadata: {},
        },
      ];

      const response: ApiResponse<Transaction[]> = {
        success: true,
        data: mockTransactions,
        message: 'Transactions fetched successfully',
        meta: {
          total: mockTransactions.length,
          page: filter?.page || 1,
          limit: filter?.limit || 10,
          totalPages: Math.ceil(mockTransactions.length / (filter?.limit || 10)),
        },
      };

      dispatch({ type: 'FETCH_TRANSACTIONS_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'FETCH_TRANSACTIONS_ERROR', payload: 'Failed to fetch transactions' });
    }
  };

  const createTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'total'>): Promise<Transaction> => {
    await delay(500);
    const total = data.amount - (data.discount || 0) + (data.fine || 0) + (data.interest || 0);
    const newTransaction: Transaction = {
      ...data,
      total,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    return newTransaction;
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    await delay(300);
    // Recalculate total if financial fields are updated
    if (data.amount !== undefined || data.discount !== undefined || data.fine !== undefined || data.interest !== undefined) {
      const transaction = state.transactions.items.find(t => t.id === id);
      if (transaction) {
        const amount = data.amount ?? transaction.amount;
        const discount = data.discount ?? transaction.discount;
        const fine = data.fine ?? transaction.fine;
        const interest = data.interest ?? transaction.interest;
        data.total = amount - discount + fine + interest;
      }
    }
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, data } });
  };

  const deleteTransaction = async (id: string) => {
    await delay(300);
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const getTransactionById = (id: string) => {
    return state.transactions.items.find(transaction => transaction.id === id);
  };

  // Utility functions
  const refreshData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchUnits(),
      fetchLeases(),
      fetchTransactions(),
    ]);
  };

  const clearErrors = () => {
    // Implementation would dispatch actions to clear errors
  };

  const value: DataContextType = {
    ...state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    getUnitById,
    fetchLeases,
    createLease,
    updateLease,
    deleteLease,
    getLeaseById,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    refreshData,
    clearErrors,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};