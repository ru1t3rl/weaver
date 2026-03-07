import { createContext } from 'react';

export interface IModalsContext {
  openCreateTemplateModal: () => void;
}

export const ModalsContext = createContext<IModalsContext>({
  openCreateTemplateModal: (): void => undefined,
});
