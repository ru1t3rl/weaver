import { PropsWithChildren, ReactNode, useCallback, useRef, useState } from "react";
import { Inspector } from "../components/utils/inspector/inspector";
import { InspectorContext } from "../contexts/inspector-context";
import { LuX } from 'react-icons/lu';
import { Button } from "antd";

export const InspectorProvider = (props: PropsWithChildren) => {
    const { children } = props;
    const components = useRef<Record<string, ReactNode>>({});
    const [activeComponent, setActiveComponent] = useState<ReactNode | null>(null);

    const activeId = useRef<string | null>(null);

    const keyExists = useCallback((key: string): boolean => {
        const keys = Object.keys(components.current);
        return !(!keys.find(k => k === key));
    }, []);

    const show = useCallback((key: string, id: string) => {
        if (!keyExists(key)) return;

        activeId.current = id;
        setActiveComponent(components.current[key])
    }, [keyExists]);

    const hide = useCallback(() => {
        activeId.current = null;
        setActiveComponent(null)
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
                    <Button onClick={hide} icon={<LuX />} style={{position: 'absolute', top: '1.25rem', right: '1.25rem'}} />
                    {activeComponent}
                </Inspector>
            )}
            {children}
        </InspectorContext.Provider>
    );
}