import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "./styles/index.css";

export const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 20_000,
      gcTime: 5 * 60 * 1000,
    },
  },
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

(function ensureDollarEncoded() {
  if (typeof window === "undefined") return;
  const { pathname, search, hash } = window.location;

  const segs = pathname.split("/");
  if (segs[1]?.startsWith("$")) {
    segs[1] = segs[1].replace(/^\$/, "%24");
    const fixed = segs.join("/") + search + hash;

    window.history.replaceState(window.history.state, "", fixed);
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-background text-text border relative border-border",
            content: "relative",
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
