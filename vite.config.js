import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import injectHtml from "vite-plugin-html-inject";

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
  plugins: [
    injectHtml({
      injectData: {
        icons: fs.readFileSync("src/assets/icons/icons-sprite.svg", "utf8"),
      },
    }),
  ],
});
