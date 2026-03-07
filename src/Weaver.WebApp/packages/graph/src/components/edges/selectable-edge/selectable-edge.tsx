import { BaseEdge, getSmoothStepPath, type Edge, type EdgeProps } from "@xyflow/react";
import { useMemo } from "react";

type SelectableEdgeData = {
    color: string;
    selectedColor: string;
}

export const selectableEdge = 'selectableEdge';
export type SelectableEdge = Edge<SelectableEdgeData, 'selectableEdge'>;

export const SelectableEdge = (props: EdgeProps<SelectableEdge>) => {
    const { id, selected, sourceX, sourceY, targetX, targetY, data } = props;
    const { color, selectedColor } = data!;
    const markerId = `marker-${id}`;

    const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });
    const strokeColor = useMemo(() => selected ? selectedColor : color, [selected]);

    return <>
        <defs>
            <marker
                id={markerId}
                markerWidth="20"
                markerHeight="20"
                refX="10"
                refY="6"
                orient="auto"
                markerUnits="strokeWidth"
                z={selected ? 999 : 1}
            >
                <path d="M0,0 L0,12 L10,6 z" fill={strokeColor} />
            </marker>
        </defs>
        <BaseEdge
            path={edgePath}
            style={{ stroke: strokeColor }}
            markerEnd={`url(#${markerId})`}
        />
    </>;
}