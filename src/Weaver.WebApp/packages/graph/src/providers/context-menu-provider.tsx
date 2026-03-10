import { PropsWithChildren, useState, useCallback, useRef } from "react";
import { ContextMenuContext } from "../contexts/context-menu-context";
import { ContextMenuItem } from "../hooks/use-context-menu";
import { ContextMenu } from "../components/utils/context- menu";

export interface ContextMenuState {
  position: { x: number; y: number } | null;
  items: ContextMenuItem[];
}

export function ContextMenuProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ContextMenuState>({ position: null, items: [] });
  const registeredItems = useRef<ContextMenuItem[]>([]);

  const show = useCallback((x: number, y: number, items: ContextMenuItem[]) => {
    setState({ position: { x, y }, items: [...registeredItems.current, ...items] });
  }, [registeredItems]);

  const close = useCallback(() => {
    setState({ position: null, items: [] });
  }, []);

  const register = useCallback((items: ContextMenuItem[]) => {
    const x = [...new Set(items.map(i => i.label).concat(registeredItems.current.map(i => i.label)))];
    const uniqueListener = x.map(x =>
      registeredItems.current.find(r => r.label === x) ?? items.find(i => i.label === x)
    ).filter(i => i !== undefined);

    registeredItems.current = uniqueListener;
    return () => registeredItems.current = registeredItems.current.filter(i => !items.includes(i));
  }, []);

  return (
    <ContextMenuContext.Provider value={{ show, close, register }}>
        {children}
        <ContextMenu state={state} onClose={close} />
    </ContextMenuContext.Provider>
  );
}