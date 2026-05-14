import { useContext, useEffect } from "react";
import { GraphContext, IGraphContext } from "../contexts/graph-context";
import { ChangeCallback } from "../providers/graph-provider";

export const useGraph = (callbacks?: ChangeCallback[]): IGraphContext => {
    const graphContext = useContext(GraphContext)

    useEffect(() => {
        callbacks?.forEach(c => {
            graphContext.addChangeListener(c.key, c.callback);
        })

        return () => {
            callbacks?.forEach(c => {
                graphContext.removeChangeListener(c.key, c.callback);
            })
        }
    }, [callbacks])

    return {
        ...graphContext
    }
};