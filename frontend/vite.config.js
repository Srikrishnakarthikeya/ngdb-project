import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (error, _request, response) => {
            if (response && !response.headersSent) {
              response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            if (response && !response.writableEnded) {
              response.end(JSON.stringify({ error: 'Backend unavailable. Start the backend on port 5000.' }));
            }
          });
        }
      }
    }
  }
});
