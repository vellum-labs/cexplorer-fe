import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: false,
    }),
    react(),
    topLevelAwait(),
    wasm(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      injectRegister: false,
      registerType: "prompt",
      manifest: {
        name: "Cexplorer.io",
        short_name: "Cexplorer",
        description: "Cardano Blockchain Explorer.",
        start_url: "/",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,woff2,ttf,wasm}"],
        globIgnores: ["**/sw.js"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
    }),
    {
      name: "force-exit",
      closeBundle() {
        setTimeout(() => process.exit(0), 1000);
      },
    },
  ],
  build: {
    target: "es2020",
    rollupOptions: {
      external: [
        "node",
        "node-fetch",
        "fs",
        "path",
        "util",
        "crypto",
        "process",
      ],
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "@tanstack/react-query",
            "@tanstack/react-router",
            "zustand",
            "immer",
            "query-string",
            "date-fns",
          ],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-icons",
            "lucide-react",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "cmdk",
          ],
          cardano: [
            "lucid-cardano",
            "@emurgo/cip14-js",
            "bech32",
            "blake2b",
            "blakejs",
            "bs58",
            "buffer",
            "@nufi/dapp-client-cardano",
            "@nufi/dapp-client-core",
          ],
          charts: ["echarts", "echarts-for-react", "echarts-stat"],
          utils: [
            "html-react-parser",
            "react-markdown",
            "remark-gfm",
            "react-syntax-highlighter",
            "html-to-image",
            "qrcode.react",
            "react-helmet",
            "helmet",
            "flatted",
          ],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
    exclude: ["lucid-cardano"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3001,
  },
});
