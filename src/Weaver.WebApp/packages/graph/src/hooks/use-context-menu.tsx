import { JSX, useContext } from "react";
import { ContextMenuContext } from "../contexts/context-menu-context";

export interface ContextMenuItem {
    icon?: JSX.Element;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

interface UseContextMenu {
    show: (x: number, y: number) => void;
    close: () => void;
    registerPersistent: (items: ContextMenuItem[]) => () => void;
}

export const useContextMenu = (items?: ContextMenuItem[]): UseContextMenu => {
    const context = useContext(ContextMenuContext);

    if (!context) {
        throw Error('The context menu hook has been used outside of a valid context');
    }

    const { show, close, register } = context;

    return {
        show: (x: number, y: number) => show(x, y, items ?? []),
        close,
        registerPersistent: register
    }
}