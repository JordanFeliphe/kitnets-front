import React, { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MoneyInputProps extends Omit<React.ComponentProps<"input">, 'value' | 'onChange' | 'type'> {
  value?: number;
  onChange?: (value: number | null) => void;
  currency?: string;
  locale?: string;
  allowNegative?: boolean;
  allowZero?: boolean;
  maxValue?: number;
  minValue?: number;
  placeholder?: string;
  showCurrencySymbol?: boolean;
  decimalPlaces?: number;
}

const formatCurrency = (
  value: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR',
  showSymbol: boolean = true,
  decimalPlaces: number = 2
): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };

  if (showSymbol) {
    options.style = 'currency';
    options.currency = currency;
  }

  return new Intl.NumberFormat(locale, options).format(value);
};

const parseCurrencyInput = (
  input: string,
  locale: string = 'pt-BR'
): number | null => {
  if (!input || input.trim() === '') return null;

  // Remove currency symbols and non-numeric characters except decimal separators
  let cleanInput = input.replace(/[^\d,.-]/g, '');

  // Handle Brazilian format (1.234,56)
  if (locale === 'pt-BR') {
    // If there's both . and ,, assume . is thousands separator and , is decimal
    if (cleanInput.includes('.') && cleanInput.includes(',')) {
      cleanInput = cleanInput.replace(/\./g, '').replace(',', '.');
    } else if (cleanInput.includes(',')) {
      // Only comma, check if it's thousands or decimal separator
      const commaIndex = cleanInput.lastIndexOf(',');
      const afterComma = cleanInput.substring(commaIndex + 1);
      
      // If 2 or fewer digits after comma, it's likely decimal
      if (afterComma.length <= 2) {
        cleanInput = cleanInput.replace(',', '.');
      } else {
        // More than 2 digits, treat as thousands separator
        cleanInput = cleanInput.replace(/,/g, '');
      }
    }
  }

  const numericValue = parseFloat(cleanInput);
  return isNaN(numericValue) ? null : numericValue;
};

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({
    value,
    onChange,
    currency = 'BRL',
    locale = 'pt-BR',
    allowNegative = false,
    allowZero = true,
    maxValue,
    minValue,
    placeholder = 'R$ 0,00',
    showCurrencySymbol = false,
    decimalPlaces = 2,
    className,
    onBlur,
    onFocus,
    ...props
  }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Update display value when prop value changes
    useEffect(() => {
      if (value !== undefined && value !== null) {
        if (isFocused) {
          // When focused, show the raw numeric value for easier editing
          setDisplayValue(value.toString());
        } else {
          // When not focused, show formatted currency
          setDisplayValue(formatCurrency(value, currency, locale, showCurrencySymbol, decimalPlaces));
        }
      } else {
        setDisplayValue('');
      }
    }, [value, currency, locale, showCurrencySymbol, decimalPlaces, isFocused]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setDisplayValue(input);

      const numericValue = parseCurrencyInput(input, locale);
      
      if (numericValue === null) {
        onChange?.(null);
        return;
      }

      // Validate constraints
      if (!allowNegative && numericValue < 0) {
        return;
      }

      if (!allowZero && numericValue === 0) {
        return;
      }

      if (maxValue !== undefined && numericValue > maxValue) {
        return;
      }

      if (minValue !== undefined && numericValue < minValue) {
        return;
      }

      onChange?.(numericValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // Convert formatted value back to numeric string for editing
      if (value !== undefined && value !== null) {
        setDisplayValue(value.toString());
      }
      
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      // Format the value when losing focus
      const numericValue = parseCurrencyInput(displayValue, locale);
      if (numericValue !== null) {
        const formatted = formatCurrency(numericValue, currency, locale, showCurrencySymbol, decimalPlaces);
        setDisplayValue(formatted);
        
        // Ensure onChange is called with the final value
        onChange?.(numericValue);
      }
      
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow navigation keys, backspace, delete, tab, escape, enter
      if ([
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'Home', 'End'
      ].includes(e.key)) {
        return;
      }

      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
      if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
        return;
      }

      // Allow numbers
      if (/^\d$/.test(e.key)) {
        return;
      }

      // Allow decimal separators based on locale
      if (locale === 'pt-BR' && [',', '.'].includes(e.key)) {
        return;
      } else if (locale === 'en-US' && e.key === '.') {
        return;
      }

      // Allow minus sign if negative values are allowed
      if (allowNegative && e.key === '-') {
        return;
      }

      // Prevent all other keys
      e.preventDefault();
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'text-right font-mono',
          !isFocused && showCurrencySymbol && 'font-normal',
          className
        )}
        autoComplete="off"
        inputMode="decimal"
      />
    );
  }
);

MoneyInput.displayName = 'MoneyInput';

// Helper components for specific currencies
export const BRLInput = forwardRef<HTMLInputElement, Omit<MoneyInputProps, 'currency' | 'locale'>>(
  (props, ref) => (
    <MoneyInput
      {...props}
      ref={ref}
      currency="BRL"
      locale="pt-BR"
      placeholder="R$ 0,00"
    />
  )
);

BRLInput.displayName = 'BRLInput';

export const USDInput = forwardRef<HTMLInputElement, Omit<MoneyInputProps, 'currency' | 'locale'>>(
  (props, ref) => (
    <MoneyInput
      {...props}
      ref={ref}
      currency="USD"
      locale="en-US"
      placeholder="$0.00"
    />
  )
);

USDInput.displayName = 'USDInput';

// Hook for money input validation
export const useMoneyInputValidation = (
  value: number | null,
  options: {
    required?: boolean;
    minValue?: number;
    maxValue?: number;
    allowZero?: boolean;
  } = {}
) => {
  const { required = false, minValue, maxValue, allowZero = true } = options;

  const errors: string[] = [];

  if (required && (value === null || value === undefined)) {
    errors.push('Valor é obrigatório');
  }

  if (value !== null && value !== undefined) {
    if (!allowZero && value === 0) {
      errors.push('Valor deve ser maior que zero');
    }

    if (minValue !== undefined && value < minValue) {
      errors.push(`Valor mínimo é ${formatCurrency(minValue)}`);
    }

    if (maxValue !== undefined && value > maxValue) {
      errors.push(`Valor máximo é ${formatCurrency(maxValue)}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};