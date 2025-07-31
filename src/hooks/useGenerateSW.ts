import { useEffect, useState } from "react";

interface GenerateSW {
  isUpdating: boolean;
  isActivating: boolean;
  updateReady: boolean;
  isFirstInstall: boolean;
  progress: number;
}

export const useGenerateSW = (): GenerateSW => {
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [isActivating, setActivating] = useState<boolean>(false);
  const [updateReady, setUpdateReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isFirstInstall, setIsFirstInstall] = useState(false);

  useEffect(() => {
    const hasInstalled = localStorage.getItem("sw-installed");

    if (!hasInstalled) {
      localStorage.setItem("sw-installed", "true");
      setIsFirstInstall(true);
    }

    if ("serviceWorker" in navigator) {
      // const version = import.meta.env.VITE_APP_VERSION || "1.0.8";

      const swUrl = `/sw.js`;

      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = event => {
        if (event.data && event.data.type === "PRECACHE_PROGRESS") {
          setProgress(event.data.progress);
        }
      };

      navigator.serviceWorker
        .register(swUrl, {
          scope: "/",
        })
        .then(registration => {
          registration.onupdatefound = () => {
            if (!registration.installing) {
              return;
            }
            setUpdating(true);
            setUpdateReady(false);

            registration.installing.postMessage({ type: "INIT_PORT" }, [
              messageChannel.port2,
            ]);

            registration.installing.addEventListener("statechange", e => {
              const sw = e.currentTarget as ServiceWorker;

              switch (sw.state) {
                case "activating":
                  setUpdating(false);
                  setActivating(true);
                  break;
                case "activated":
                  setUpdateReady(true);
                  setActivating(false);
                  break;
                default:
                  console.warn(
                    "An error occurred while the SW was updating. Please let us know about it on our Discord channel.",
                  );
              }
            });
          };
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
    progress,
    isActivating,
  };
};
