
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { compilerEndpoint } from "./src/lib/compilerProtocol.ts";
import { handleCompiler } from "./compiler/api.ts";

// Middleware pour l'exécution du code dans DevAfrica
const compilerMiddleware: Plugin = {
  name: "devafrica-compiler",

  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split("?")[0] === compilerEndpoint) {
        void handleCompiler(request, response);
      } else {
        next();
      }
    });
  },

  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split("?")[0] === compilerEndpoint) {
        void handleCompiler(request, response);
      } else {
        next();
      }
    });
  },
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compilerMiddleware,
  ],

  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,

    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
