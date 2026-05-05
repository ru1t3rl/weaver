import { useContext, useEffect } from "react";
import { GraphContextRef, IGraphContextRef } from "../contexts/graph-context-ref";
import { ChangeCallback } from "../providers/graph-provider-ref";

export const useGraphRf = (callbacks?: ChangeCallback[]): IGraphContextRef => {
    const graphContext = useContext(GraphContextRef)

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