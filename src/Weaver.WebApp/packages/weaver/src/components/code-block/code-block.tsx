import { Card, Typography } from 'antd';
import { LuCode } from 'react-icons/lu';
import BlinkingCursor from './blinking-cursor';
import styles from './code-block.module.scss';
import { useTheme } from '@weaver/styling';

interface CodeBlockProps {
  title: string;
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = (props: CodeBlockProps) => {
  const { title, content, className, style } = props;
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
      <div className={styles['code-body']}>
        <table className={styles['code-table']}>
          <colgroup>
            <col width={48} />
            <col width={'auto'}/>
          </colgroup>
          <tbody>
            {lines.map((line, i) => {
              const lineNumber = i + 1;
              const highlight = i === 0;
              
              return (
                <tr
                  key={lineNumber}
                  className={styles['code-line']}
                  style={{
                    background: highlight ? theme.token?.colorErrorBg : 'transparent',
                  }}
                >
                  <td
                    className={styles['code-line-number']}
                    style={{
                      background: theme.token?.colorFillTertiary,
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
                  </td>
                  <td
                    className={styles['code-line-content']}
                    style={{
                      backgroundColor: theme.token?.colorBgSpotlight,
                    }}
                  >
                    <Typography.Paragraph
                      className={styles['code-line-content-text']}
                      style={{
                        color: highlight ? theme.token?.colorError : theme.token?.colorTextSecondary,
                      }}
                    >
                      {line || ' '}
                      {highlight && <BlinkingCursor />}
                    </Typography.Paragraph>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CodeBlock;
