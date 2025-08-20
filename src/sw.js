import { clientsClaim, cacheNames } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

self.skipWaiting();
clientsClaim();

const PRECACHE_CACHE_NAME = cacheNames.precache;

const PRECACHE_MANIFEST = self.__WB_MANIFEST || [];
const PRECACHE_FILES = PRECACHE_MANIFEST.filter(entry => 
  entry.url !== "sw.js" && !entry.url.includes("force-clear")
);

precacheAndRoute(PRECACHE_FILES);

self.addEventListener("activate", event => {
  const currentCaches = [
    PRECACHE_CACHE_NAME,
    "html-cache",
    "wasm-files",
    "images",
    "static-resources",
    "google-fonts-stylesheets",
    "google-fonts-webfonts",
    "preloader",
    "api-cache",
  ];

  event.waitUntil(
    (async () => {
      try {
        if (!("caches" in self)) {
          console.warn("Cache API is not available in this environment.");
          return;
        }

        const existingCacheNames = await caches.keys();

        await Promise.all(
          existingCacheNames
            .filter(cacheName => !currentCaches.includes(cacheName))
            .map(cacheName => caches.delete(cacheName)),
        );
      } catch (err) {
        console.warn("Failed to clean up old caches:", err);
      }
    })(),
  );
});

registerRoute(
  /index\.html/,
  new NetworkFirst({
    cacheName: "html-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
      }),
    ],
  }),
);

registerRoute(
  /\.wasm$/,
  new CacheFirst({
    cacheName: "wasm-files",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ request }) => {
    if (request.url.includes("force-clear")) {
      return false;
    }
    return /\.(?:js|css)$/.test(request.url);
  },
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  }),
);

registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  }),
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  /preloader\.js/,
  new StaleWhileRevalidate({
    cacheName: "preloader",
  }),
);

registerRoute(
  /^https:\/\/api-preprod-stage\.cexplorer\.io\/.*$/,
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/api\//],
});
registerRoute(navigationRoute);
