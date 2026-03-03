import type { FC } from "react";

import { useEffect } from "react";
import { useVersionStore } from "@/stores/versionsStore";

import { LOCAL_STORAGE_VERSION } from "@/constants/versions";
import { clearLocalStorageExcept } from "@/utils/clearLocalStorageExcept";

export const VersionWatcher: FC = () => {
  const { storageVersion, setStorageVersion } = useVersionStore();

  const stores = [
    "uq_store",
    "theme_store",
    "versions_store",
    "address_label_store",
    "watchlist_store",
    "navbar-line-1",
    "cookie_consent",
  ];

  useEffect(() => {
    if (storageVersion !== LOCAL_STORAGE_VERSION) {
      clearLocalStorageExcept(stores);
      setStorageVersion(LOCAL_STORAGE_VERSION);
    }
  }, []);

  return null;
};
