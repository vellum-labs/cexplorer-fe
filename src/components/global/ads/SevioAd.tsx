import type { FC } from "react";

import { useEffect, useRef } from "react";

import { cn } from "@vellumlabs/cexplorer-sdk";
import {
  SEVIO_ACCOUNT_ID,
  SEVIO_INVENTORY_ID,
  adsEnabled,
  ensureSevioLoader,
} from "@/constants/sevioAds";

interface SevioAdProps {
  zone: string;
  adType: "banner" | "native";
  className?: string;
}

/**
 * Renders a single sevioads ad unit and registers its preferences with the
 * global loader queue. Renders nothing when ads are disabled for the current
 * network (see `adsEnabled` / conf/*.json `ads` flag).
 */
export const SevioAd: FC<SevioAdProps> = ({ zone, adType, className }) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!adsEnabled || initializedRef.current) return;
    initializedRef.current = true;

    ensureSevioLoader();

    const w = window as unknown as { sevioads?: unknown[] };
    w.sevioads = w.sevioads || [];

    const preferences: Record<string, string>[] = [
      {
        zone,
        adType,
        inventoryId: SEVIO_INVENTORY_ID,
        accountId: SEVIO_ACCOUNT_ID,
      },
    ];

    w.sevioads.push(preferences);
  }, [zone, adType]);

  if (!adsEnabled) return null;

  return <div className={cn("sevioads", className)} data-zone={zone} />;
};

export default SevioAd;
