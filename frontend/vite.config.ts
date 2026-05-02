import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      // This routes any call starting with /api to your Express server
      '/api': {
        target: 'http://localhost:5000', // Matches the port in backend/server.js
        changeOrigin: true,
      },
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});