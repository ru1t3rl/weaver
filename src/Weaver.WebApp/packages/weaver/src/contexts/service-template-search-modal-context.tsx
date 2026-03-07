import { createContext } from 'react';

export interface IServiceTemplateSearchModalContext {
  show: () => void;
  toggle: () => void;
  hide: () => void;
}

export const ServiceTemplateSearchModalContext = createContext<IServiceTemplateSearchModalContext>({
  show: (): void => undefined,
  toggle: (): void => undefined,
  hide: (): void => undefined,
});
