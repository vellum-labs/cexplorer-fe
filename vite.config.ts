import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { VitePWA } from "vite-plugin-pwa";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
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
      writeBundle() {
        setTimeout(() => {
          process.exit(0);
        }, 20000);
      },
    },
  ],
  build: {
    target: "ESNext",
    sourcemap: false,
    rollupOptions: {
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
            "@date-fns/tz",
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
            "@emurgo/cip14-js",
            "@lucid-evolution/lucid",
            "bech32",
            "blake2b",
            "blakejs",
            "bs58",
            "buffer",
            "@nufi/dapp-client-cardano",
            "@nufi/dapp-client-core",
            "@nufi/sso-button-react",
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
    include: ["@lucid-evolution/lucid"],
    exclude: [
      "@anastasia-labs/cardano-multiplatform-lib-browser",
      "@anastasia-labs/cardano-multiplatform-lib-nodejs",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@anastasia-labs/cardano-multiplatform-lib-nodejs":
        "@anastasia-labs/cardano-multiplatform-lib-browser",
    },
  },
  server: {
    port: 3001,
  },
});
