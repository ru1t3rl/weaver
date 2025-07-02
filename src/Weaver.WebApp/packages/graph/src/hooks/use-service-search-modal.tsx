import {useContext} from "react";
import {ServiceSearchModalContext} from "../contexts/service-search-modal-context";

export const useServiceSearchModal = () => useContext(ServiceSearchModalContext);