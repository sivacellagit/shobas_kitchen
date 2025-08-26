
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "stats.html",       // report file will be created in project root
          template: "treemap",          // options: sunburst | treemap | network
          gzipSize: true,
          brotliSize: true,
          open: true,                   // auto-open in browser after build
        }),
      ],
    },
  },
});


