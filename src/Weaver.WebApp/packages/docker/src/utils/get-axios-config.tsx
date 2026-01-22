
export function AxiosConfig(address: string, method: string) {
    return {
        axios: {
            baseURL: address,
            method: method
        }
    }
}