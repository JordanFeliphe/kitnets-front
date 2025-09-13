import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { NotificationState } from '@/types';

interface NotificationContextState {
  notifications: NotificationState[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<NotificationState, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

const initialState: NotificationContextState = {
  notifications: [],
};

const notificationReducer = (state: NotificationContextState, action: NotificationAction): NotificationContextState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification: NotificationState = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

interface NotificationContextType extends NotificationContextState {
  addNotification: (notification: Omit<NotificationState, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Convenience methods
  success: (title: string, message?: string, options?: Partial<NotificationState>) => string;
  error: (title: string, message?: string, options?: Partial<NotificationState>) => string;
  warning: (title: string, message?: string, options?: Partial<NotificationState>) => string;
  info: (title: string, message?: string, options?: Partial<NotificationState>) => string;
  
  // Business-specific notifications
  notifyPaymentReceived: (amount: number, tenant: string) => void;
  notifyLeaseExpiring: (tenant: string, unit: string, daysLeft: number) => void;
  notifyMaintenanceRequired: (unit: string, issue: string) => void;
  notifyOverduePayment: (tenant: string, amount: number, daysPastDue: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = useCallback((notification: Omit<NotificationState, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        ...notification,
        duration: notification.duration ?? 5000,
      },
    });

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, notification.duration ?? 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<NotificationState>): string => {
    return addNotification({
      type: 'success',
      title,
      message: message || '',
      ...options,
    });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, options?: Partial<NotificationState>): string => {
    return addNotification({
      type: 'error',
      title,
      message: message || '',
      duration: 0, // Errors don't auto-dismiss by default
      ...options,
    });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, options?: Partial<NotificationState>): string => {
    return addNotification({
      type: 'warning',
      title,
      message: message || '',
      duration: 7000, // Warnings stay longer
      ...options,
    });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, options?: Partial<NotificationState>): string => {
    return addNotification({
      type: 'info',
      title,
      message: message || '',
      ...options,
    });
  }, [addNotification]);

  // Business-specific notifications
  const notifyPaymentReceived = useCallback((amount: number, tenant: string) => {
    success(
      'Pagamento Recebido',
      `Pagamento de R$ ${amount.toFixed(2)} de ${tenant} foi processado com sucesso.`,
      {
        action: {
          label: 'Ver Detalhes',
          onClick: () => {
            // Navigate to transaction details
            console.log('Navigate to transaction details');
          },
        },
      }
    );
  }, [success]);

  const notifyLeaseExpiring = useCallback((tenant: string, unit: string, daysLeft: number) => {
    warning(
      'Contrato Expirando',
      `O contrato de ${tenant} (Unidade ${unit}) expira em ${daysLeft} dias.`,
      {
        duration: 0, // Don't auto-dismiss
        action: {
          label: 'Renovar',
          onClick: () => {
            // Open lease renewal modal
            console.log('Open lease renewal modal');
          },
        },
      }
    );
  }, [warning]);

  const notifyMaintenanceRequired = useCallback((unit: string, issue: string) => {
    warning(
      'Manutenção Necessária',
      `Unidade ${unit}: ${issue}`,
      {
        action: {
          label: 'Agendar',
          onClick: () => {
            // Open maintenance scheduling modal
            console.log('Open maintenance scheduling modal');
          },
        },
      }
    );
  }, [warning]);

  const notifyOverduePayment = useCallback((tenant: string, amount: number, daysPastDue: number) => {
    error(
      'Pagamento em Atraso',
      `${tenant} possui pagamento de R$ ${amount.toFixed(2)} com ${daysPastDue} dias de atraso.`,
      {
        action: {
          label: 'Enviar Cobrança',
          onClick: () => {
            // Send payment reminder
            console.log('Send payment reminder');
          },
        },
      }
    );
  }, [error]);

  const value: NotificationContextType = {
    ...state,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    notifyPaymentReceived,
    notifyLeaseExpiring,
    notifyMaintenanceRequired,
    notifyOverduePayment,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};