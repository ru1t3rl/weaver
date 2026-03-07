import { useContext } from 'react';
import { NotificationContext } from '../contexts';
import { NotificationType } from '../providers';

export interface UseNotification {
  showNotification: (title: string, message?: string, type?: NotificationType) => void;
}

export function useNotification(): UseNotification {
  const { showNotification } = useContext(NotificationContext);

  return {
    showNotification,
  };
}
