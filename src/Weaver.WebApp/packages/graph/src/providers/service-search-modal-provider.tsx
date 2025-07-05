import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ServiceSearchModal } from '../components/service-search-modal/service-search-modal';
import { IServiceSearchModalContext, ServiceSearchModalContext } from '../contexts/service-search-modal-context';

interface Keybinding {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

interface ServiceSearchModalProviderProps {
  keybinding: Keybinding;
}

export function ServiceSearchModalProvider(props: ServiceSearchModalProviderProps & PropsWithChildren) {
  const { keybinding, children } = props;
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === keybinding.key.toLowerCase();
      const ctrlMatches = event.ctrlKey === keybinding.ctrl;
      const shiftMatches = event.shiftKey === keybinding.shift;
      const altMatches = event.altKey === keybinding.alt;

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

  const value: IServiceSearchModalContext = {
    show,
    hide,
    toggle,
  };

  return (
    <ServiceSearchModalContext.Provider value={value}>
      {open && <ServiceSearchModal />}
      {children}
    </ServiceSearchModalContext.Provider>
  );
}
