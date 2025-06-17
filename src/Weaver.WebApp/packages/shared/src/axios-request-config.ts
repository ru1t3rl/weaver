import { AxiosRequestConfig } from 'axios';
import { environment } from './environment';

export const apiRequestConfig: AxiosRequestConfig = {
  baseURL: environment.apiAddress,
};
