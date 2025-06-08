import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react-swc'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
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
        resolve: {
            alias: {                
                util: require.resolve("util"),
            }
        },
        plugins: [react(), monacoEditorPlugin({})],    
    }
});
