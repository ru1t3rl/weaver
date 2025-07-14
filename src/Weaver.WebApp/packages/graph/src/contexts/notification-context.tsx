import { createContext } from 'react';
import { NotificationType } from '../providers/notification-provider';

export interface INotificationContext {
  name: string;
  showNotification: (title: string, message?: string, type?: NotificationType) => void;
}

export const NotificationContext = createContext<INotificationContext>({
  name: 'Default',
  showNotification: () => undefined,
});
