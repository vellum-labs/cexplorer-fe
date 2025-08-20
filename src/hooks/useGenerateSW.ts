import { useEffect, useState } from "react";

interface GenerateSW {
  isUpdating: boolean;
  updateReady: boolean;
  isFirstInstall: boolean;
}

export const useGenerateSW = (): GenerateSW => {
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [updateReady, setUpdateReady] = useState<boolean>(false);
  const [isFirstInstall, setIsFirstInstall] = useState(false);

  useEffect(() => {
    const hasInstalled = localStorage.getItem("sw-installed");

    if (!hasInstalled) {
      localStorage.setItem("sw-installed", "true");
      setIsFirstInstall(true);
    }

    if ("serviceWorker" in navigator) {
      const swUrl = `/sw.js`;

      navigator.serviceWorker
        .register(swUrl, {
          scope: "/",
        })
        .then(registration => {
          const handleUpdate = () => {
            setUpdating(true);
            setUpdateReady(false);

            const installingWorker =
              registration.installing || registration.waiting;

            if (installingWorker) {
              installingWorker.addEventListener("statechange", e => {
                const sw = e.currentTarget as ServiceWorker;

                switch (sw.state) {
                  case "activated":
                    setUpdateReady(true);
                    setUpdating(false);
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

          if (
            registration.active &&
            !registration.installing &&
            !registration.waiting &&
            isFirstInstall
          ) {
            setUpdating(true);
            setUpdateReady(false);

            setTimeout(() => {
              setUpdating(false);
              setUpdateReady(true);
            }, 3000);
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

    return () => clearInterval(intervalId);
  }, []);

  return {
    isUpdating,
    updateReady,
    isFirstInstall,
  };
};
