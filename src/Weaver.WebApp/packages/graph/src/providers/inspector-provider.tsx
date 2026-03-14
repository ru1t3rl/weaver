import { PropsWithChildren, ReactNode, useCallback, useRef, useState } from "react";
import { Inspector } from "../components/utils/inspector/inspector";
import { InspectorContext } from "../contexts/inspector-context";

export const InspectorProvider = (props: PropsWithChildren) => {
    const { children } = props;
    const components = useRef<Record<string, ReactNode>>({});
    const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const keyExists = useCallback((key: string): boolean => {
        const keys = Object.keys(components.current);
        return !(!keys.find(k => k === key));
    }, []);

    const show = useCallback((key: string, id: string) => {
        if (!keyExists(key)) return;

        setActiveComponent(components.current[key])
        setActiveId(id);
    }, [keyExists]);

    const hide = useCallback(() => {
        setActiveComponent(null)
        setActiveId(null);
    }, []);

    const tryRegister = useCallback((key: string, element: ReactNode): boolean => {
        if (keyExists(key)) return false;

        components.current[key] = element;
        return true;
    }, [keyExists]);

    const tryUnregister = useCallback((key: string): boolean => {
        if (!keyExists(key)) return false;

        delete components.current[key];
        return true;
    }, [keyExists]);

    const value: InspectorContext = {
        show,
        hide,
        tryRegister,
        tryUnregister,
        activeId
    }

    return (
        <InspectorContext.Provider value={value}>
            {activeComponent && (
                <Inspector>
                    {activeComponent}
                </Inspector>
            )}
            {children}
        </InspectorContext.Provider>
    );
}