import { useTheme } from '@weaver/styling';

export const BlinkingCursor: React.FC = () => {
  const { theme } = useTheme();

  return (
    <span
      aria-hidden='true'
      style={{
        display: 'inline',
        width: 2,
        height: '0.9em',
        backgroundColor: theme.token?.colorText,
        marginLeft: 3,
        verticalAlign: 'text-bottom',
        animation: 'cb-cursor 1.1s step-end infinite',
      }}
    />
  );
};

export default BlinkingCursor;
