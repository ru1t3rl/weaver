import { notification } from 'antd';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { INotificationContext, NotificationContext } from '../contexts';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';
export function NotificationProvider(props: PropsWithChildren) {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = useCallback(
    (title: string, message?: string, type?: NotificationType) => {
      type ??= 'info';

      api[type]({
        message: title,
        description: message,
      });
    },
    [api],
  );

  const value = useMemo<INotificationContext>(
    () => ({
      name: 'Weaver',
      showNotification,
    }),
    [showNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {props.children}
    </NotificationContext.Provider>
  );
}
