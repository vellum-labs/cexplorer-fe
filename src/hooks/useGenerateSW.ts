import { useEffect } from "react";

export const useGenerateSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && !(window as any).__DISABLE_SW__) {
      const swUrl = `/sw.js`;

      navigator.serviceWorker
        .register(swUrl, {
          scope: "/",
        })
        .then(registration => {
          const handleUpdate = () => {
            const installingWorker =
              registration.installing || registration.waiting;

            if (installingWorker) {
              installingWorker.addEventListener("statechange", e => {
                const sw = e.currentTarget as ServiceWorker;

                switch (sw.state) {
                  case "activated":
                    localStorage.setItem("should_update", "true");
                    location.reload();
                    break;
                  default:
                    console.warn(
                      "An error occurred while the SW was updating. Please let us know about it on our Discord channel.",
                    );
                }
              });
            }
          };

          registration.onupdatefound = () => {
            if (!registration.installing) {
              return;
            }
            handleUpdate();
          };

          if (registration.installing || registration.waiting) {
            handleUpdate();
          }
        })
        .catch(error => {
          console.error("Service Worker error ", error);
        });
    }
  }, []);

  useEffect(() => {
    const sessionStartTime = sessionStorage.getItem("sessionStart");
    if (!sessionStartTime) {
      sessionStorage.setItem("sessionStart", String(new Date().getTime()));
    }

    const updateChannel = new BroadcastChannel("update_channel");

    const checkAndRefresh = () => {
      const lastSessionStart = parseInt(
        sessionStorage.getItem("sessionStart") || "0",
        10,
      );
      const now = Date.now();

      const ONE_DAY = 24 * 60 * 60 * 1000;

      if (now - lastSessionStart > ONE_DAY) {
        sessionStorage.setItem("sessionStart", now.toString());
        updateChannel.postMessage("refresh");
        window.location.reload();
      }
    };

    updateChannel.onmessage = e => {
      if (e.data === "refresh") {
        window.location.reload();
      }
    };

    const intervalId = setInterval(checkAndRefresh, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      updateChannel.close();
    };
  }, []);
};
