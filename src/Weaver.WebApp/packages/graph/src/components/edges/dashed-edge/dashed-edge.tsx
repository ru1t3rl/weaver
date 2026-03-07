import {
    BaseEdge,
    Edge,
    EdgeProps,
    getSmoothStepPath
} from "@xyflow/react";
import { CSSProperties } from "react";

export type DashedEdgeData = {
    color?: string;
    selectedColor?: string;
    dashArray?: string;
    strokeWidth?: number;
    animationDuration?: number;
};

export const dashedEdge = 'dashedEdge';
export type DashedEdge = Edge<DashedEdgeData, 'dashedEdge'>;

const DEFAULT_COLOR = "#f2f2f2";
const DEFAULT_SELECTED_COLOR = "#6366f1";
const DEFAULT_DASH_ARRAY = "6 16";
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_ANIMATION_DURATION = 1;

export const DashedEdge = (props: EdgeProps<DashedEdge>) => {
    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        selected,
        data,
        markerEnd,
        style
    } = props;

    const baseColor = data?.color ?? DEFAULT_COLOR;
    const selectedColor = data?.selectedColor ?? DEFAULT_SELECTED_COLOR;
    const dashArray = data?.dashArray ?? DEFAULT_DASH_ARRAY;
    const strokeWidth = data?.strokeWidth ?? DEFAULT_STROKE_WIDTH;
    const animationDuration = data?.animationDuration ?? DEFAULT_ANIMATION_DURATION;
    const strokeColor = selected ? selectedColor : baseColor;

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const edgeStyle: CSSProperties = {
        ...style,
        stroke: strokeColor,
        strokeLinecap: 'round',
        strokeWidth,
        strokeDasharray: dashArray,
        transition: "stroke 0.25s ease, stroke-width 0.25s ease",
        ...(selected
            ? {
                animation: `dashedEdgeFlow ${animationDuration}s linear infinite`,
                filter: `drop-shadow(0 0 4px ${selectedColor}88)`,
            }
            : {}),
    };

    return (
        <>
            <style>
                {`
                  @keyframes dashedEdgeFlow {
                    from {
                      stroke-dashoffset: 24;
                    }
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                `}
            </style>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={edgeStyle}
            />
        </>
    );
}

export default DashedEdge;