export default {
  weaver: {
    input: {
      target: '../openapi.json',
    },
    output: {
      mode: 'tags',
      namingConvention: 'kebab-case',
      client: 'react-query',
      prettier: true,
      workspace: './api',
      target: './endpoints',
      schemas: './models',
      fileExtensions: '.gen.ts',
      indexFiles: true,
      clean: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};
