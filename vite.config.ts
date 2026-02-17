import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { VitePWA } from "vite-plugin-pwa";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import compression from "vite-plugin-compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "strip-data-modulepreload",
      apply: "build",
      transformIndexHtml(html: string) {
        return html.replace(
          /<link\s+rel="modulepreload"\s+href="data:application\/octet-stream[^"]*"\s*\/?>/g,
          "",
        );
      },
    },
    {
      name: "force-lucide-single-chunk",
      outputOptions(output: any) {
        const original = output.manualChunks;

        output.manualChunks = (id: any, meta: any) => {
          if (id && id.includes("node_modules/lucide-react/")) {
            return "icons";
          }

          if (original && typeof original === "object") {
            for (const [name, pkgs] of Object.entries(original)) {
              if (
                Array.isArray(pkgs) &&
                pkgs.some(pkg =>
                  id.includes(`node_modules/${pkg.replace(/\\/g, "/")}`),
                )
              ) {
                return name;
              }
            }
            return null;
          }

          if (typeof original === "function") {
            return original(id, meta);
          }

          return null;
        };

        return output;
      },
    },
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: false,
    }),
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
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
        globIgnores: ["**/sw.js", "**/404.html"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
    }),
    compression({ algorithm: "gzip", threshold: 1024 }),
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
      onwarn: () => undefined,
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "@tanstack/react-query",
            "@tanstack/react-router",
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
            "zustand",
            "immer",
            "lucide-react",
            "@dexhunterio/swaps",
            "cmdk",
            "sonner",
            "html-react-parser",
            "qrcode.react",
            "i18next",
            "react-i18next",
            "react-hotkeys-hook",
            "shadcn-ui",
          ],
          ui: [
            "@xyflow/react",
            "@vellumlabs/cexplorer-sdk",
            "embla-carousel-autoplay",
            "embla-carousel-react",
          ],
          cardano: [
            "@emurgo/cip14-js",
            "@meshsdk/core",
            "bech32",
            "blake2b",
            "blakejs",
            "bs58",
            "buffer",
            "@nufi/dapp-client-cardano",
            "@nufi/dapp-client-core",
            "@nufi/sso-button-react",
            "@harmoniclabs/uplc",
            "@harmoniclabs/pair",
            "@harmoniclabs/cbor",
            "@harmoniclabs/bytestring",
            "@harmoniclabs/uint8array-utils",
            "@harmoniclabs/plutus-data",
          ],
          charts: ["echarts", "echarts-stat", "echarts-for-react"],
          utils: [
            "html-to-image",
            "flatted",
            "format",
            "zod",
            "react-markdown",
            "remark-gfm",
            "rehype-raw",
            "react-syntax-highlighter",
            "query-string",
            "date-fns",
            "@date-fns/tz",
            "react-grid-layout",
            "react-window",
            "react-resizable",
            "react-device-detect",
            "react-day-picker",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "react-helmet",
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@meshsdk/core", "lodash", "lodash/isEqual"],
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
    dedupe: [
      "@tanstack/react-router",
      "@tanstack/router-core",
      "@tanstack/react-store",
      "@tanstack/history",
    ],
  },
  server: {
    port: 3001,
  },
});
