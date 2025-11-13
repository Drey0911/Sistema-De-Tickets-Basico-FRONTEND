import React, { createContext, useState, type ReactNode } from 'react';
import Toast, { type ToastType } from './Toast';

export interface Notification {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface NotificationContextType {
  showNotification: (
    message: string, 
    type: ToastType, 
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
      onClose?: () => void;
    }
  ) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    message: string, 
    type: ToastType, 
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
      onClose?: () => void;
    }
  ) => {
    const id = Date.now().toString();
    const duration = options?.duration || 3000;
    
    const newNotification: Notification = {
      id,
      message,
      type,
      duration,
      action: options?.action,
      onClose: options?.onClose
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter(notification => notification.id !== id);
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <div className="toast-container">
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            action={notification.action}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;