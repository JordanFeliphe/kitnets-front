// CPF validation
export const validateCPF = (cpf: string): boolean => {
  // Remove formatting
  const cleanCPF = cpf.replace(/[^\d]/g, '');

  // Check length
  if (cleanCPF.length !== 11) return false;

  // Check for same digits
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // For demo purposes, accept any 11-digit CPF that's not all the same number
  return true;
};

// CPF mask
export const maskCPF = (value: string): string => {
  const cleanValue = value.replace(/[^\d]/g, '');

  if (cleanValue.length <= 3) {
    return cleanValue;
  } else if (cleanValue.length <= 6) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
  } else if (cleanValue.length <= 9) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
  } else {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
  }
};

// Phone mask
export const maskPhone = (value: string): string => {
  const cleanValue = value.replace(/[^\d]/g, '');

  if (cleanValue.length <= 2) {
    return cleanValue;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 11) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7)}`;
  } else {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
  }
};

// Phone validation
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 4) {
    errors.push('Senha deve ter pelo menos 4 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Name validation
export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]+$/.test(trimmedName);
};

// Generate random password
export const generateRandomPassword = (length: number = 8): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%&*';

  const allChars = lowercase + uppercase + numbers + symbols;

  let password = '';

  // Ensure at least one character from each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Form validation schemas
export interface ResidentFormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password?: string;
  status: 'ACTIVE' | 'INACTIVE';
  unitId?: string;
  requirePasswordReset: boolean;
}

export const validateResidentForm = (
  data: ResidentFormData,
  isEditing: boolean = false
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!validateName(data.name)) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres e conter apenas letras';
  }

  // CPF validation
  if (!validateCPF(data.cpf)) {
    errors.cpf = 'CPF deve ter 11 dígitos';
  }

  // Email validation
  if (!validateEmail(data.email)) {
    errors.email = 'Formato de email inválido';
  }

  // Phone validation
  if (!validatePhone(data.phone)) {
    errors.phone = 'Formato de telefone inválido';
  }

  // Password validation (only for creation or when password is provided)
  if (!isEditing || data.password) {
    if (!data.password) {
      errors.password = 'Senha é obrigatória';
    } else {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0]; // Show first error
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
};

// Clean input values
export const cleanCPF = (value: string): string => {
  return value.replace(/[^\d]/g, '');
};

export const cleanPhone = (value: string): string => {
  return value.replace(/[^\d]/g, '');
};

// Input handlers with masks
export const handleCPFInput = (
  value: string,
  onChange: (value: string) => void
): void => {
  const maskedValue = maskCPF(value);
  onChange(maskedValue);
};

export const handlePhoneInput = (
  value: string,
  onChange: (value: string) => void
): void => {
  const maskedValue = maskPhone(value);
  onChange(maskedValue);
};