import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/some-shade-web-component/',
  plugins: [react()],
});
