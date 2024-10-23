import { defineConfig } from 'vitest/config'; // Import from 'vitest/config'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./src/test/setup.ts'], 
    environment: 'jsdom', 
  },
});
