import { useContext } from "react";
import { GraphContext, IGraphContext } from "../contexts/graph-context";

export const useGraph = (): IGraphContext => useContext(GraphContext);