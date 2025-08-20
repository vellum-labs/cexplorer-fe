(async () => {
  const FORCE_CLEAR_DATE = new Date("2025-08-20T00:00:00Z").getTime();
  const lastClearTimestamp = localStorage.getItem("last-clear-timestamp");

  window.__DISABLE_SW__ =
    !lastClearTimestamp || parseInt(lastClearTimestamp, 10) < FORCE_CLEAR_DATE;

  if (window.__DISABLE_SW__) {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          console.log("Unregistering:", reg.scope);
          const ok = await reg.unregister();
          console.log("Unregister result:", ok);
        }
      }

      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map(n => caches.delete(n)));
        console.log("All caches deleted:", names);
      }

      localStorage.setItem("last-clear-timestamp", String(FORCE_CLEAR_DATE));
      window.__DISABLE_SW__ = false;

      console.log("Forced clear: done. Reloading…");
      location.reload();
    } catch (e) {
      console.error("Forced clear failed:", e);
    }
  }
})();
