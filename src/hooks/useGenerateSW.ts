import { useEffect } from "react";

export const useGenerateSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && !(window as any).__DISABLE_SW__) {
      const swUrl = `/sw.js`;

      const swInstalled = sessionStorage.getItem("sw_installed");

      navigator.serviceWorker
        .register(swUrl, {
          scope: "/",
        })
        .then(registration => {
          console.log("🎯 Service Worker registered successfully");
          console.log("📊 Registration state:", {
            installing: registration.installing,
            waiting: registration.waiting,
            active: registration.active,
          });

          const handleUpdate = () => {
            console.log("📦 handleUpdate called");
            const installingWorker =
              registration.installing || registration.waiting;

            console.log("🔍 Worker found:", {
              worker: installingWorker,
              state: installingWorker?.state,
              isInstalling: !!registration.installing,
              isWaiting: !!registration.waiting,
            });

            if (installingWorker) {
              installingWorker.addEventListener("statechange", e => {
                const sw = e.currentTarget as ServiceWorker;
                console.log("🔄 State changed to:", sw.state);

                switch (sw.state) {
                  case "activated": {
                    if (!swInstalled) {
                      console.log("🔄 Timeout fired! Reloading now...");
                      console.log("⏰ Reload time:", new Date().toISOString());
                      sessionStorage.setItem("sw_installed", "true");
                      location.reload();
                    }
                    break;
                  }
                  case "installing":
                    console.log("⏳ SW is installing...");
                    break;
                  case "installed":
                    console.log("📥 SW installed (waiting to activate)");
                    break;
                  case "activating":
                    console.log("🔄 SW is activating...");
                    break;
                  case "redundant":
                    console.log("❌ SW became redundant");
                    break;
                  default:
                    console.warn(
                      "⚠️ Unknown SW state:",
                      sw.state,
                      "An error occurred while the SW was updating. Please let us know about it on our Discord channel.",
                    );
                }
              });
              console.log("✅ statechange listener added to worker");
            } else {
              console.log("❌ No installing or waiting worker found");
            }
          };

          registration.onupdatefound = () => {
            console.log("🔄 onupdatefound triggered!");
            if (!registration.installing) {
              console.log("❌ No installing worker in onupdatefound");
              return;
            }
            console.log(
              "✅ Installing worker found in onupdatefound, calling handleUpdate",
            );
            handleUpdate();
          };

          if (registration.installing || registration.waiting) {
            console.log(
              "🚀 Initial installation/waiting detected, calling handleUpdate immediately",
            );
            handleUpdate();
          } else {
            console.log(
              "ℹ️ No installing/waiting worker on initial registration",
            );
            console.log("🔍 Checking for updates...");
            registration.update().then(() => {
              console.log("✅ Update check completed");
            });
          }
        })
        .catch(error => {
          console.error("❌ Service Worker error:", error);
        });
    } else {
      console.log("⚠️ Service Worker not supported or disabled");
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
