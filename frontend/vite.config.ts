import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compilerEndpoint } from "./src/lib/compilerProtocol.ts";
import { handleCompiler } from "./compiler/api.ts";
import type { Plugin } from "vite";

const compilerMiddleware: Plugin = {
  name: "devafrica-compiler",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split("?")[0] === compilerEndpoint) {
        void handleCompiler(request, response);
      } else next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url?.split("?")[0] === compilerEndpoint) {
        void handleCompiler(request, response);
      } else next();
    });
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), compilerMiddleware],
  server: {
    proxy: { "/api": { target: "http://127.0.0.1:8000", changeOrigin: true } },
  },
});
