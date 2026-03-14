import { useContext } from "react";
import { InspectorContext } from "../contexts/inspector-context";

type UseInspector = InspectorContext;
export const useInspector = (): UseInspector => {
    const context = useContext(InspectorContext);

    return {
        ...context
    }
}