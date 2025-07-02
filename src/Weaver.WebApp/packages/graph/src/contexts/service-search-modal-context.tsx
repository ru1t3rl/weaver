import {createContext} from "react";

export interface IServiceSearchModalContext {
    show: () => void;
    toggle: () => void;
    hide: () => void;
}

export const ServiceSearchModalContext = createContext<IServiceSearchModalContext>({
    show: (): void => undefined,
    toggle: (): void => undefined,
    hide: (): void => undefined,   
})