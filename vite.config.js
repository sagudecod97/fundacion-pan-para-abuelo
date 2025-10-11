import { defineConfig } from "vite";
import { resolve } from "path";

console.log(__dirname, resolve(__dirname, "src/pages/about.html"));
export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "src/pages/about-us.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    open: true,
    port: 5173,
  },
});
