import { ReactNode, createContext, RefObject } from "react";

export interface InspectorContext {
    show: (key: string, id: string) => void;
    hide: () => void;
    tryRegister: (key: string, element: ReactNode) => boolean;
    tryUnregister: (key: string) => boolean;
    activeId: RefObject<string | null>;
}

export const InspectorContext = createContext<InspectorContext>({
    show: (): void => undefined,
    hide: (): void => undefined,
    tryRegister: (): boolean => false,
    tryUnregister: (): boolean => false,
    activeId: { current: null }
})