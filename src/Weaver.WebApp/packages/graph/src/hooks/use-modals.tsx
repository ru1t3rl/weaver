import { useContext } from 'react';
import { ModalsContext } from '../contexts';
import { useServiceTemplateSearchModal } from './use-service-template-search-modal';

interface UseModals {
  showCreateServiceTemplate: () => void;
  showAddServiceTemplate: () => void;
}

export function useModals(): UseModals {
  const { openCreateTemplateModal: showCreateServiceTemplate } = useContext(ModalsContext);
  const { show: showAddServiceTemplate } = useServiceTemplateSearchModal();

  return {
    showCreateServiceTemplate,
    showAddServiceTemplate,
  };
}
