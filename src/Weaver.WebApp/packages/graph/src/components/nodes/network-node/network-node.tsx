import { Node, NodeProps, NodeResizer, useNodesInitialized, useReactFlow, useStore } from '@xyflow/react';
import { Card, Tag, theme, Typography } from 'antd';
import { memo, useEffect, useMemo } from 'react';
import { useGraphRef } from '../../../hooks/use-graph-ref';
import styles from './network-node.module.scss';

const { useToken } = theme;

const DRIVER_COLOR: Record<string, string> = {
  bridge:  'cyan',
  host:    'orange',
  overlay: 'purple',
  macvlan: 'green',
  none:    'default',
};

const PADDING = 100;
const HEADER_HEIGHT = 64;

export type DockerNetworkDriver = 'bridge' | 'host' | 'overlay' | 'macvlan' | 'none' | string;
export type DockerNetworkModel = {
  networkId: string;
  name: string;
  driver: DockerNetworkDriver;
  subnet?: string;
  gateway?: string;
  internal?: boolean;
  ipv6?: boolean;
};

export type DockerNetworkNodeData = {
  model: DockerNetworkModel;
  onClick?: () => void;
};

export const dockerNetworkNode = 'dockerNetworkNode';
export type DockerNetworkNode = Node<DockerNetworkNodeData, 'dockerNetworkNode'>;

export const DockerNetworkNode = memo((props: NodeProps<DockerNetworkNode>) => {
  const { data, selected, id } = props;
  const { model, onClick } = data;
  const { token } = useToken();
  const { updateNode } = useGraphRef();
  const { getNodesBounds } = useReactFlow();
  const initialized = useNodesInitialized();

  const children = useStore((s) => s.nodes.filter((n) => n.parentId === id));
  const childCount = useMemo(() => children.length, [children]);

  useEffect(() => {
    if (!initialized || children.length === 0) return;

    // bounds.x/y is the top-left corner of the tightest box around all children,
    // expressed in the parent's local coordinate space.
    const bounds = getNodesBounds(children);

    const shiftX = PADDING / 2 - bounds.x;
    const shiftY = PADDING / 2  + HEADER_HEIGHT - bounds.y;

    const targetW = bounds.width  + PADDING * 2;
    const targetH = bounds.height + PADDING * 2 + HEADER_HEIGHT * 2;

    if (shiftX === 0 && shiftY === 0 && targetW === props.width && targetH === props.height) return;

    updateNode(id, { width: targetW, height: targetH });

    async function delayed() {
      children.forEach((child) => {
        updateNode(child.id, (node) => ({
          position: {
            x: node.position.x + shiftX/2,
            y: node.position.y + shiftY/2 + HEADER_HEIGHT,
          },
        }));
      });

      await new Promise(r => setTimeout(r, 1000));
      children.forEach((child) => {
        updateNode(child.id, { extent: 'parent' });
      });
    }

    delayed();
  }, [initialized, id]);

  const borderColor = selected ? token.colorPrimary : token.colorBorderSecondary;

  return (
    <Card
      className={`${styles.wrapper} ${selected ? styles.selected : ''}`}
      style={{
        '--border-color': borderColor,
        '--bg-color': token.colorBgContainer,
        '--bg-header': token.colorBgElevated,
        '--bg-meta': token.colorFillQuaternary,
        '--dot-color': token.colorBorderSecondary,
        '--shadow-color': token.colorPrimaryBorder,
      } as React.CSSProperties}
      styles={{
        body: { padding: 0, height: '100%' },
      }}
      onClick={onClick}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={260}
        minHeight={180}
        lineStyle={{
          stroke: token.colorPrimary,
          strokeWidth: 1.5,
          strokeDasharray: '4 3',
        }}
        handleStyle={{
          background: token.colorPrimary,
          border: 'none',
          borderRadius: token.borderRadiusSM,
          width: 8,
          height: 8,
        }}
      />

      <span className={`${styles.corner} ${styles.tl}`} aria-hidden />
      <span className={`${styles.corner} ${styles.tr}`} aria-hidden />
      <span className={`${styles.corner} ${styles.bl}`} aria-hidden />
      <span className={`${styles.corner} ${styles.br}`} aria-hidden />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <NetworkIcon driver={model.driver} token={token} />
          <Typography.Title level={5} className={styles.networkName}>
            {model.name.split('_')[1]}
          </Typography.Title>
        </div>
        <div className={styles.headerRight}>
          {model.internal && <Tag color="warning">internal</Tag>}
          {model.ipv6 && <Tag color="processing">ipv6</Tag>}
          <Tag color={DRIVER_COLOR[model.driver] ?? 'default'}>{model.driver}</Tag>
        </div>
      </header>

      <div className={styles.meta}>
        <MetaItem icon="⬡" label="id"         value={model.networkId.slice(0, 12)} />
        {model.subnet  && <MetaItem icon="⊟" label="subnet"     value={model.subnet} />}
        {model.gateway && <MetaItem icon="⇥" label="gateway"    value={model.gateway} />}
        <MetaItem icon="⬡" label="containers" value={String(childCount)} />
      </div>

      <div className={styles.body} />
    </Card>
  );
});

DockerNetworkNode.displayName = 'DockerNetworkNode';

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function NetworkIcon({ driver, token }: { driver: string; token: ReturnType<typeof useToken>['token'] }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.icon}>
      <circle cx="8" cy="8" r="7" stroke={token.colorPrimary} strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3" fill={token.colorPrimary} fillOpacity="0.25" stroke={token.colorPrimary} strokeWidth="1" />
      {driver === 'overlay' && (
        <circle cx="8" cy="8" r="5.5" stroke={token.colorPrimary} strokeWidth="0.6" strokeDasharray="2 2" />
      )}
      {driver === 'host' && (
        <line x1="1" y1="8" x2="15" y2="8" stroke={token.colorPrimary} strokeWidth="1" />
      )}
    </svg>
  );
}

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <Typography.Text type="secondary" className={styles.metaLabel}>{label}</Typography.Text>
      <Typography.Text strong className={styles.metaValue}>{value}</Typography.Text>
    </div>
  );
}