import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,  // Add this option to suppress deprecation warnings
        },
      },
    },
    define: {
      'process.env': env,
      global: {},
    }
  }

});
