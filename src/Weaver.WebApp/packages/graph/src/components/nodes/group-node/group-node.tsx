import { Node, NodeProps, NodeResizer } from "@xyflow/react";
import styles from './group-node.module.scss';

type GroupNodeData = {
    groupName: string;
}

export const groupNode = 'groupNode';
export type GroupNode = Node<GroupNodeData, 'groupNode'>;

export const GroupNode = (props: NodeProps<GroupNode>) => {
    const { data, selected } = props;

    return (
        <div className={styles['group-container']}>
            <NodeResizer
                minWidth={200}
                minHeight={150}
                isVisible={selected}
            />

            <div className={styles['group-title']}>
                {data.groupName}
            </div>
        </div>
    )
}