import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ServiceSearchModal } from '../components/modals';
import {
  IServiceTemplateSearchModalContext,
  ServiceTemplateSearchModalContext,
} from '../contexts/service-template-search-modal-context';

interface Keybinding {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

interface ServiceSearchModalProviderProps {
  keybinding: Keybinding;
}

export function ServiceTemplateSearchModalProvider(props: ServiceSearchModalProviderProps & PropsWithChildren) {
  const { keybinding, children } = props;
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === keybinding.key.toLowerCase();
      const ctrlMatches = keybinding.ctrl ? event.ctrlKey : true;
      const shiftMatches = keybinding.shift ? event.shiftKey : true;
      const altMatches = keybinding.alt ? event.altKey : true;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        toggle();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keybinding, toggle]);

  function show() {
    setOpen(true);
  }

  function hide() {
    setOpen(false);
  }

  const value: IServiceTemplateSearchModalContext = {
    show,
    hide,
    toggle,
  };

  return (
    <ServiceTemplateSearchModalContext.Provider value={value}>
      {open && <ServiceSearchModal />}
      {children}
    </ServiceTemplateSearchModalContext.Provider>
  );
}
