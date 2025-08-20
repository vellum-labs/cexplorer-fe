(() => {
  const FORCE_CLEAR_DATE = new Date("2025-08-20T00:00:00Z").getTime();
  const lastClearTimestamp = localStorage.getItem("last-clear-timestamp");

  if (!lastClearTimestamp || parseInt(lastClearTimestamp) < FORCE_CLEAR_DATE) {
    console.log("Performing forced clear - outdated or missing timestamp");

    if ("caches" in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
          console.log(`Deleted cache: ${cacheName}`);
        });
      });
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
          console.log("Unregistered service worker");
        });
      });
    }

    localStorage.setItem("last-clear-timestamp", FORCE_CLEAR_DATE.toString());
  }
})();
