import { Unit, Transaction, TransactionStatus, UnitStatus, LeaseStatus } from '@/types';

// Unit code normalization following PDS specifications
export const normalizeUnitCode = (input: string): string => {
  // Remove extra spaces, dots, and normalize case
  const cleaned = input.trim().replace(/\s+/g, '').replace(/\./g, '').toLowerCase();
  
  // Extract number and letter parts
  const match = cleaned.match(/^(\d{1,4})([a-g])$/);
  
  if (!match) {
    throw new Error('Código de unidade inválido. Use o formato: número + letra (ex: 10A, 5B)');
  }
  
  const [, number, letter] = match;
  return `${number}${letter.toUpperCase()}`;
};

// Validate unit code format
export const isValidUnitCode = (code: string): boolean => {
  const regex = /^\d{1,4}[A-G]$/;
  try {
    const normalized = normalizeUnitCode(code);
    return regex.test(normalized);
  } catch {
    return false;
  }
};

// Transaction calculations following PDS business rules
export const calculateTransactionTotal = (
  amount: number,
  discount: number = 0,
  fine: number = 0,
  interest: number = 0
): number => {
  return Math.round((amount - discount + fine + interest) * 100) / 100;
};

// Calculate fine and interest for overdue payments
export const calculateOverdueCharges = (
  originalAmount: number,
  dueDate: Date,
  currentDate: Date = new Date(),
  fineRate: number = 0.02, // 2% flat fine
  interestRate: number = 0.001 // 0.1% per day
): { fine: number; interest: number; daysPastDue: number } => {
  const daysPastDue = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysPastDue <= 0) {
    return { fine: 0, interest: 0, daysPastDue: 0 };
  }
  
  const fine = Math.round(originalAmount * fineRate * 100) / 100;
  const interest = Math.round(originalAmount * interestRate * daysPastDue * 100) / 100;
  
  return { fine, interest, daysPastDue };
};

// Update transaction status based on business rules
export const getTransactionStatus = (
  transaction: Transaction,
  currentDate: Date = new Date()
): TransactionStatus => {
  if (transaction.paymentDate) {
    return 'PAID';
  }
  
  if (transaction.status === 'CANCELLED') {
    return 'CANCELLED';
  }
  
  if (currentDate > transaction.dueDate) {
    return 'OVERDUE';
  }
  
  return 'PENDING';
};

// Check if unit can be rented
export const canRentUnit = (unit: Unit): boolean => {
  return unit.status === 'AVAILABLE';
};

// Generate next rent payment
export const generateNextRentPayment = (
  leaseId: string,
  monthlyRent: number,
  dueDay: number = 5
): Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'total'> => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, dueDay);
  
  return {
    leaseId,
    type: 'RENT',
    description: `Aluguel ${nextMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    amount: monthlyRent,
    discount: 0,
    fine: 0,
    interest: 0,
    dueDate: nextMonth,
    status: 'PENDING',
    createdBy: 'system',
    metadata: {
      recurringId: `rent_${leaseId}`,
    },
  };
};

// Validate CPF format
export const isValidCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if has 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate check digits
  let sum = 0;
  let remainder;
  
  // First check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  // Second check digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

// Format CPF for display
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Validate phone format
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

// Format phone for display
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

// Format date for display (Brazil timezone)
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Fortaleza',
  }).format(date);
};

// Format datetime for display
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Fortaleza',
  }).format(date);
};

// Check if lease is expiring soon
export const isLeaseExpiringSoon = (endDate: Date, warningDays: number = 30): boolean => {
  const now = new Date();
  const warningDate = new Date(endDate.getTime() - warningDays * 24 * 60 * 60 * 1000);
  return now >= warningDate && now <= endDate;
};

// Get lease status based on dates
export const getLeaseStatus = (startDate: Date, endDate: Date, currentDate: Date = new Date()): LeaseStatus => {
  if (currentDate < startDate) {
    return 'PENDING';
  }
  
  if (currentDate > endDate) {
    return 'EXPIRED';
  }
  
  return 'ACTIVE';
};

// Generate payment reference code
export const generatePaymentReference = (transactionId: string, paymentMethod: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const method = paymentMethod.substring(0, 3).toUpperCase();
  const id = transactionId.substring(0, 4).toUpperCase();
  
  return `${method}-${id}-${timestamp}`;
};