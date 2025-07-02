import {AxiosRequestConfig} from "axios";
import {environment} from "./environment";

const axiosRequestConfigBase: AxiosRequestConfig = {
    baseURL: environment.apiAddress
} 

export const axiosGetRequestConfig: AxiosRequestConfig = {
    ...axiosRequestConfigBase,
    method: 'get'
}

export const axiosPostRequestConfig: AxiosRequestConfig = {
    ...axiosRequestConfigBase,
    method: 'post'
} 