import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServiceWorkerPlugin from "./plugin";
// import compression from "compression";
// import compress from 'vite-plugin-compress';

const gzip = !!process.env.GZIP;
const https = !!process.env.HTTPS;

const plugins = [devServiceWorkerPlugin(), react()];

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
