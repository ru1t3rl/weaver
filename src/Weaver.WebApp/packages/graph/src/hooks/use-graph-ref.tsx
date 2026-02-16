import { useContext } from "react";
import { GraphContextRef, IGraphContextRef } from "../contexts/graph-context-ref";

export const useGraphRef = (): IGraphContextRef => useContext(GraphContextRef);