import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: 'app/app.ts',
      output: {
        format: 'esm'
      }
    }
  }
});