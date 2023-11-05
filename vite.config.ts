/// <reference types="vitest" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
      includeSource: ['src/**/*.{jsx,tsx,js,ts}'],
      globals: true,
      environment: 'jsdom',
    },
    server: {
      port: +process.env.VITE_PORT,
    },
  });
};
