import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@components': path.resolve(__dirname, './src/core/components'),
      '@services': path.resolve(__dirname, './src/core/services'),
      '@hooks': path.resolve(__dirname, './src/core/hooks'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@agricola': path.resolve(__dirname, './src/modules/Agricola'),
      '@florestal': path.resolve(__dirname, './src/modules/Florestal'),
      '@layout': path.resolve(__dirname, './src/Layout'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});