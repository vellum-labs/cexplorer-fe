import type { FC } from "react";
import { useState, useEffect, useRef } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";

import { PageBase } from "@/components/global/pages/PageBase";
import { PoolSelector } from "@/components/staking-calculator/PoolSelector";
import { EcoImpactResults } from "@/components/eco-impact/EcoImpactResults";
import { EnergyComparison } from "@/components/eco-impact/EnergyComparison";
import {
  TableSearchInput,
  LoadingSkeleton,
  Badge,
  useDebounce,
} from "@vellumlabs/cexplorer-sdk";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { fetchStakeDetail } from "@/services/stake";
import { fetchPoolDetail } from "@/services/pools";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LS_MODE_KEY, LS_STAKE_KEY, LS_POOL_KEY } from "@/constants/ecoImpact";

type Mode = "delegator" | "spo";

interface Pool {
  pool_id: string;
  pool_name: {
    ticker: string;
    name: string;
  };
}

const getSavedPool = (): Pool | null => {
  try {
    const raw = localStorage.getItem(LS_POOL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Pool;
  } catch {
    return null;
  }
};

export const EcoImpactPage: FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: "/eco-impact/" });

  const [mode, setMode] = useState<Mode>(() => {
    if (search.mode) return search.mode;
    const saved = localStorage.getItem(LS_MODE_KEY);
    if (saved === "delegator" || saved === "spo") return saved;
    return "delegator";
  });

  const [stakeAddress, setStakeAddress] = useState<string>(() => {
    if (search.stake) return search.stake;
    return localStorage.getItem(LS_STAKE_KEY) ?? "";
  });

  const [selectedPool, setSelectedPool] = useState<Pool | null>(() => {
    if (search.pool) {
      const saved = getSavedPool();
      if (saved && saved.pool_id === search.pool) return saved;
      return { pool_id: search.pool, pool_name: { ticker: "", name: search.pool } };
    }
    return getSavedPool();
  });

  const debouncedStakeAddress = useDebounce(stakeAddress);
  const [stakedAda, setStakedAda] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    localStorage.setItem(LS_MODE_KEY, mode);

    const stake =
      mode === "delegator" && debouncedStakeAddress
        ? debouncedStakeAddress
        : undefined;
    const pool =
      mode === "spo" && selectedPool ? selectedPool.pool_id : undefined;

    if (stake) localStorage.setItem(LS_STAKE_KEY, stake);
    if (selectedPool)
      localStorage.setItem(LS_POOL_KEY, JSON.stringify(selectedPool));

    navigate({
      to: "/eco-impact",
      search: () => ({ mode, stake, pool }),
      replace: true,
    });
  }, [mode, debouncedStakeAddress, selectedPool, navigate]);

  useEffect(() => {
    if (mode !== "delegator") return;
    if (!debouncedStakeAddress || !isValidAddress(debouncedStakeAddress)) {
      setStakedAda(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    fetchStakeDetail({ view: debouncedStakeAddress })
      .then(res => {
        if (controller.signal.aborted) return;
        const amount = res?.data?.stake?.active?.amount;
        setStakedAda(amount ? Number(amount) : null);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setStakedAda(null);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [mode, debouncedStakeAddress]);

  useEffect(() => {
    if (mode !== "spo") return;
    if (!selectedPool) {
      setStakedAda(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    fetchPoolDetail({
      pool_id: selectedPool.pool_id,
      hash_raw: undefined,
    })
      .then(res => {
        if (controller.signal.aborted) return;
        const activeStake = res.data?.active_stake;
        setStakedAda(activeStake ? Number(activeStake) : null);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setStakedAda(null);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [mode, selectedPool]);

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setStakedAda(null);
  };

  const isDebouncing =
    mode === "delegator" &&
    stakeAddress !== debouncedStakeAddress &&
    stakeAddress.length > 0;

  return (
    <PageBase
      metadataTitle='ecoImpact'
      title={t("pages:ecoImpact.title")}
      breadcrumbItems={[{ label: t("pages:breadcrumbs.ecoImpact") }]}
      adsCarousel={false}
    >
      <section className='flex w-full justify-center'>
        <div className='flex w-full max-w-desktop flex-col gap-4 p-mobile md:p-desktop'>
          <p className='text-text-sm text-grayTextPrimary'>
            {t("ecoImpact.subtitle")}
          </p>

          <div className='flex items-center gap-2'>
            <span className='text-text-sm text-grayTextPrimary'>
              {t("ecoImpact.calculateAs")}:
            </span>
            <button onClick={() => handleModeSwitch("delegator")}>
              <Badge color={mode === "delegator" ? "green" : "light"}>
                {t("ecoImpact.delegator")}
              </Badge>
            </button>
            <button onClick={() => handleModeSwitch("spo")}>
              <Badge color={mode === "spo" ? "green" : "light"}>
                {t("ecoImpact.spo")}
              </Badge>
            </button>
          </div>

          <div className='flex w-full'>
            {mode === "delegator" ? (
              <TableSearchInput
                value={stakeAddress}
                onchange={val => setStakeAddress(val)}
                placeholder={t("ecoImpact.enterStakeAddress")}
                showSearchIcon
                wrapperClassName='w-full'
                showPrefixPopup={false}
              />
            ) : (
              <PoolSelector
                selectedPool={selectedPool}
                onSelectPool={setSelectedPool}
              />
            )}
          </div>

          {isLoading || isDebouncing ? (
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-3 md:flex-row'>
                <LoadingSkeleton height='148px' width='100%' />
                <LoadingSkeleton height='148px' width='100%' />
                <LoadingSkeleton height='148px' width='100%' />
              </div>
              <LoadingSkeleton height='208px' width='100%' />
            </div>
          ) : (
            stakedAda !== null &&
            stakedAda > 0 && <EcoImpactResults stakedAda={stakedAda} />
          )}

          <EnergyComparison />
        </div>
      </section>
    </PageBase>
  );
};
