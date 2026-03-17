import babelPlugin from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import BabelPluginReactCompiler from 'babel-plugin-react-compiler';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env': env,
    },
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 4200,
      host: 'localhost',
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [
      react(),
      BabelPluginReactCompiler(
        reactCompilerPreset({

        })
      )
    ]
  };
});
