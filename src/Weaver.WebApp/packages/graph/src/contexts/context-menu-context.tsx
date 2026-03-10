import { createContext } from "react";
import { ContextMenuItem } from "../hooks/use-context-menu";

interface ContextMenuContextValue {
    show: (x: number, y: number, items: ContextMenuItem[]) => void;
    close: () => void;
    register: (items: ContextMenuItem[]) => () => void;
}

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);