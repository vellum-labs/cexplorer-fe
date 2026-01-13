import type { FC } from "react";
import { useState, useEffect, useRef } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import Swap from "@dexhunterio/swaps";

import { PageBase } from "@/components/global/pages/PageBase";
import { AssetExchangesCandlestickGraph } from "@/components/asset/subtabs/AssetExchangesGraph";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { fetchAssetList } from "@/services/assets";
import {
  DEXHUNTER_PARTNER_CODE,
  DEXHUNTER_PARTNER_NAME,
  DEXHUNTER_COLORS,
} from "@/constants/dexConfig";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const SwapPage: FC = () => {
  const { t } = useAppTranslation();
  const { theme } = useThemeStore();
  const navigate = useNavigate({ from: "/swap" });

  const { asset: assetFromUrl } = useSearch({ from: "/swap/" });

  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    assetFromUrl || "",
  );

  const [selectedTicker, setSelectedTicker] = useState<string>("");

  const swapContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const lastDetectedTokenRef = useRef<string>("");

  const resolveAssetIdentifier = async (ticker: string) => {
    if (!ticker) return;

    try {
      const response = await fetchAssetList({
        name: ticker,
        limit: 1,
        offset: 0,
        filter: "token",
      });

      if (response.data?.data?.[0]?.name) {
        setSelectedAssetId(response.data.data[0].name);
      }
    } catch (error) {
      console.error("Failed to resolve asset identifier:", error);
    }
  };

  useEffect(() => {
    if (assetFromUrl) {
      setSelectedAssetId(assetFromUrl);
    }
  }, [assetFromUrl]);

  useEffect(() => {
    if (selectedTicker) {
      resolveAssetIdentifier(selectedTicker);
    }
  }, [selectedTicker]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedAssetId && selectedAssetId !== assetFromUrl) {
      navigate({
        search: { asset: selectedAssetId },
        replace: true,
      });
    }
  }, [selectedAssetId, assetFromUrl, navigate]);

  useEffect(() => {
    if (!swapContainerRef.current) return;

    const detectToken = () => {
      const swapContainer = swapContainerRef.current;
      if (!swapContainer) return;

      const allText = swapContainer.innerText;

      const sections = allText.split(/(?=You buy|You sell)/);

      let sellToken: string | null = null;
      let buyToken: string | null = null;

      sections.forEach(section => {
        const tokenMatches = section.match(/\b([A-Z][A-Z0-9]{1,9})\b/g);

        if (section.includes("You sell") && tokenMatches) {
          sellToken =
            tokenMatches.find(t => !["MAX", "BALANCE"].includes(t)) || null;
        } else if (section.includes("You buy") && tokenMatches) {
          buyToken =
            tokenMatches.find(t => !["MAX", "BALANCE"].includes(t)) || null;
        }
      });

      let targetToken: string | null = null;

      if (sellToken && !["ADA", "CARDANO"].includes(sellToken)) {
        targetToken = sellToken;
      } else if (buyToken && !["ADA", "CARDANO"].includes(buyToken)) {
        targetToken = buyToken;
      }

      if (targetToken && targetToken !== lastDetectedTokenRef.current) {
        lastDetectedTokenRef.current = targetToken;
        setSelectedTicker(targetToken);
      }
    };

    const observer = new MutationObserver(detectToken);

    const rafId = requestAnimationFrame(() => {
      if (!swapContainerRef.current) return;

      observer.observe(swapContainerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      detectToken();
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <PageBase
      metadataTitle='swap'
      breadcrumbItems={[{ label: t("swap.breadcrumb") }]}
      title={<div className='flex items-center gap-1/2'>{t("swap.title")}</div>}
    >
      <div className='flex w-full flex-col pt-4'>
        <section className='flex w-full flex-col items-center pb-3'>
          <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
            <div className='flex w-full flex-col justify-between gap-3 rounded-m lg:flex-row'>
              <div className='w-full lg:flex-1'>
                {selectedAssetId ? (
                  <AssetExchangesCandlestickGraph
                    assetname={selectedAssetId}
                    className='!py-[67px]'
                  />
                ) : (
                  <div className='flex min-h-[500px] items-center justify-center rounded-m border border-border bg-cardBg p-4'>
                    <p className='text-grayTextPrimary'>
                      {t("swap.selectTokenToViewChart")}
                    </p>
                  </div>
                )}
              </div>

              <div
                className='w-full lg:w-auto lg:flex-shrink-0'
                ref={swapContainerRef}
              >
                <div className='w-full'>
                  <Swap
                    orderTypes={["SWAP", "LIMIT"] as any}
                    colors={DEXHUNTER_COLORS as any}
                    theme={theme}
                    width='400'
                    partnerCode={DEXHUNTER_PARTNER_CODE}
                    partnerName={DEXHUNTER_PARTNER_NAME}
                    displayType='DEFAULT'
                    defaultToken={assetFromUrl || undefined}
                    className='!rounded-[27px] !border !border-border'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageBase>
  );
};
