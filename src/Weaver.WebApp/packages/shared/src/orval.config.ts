export default {
    weaver: {
        input: {
            target: '../openapi.json',
        },
        output: {
            mode: 'split',
            namingConvention: 'kebab-case',
            client: 'react-query',
            prettier: true,
            workspace: './api',
            target: './endpoints',
            schemas: './models',
            fileExtensions: '.gen.ts'
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write',
        },
    }
}