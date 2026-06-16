import { configJSON } from "@/constants/conf";

/**
 * Sevioads (adx.ws) third-party ad integration.
 *
 * The loader script is injected once into <head>; each ad unit renders a
 * `<div class="sevioads" data-zone="...">` and pushes its preferences onto the
 * global `window.sevioads` queue, which the loader consumes.
 *
 * Display is gated by the per-network `ads` flag in conf/*.json (enabled on
 * mainnet + preprod, disabled on preview).
 */

export const SEVIO_LOADER_SRC = "https://cdn.adx.ws/scripts/loader.js";
export const SEVIO_INVENTORY_ID = "d334b3d4-13b4-4c3e-a917-2593f010cd72";
export const SEVIO_ACCOUNT_ID = "d7e6209a-8701-42ce-97f2-c149a8b3860a";

export const SEVIO_ZONES = {
  headerBanner: "3c5288c3-431e-429b-89fc-c5b542ca2b5c",
  txDetailBanner: "a795d0d5-c9d0-42b8-869a-e75410f38e43",
  textAd: "7d97a850-abe6-4d17-9e12-2c3601b9be69",
} as const;

export const adsEnabled = Boolean((configJSON as { ads?: boolean }).ads);

/** Injects the sevioads loader script into <head> exactly once. */
export const ensureSevioLoader = (): void => {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src="${SEVIO_LOADER_SRC}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = SEVIO_LOADER_SRC;
  document.head.appendChild(script);
};
