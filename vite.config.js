import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "compression";

const gzip = !!process.env.GZIP;
const https = !!process.env.HTTPS;

const plugins = [react()];

if (gzip) {
  plugins.push({
    configureServer(server) {
      server.middlewares.use(compression());
    },
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  server: {
    https,
  },
});
