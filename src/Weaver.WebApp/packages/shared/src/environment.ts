export const environment = {
    apiAddress: import.meta.env.services__webapi__http__0 ?? import.meta.env.VITE_API_ADDRESS,
    grpcAddress: process.env.services__CompletionGrpc__http__0 ?? import.meta.env.VITE_GRPC_ADDRESS
}