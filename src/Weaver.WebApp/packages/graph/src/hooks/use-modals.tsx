import { useContext } from 'react';
import { ModalsContext } from '../contexts';
import { useServiceSearchModal } from './use-service-search-modal';

interface UseModals {
  showCreateServiceTemplate: () => void;
  showAddServiceTemplate: () => void;
}

export function useModals(): UseModals {
  const { openCreateTemplateModal: showCreateServiceTemplate } = useContext(ModalsContext);
  const { show: showAddServiceTemplate } = useServiceSearchModal();

  return {
    showCreateServiceTemplate,
    showAddServiceTemplate,
  };
}
