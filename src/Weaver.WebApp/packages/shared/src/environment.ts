export const environment = {
    apiAddress: process.env.services__webapi__http__0 ?? import.meta.env.VITE_API_ADDRESS,
    dockerApiAddress: process.env.services__docker_webapi__http__0 ?? import.meta.env.VITE_DOCKER_API_ADDRESS
}