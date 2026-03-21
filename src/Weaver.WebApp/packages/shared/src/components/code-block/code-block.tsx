import { useTheme } from '@weaver/styling';
import { Card, Typography } from 'antd';
import { CardStylesType } from 'antd/es/card/Card';
import { LuCode } from 'react-icons/lu';
import styles from './code-block.module.scss';

type Width = `${number}dvw` | `${number}vw` | `${number}px` | `${number}%` | number;
type Height = `${number}dvh` | `${number}vh` | `${number}px` | `${number}%` | number;

interface CodeBlockProps {
  title: string;
  content: string;
  width?: Width;
  height?: Height;
  className?: string;
  style?: CardStylesType;
}

export const CodeBlock: React.FC<CodeBlockProps> = (props: CodeBlockProps) => {
  const { title, content, height = '400px', width = '50vw', className, style } = props;
  const lines = content.split('\n');
  const { theme } = useTheme();

  return (
    <Card
      className={className}
      styles={{
        body: {
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          width: width
        },
        ...style,
      }}
    >
      <div
        className={styles['gutter']}
        style={{
          backgroundColor: theme.token?.colorFillTertiary,
        }}
      >
        <div
          className={styles['tab']}
          style={{
            backgroundColor: theme.token?.colorBgElevated,
            borderBottom: `2px solid ${theme.token?.colorPrimary}`,
          }}
        >
          <LuCode />
          <Typography.Text>{title}</Typography.Text>
        </div>
      </div>
      <div className={styles['code-body']} style={{ height: height }}>
        <div
          className={styles['code-gutter']}
        >
          {lines.map((_, i) => {
            const lineNumber = i + 1;
            const highlight = i === 0;
            return (
              <div
                key={lineNumber}
                className={styles['code-line-number']}
                style={{
                  backgroundColor: highlight ? theme.token?.colorErrorBg : theme.token?.colorFillTertiary,
                }}
              >
                <Typography.Paragraph
                  className={styles['code-line-number-text']}
                  style={{
                    color: highlight ? theme.token?.colorError : theme.token?.colorTextQuaternary,
                  }}
                >
                  {lineNumber}
                </Typography.Paragraph>
              </div>
            );
          })}
        </div>
        <div
          className={styles['code-content']}
        >
          {lines.map((line, i) => {
            const lineNumber = i + 1;
            const highlight = i === 0;
            return (
              <div
                key={lineNumber}
                className={styles['code-line-content']}
                style={{
                  backgroundColor: highlight ? theme.token?.colorErrorBg : 'transparent',
                }}
              >
                <Typography.Paragraph
                  className={styles['code-line-content-text']}
                  style={{
                    color: highlight ? theme.token?.colorError : theme.token?.colorTextSecondary,
                  }}
                >
                  {line || ' '}
                </Typography.Paragraph>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default CodeBlock;