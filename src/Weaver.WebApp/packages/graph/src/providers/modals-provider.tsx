import { PropsWithChildren, useState } from 'react';
import { CreateTemplateModal } from '../components/modals';
import { IModalsContext, ModalsContext } from '../contexts';
import { ServiceTemplateSearchModalProvider } from './service-template-search-modal-provider';

export function ModalsProvider(props: PropsWithChildren) {
  const [createTemplateOpen, setCreateTemplateOpen] = useState<boolean>(false);

  function openCreateTemplateModal() {
    setCreateTemplateOpen(true);
  }

  const value: IModalsContext = {
    openCreateTemplateModal,
  };

  return (
    <ModalsContext.Provider value={value}>
      <ServiceTemplateSearchModalProvider
        keybinding={{
          key: ' ',
          ctrl: true,
        }}
      >
        <CreateTemplateModal open={createTemplateOpen} onCancel={() => setCreateTemplateOpen(false)} />
        {props.children}
      </ServiceTemplateSearchModalProvider>
    </ModalsContext.Provider>
  );
}
