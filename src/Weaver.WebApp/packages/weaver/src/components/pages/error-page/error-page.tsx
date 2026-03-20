import { useTheme } from '@weaver/styling';
import { Button, Divider, Typography } from 'antd';
import { LuRefreshCw } from 'react-icons/lu';
import { useRouteError } from 'react-router-dom';
import useErrorDetail from '../../../hooks/use-error-detail';
import CodeBlock from '../../code-block/code-block';
import LostIcon from '../../icons/lost-icon/lost-icon';
import styles from './error-page.module.scss';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const { theme } = useTheme();

  const { title, subtitle, message, stack } = useErrorDetail(error);

  return (
    <div className={styles['container-page']} style={{ backgroundColor: theme.token?.colorBgLayout }}>
      <div className={styles['container-content']}>
        <LostIcon />
        <Typography.Title level={3}>{title}</Typography.Title>
        <Typography.Text>{subtitle}</Typography.Text>
        <div style={{ height: '2vh' }} />
        <Button icon={<LuRefreshCw />} onClick={window.location.reload}>
          Refresh Page
        </Button>
        <div style={{ height: '5vh' }} />
        <div className={styles['detail-container']}>
          <Divider>Details</Divider>
          <CodeBlock title='Error' content={`${message}\n${stack}`} />
        </div>
      </div>
    </div>
  );
};
