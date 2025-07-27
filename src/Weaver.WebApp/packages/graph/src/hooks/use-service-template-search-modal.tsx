import { useContext } from 'react';
import { ServiceTemplateSearchModalContext } from '../contexts/service-template-search-modal-context';

export const useServiceTemplateSearchModal = () => useContext(ServiceTemplateSearchModalContext);
