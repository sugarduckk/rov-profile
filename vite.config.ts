import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/rov-profile/', // Replace with your repository name
  build: {
    outDir: 'dist',
  },
});