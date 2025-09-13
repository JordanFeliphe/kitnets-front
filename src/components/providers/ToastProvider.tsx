import React from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
  ToastAction,
} from '@/components/ui/toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const getToastVariant = (type: string) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'destructive';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'default';
  }
};

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-600" />;
    default:
      return null;
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <RadixToastProvider duration={5000}>
      {children}
      
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          variant={getToastVariant(notification.type)}
          duration={notification.duration || 5000}
          onOpenChange={(open) => {
            if (!open) {
              removeNotification(notification.id);
            }
          }}
        >
          <div className="flex items-start space-x-3">
            {getToastIcon(notification.type)}
            
            <div className="flex-1 space-y-1">
              <ToastTitle>{notification.title}</ToastTitle>
              {notification.message && (
                <ToastDescription>
                  {notification.message}
                </ToastDescription>
              )}
            </div>
          </div>

          {notification.action && (
            <ToastAction
              altText={notification.action.label}
              onClick={notification.action.onClick}
            >
              {notification.action.label}
            </ToastAction>
          )}

          <ToastClose />
        </Toast>
      ))}
      
      <ToastViewport />
    </RadixToastProvider>
  );
};