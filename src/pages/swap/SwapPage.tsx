import type { FC } from "react";
import { useState, useEffect, useRef } from "react";

import { PageBase } from "@/components/global/pages/PageBase";
import { DexHunterSwap } from "@/components/swap/DexHunterSwap";
import { AssetExchangesCandlestickGraph } from "@/components/asset/subtabs/AssetExchangesGraph";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { fetchAssetList } from "@/services/assets";

export const SwapPage: FC = () => {
  const { theme } = useThemeStore();

  // Track the token selected in the "You buy" section (full asset identifier)
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  // Track the selected token ticker
  const [selectedTicker, setSelectedTicker] = useState<string>("");

  const swapContainerRef = useRef<HTMLDivElement>(null);

  // Resolve token ticker to full asset identifier
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

  // Resolve ticker to asset identifier when ticker changes
  useEffect(() => {
    if (selectedTicker) {
      resolveAssetIdentifier(selectedTicker);
    }
  }, [selectedTicker]);

  // Observe changes in the swap widget to detect token selection
  useEffect(() => {
    if (!swapContainerRef.current) return;

    let lastDetectedToken = selectedTicker;

    const detectToken = () => {
      const swapContainer = swapContainerRef.current;
      if (!swapContainer) return;

      const allText = swapContainer.innerText;

      // Split text into "You sell" and "You buy" sections
      const sections = allText.split(/(?=You buy|You sell)/);

      let sellToken: string | null = null;
      let buyToken: string | null = null;

      sections.forEach(section => {
        // Match token pattern: Look for uppercase token symbols (2-10 chars)
        const tokenMatches = section.match(/\b([A-Z][A-Z0-9]{1,9})\b/g);

        if (section.includes("You sell") && tokenMatches) {
          // Find the first valid token (skip MAX, BALANCE)
          sellToken =
            tokenMatches.find(t => !["MAX", "BALANCE"].includes(t)) || null;
        } else if (section.includes("You buy") && tokenMatches) {
          buyToken =
            tokenMatches.find(t => !["MAX", "BALANCE"].includes(t)) || null;
        }
      });

      // Find the non-ADA token in the pair
      let targetToken: string | null = null;

      if (sellToken && !["ADA", "CARDANO"].includes(sellToken)) {
        targetToken = sellToken;
      } else if (buyToken && !["ADA", "CARDANO"].includes(buyToken)) {
        targetToken = buyToken;
      }

      // Update if we found a valid non-ADA token and it changed
      if (targetToken && targetToken !== lastDetectedToken) {
        lastDetectedToken = targetToken;
        setSelectedTicker(targetToken);
      }
    };

    const observer = new MutationObserver(detectToken);

    // Delay starting the observer to give the widget time to initialize
    const timeoutId = setTimeout(() => {
      if (!swapContainerRef.current) return;

      // Observe the swap container for changes
      observer.observe(swapContainerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      // Run initial detection
      detectToken();
    }, 500); // Wait 500ms for widget to initialize

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once, observer uses closure for lastDetectedToken

  const colors = {
    background: "var(--cardBg)",
    containers: "var(--background)",
    subText: "var(--grayTextPrimary)",
    mainText: "var(--text)",
    buttonText: "var(--white)",
    accent: "var(--primary)",
  };

  return (
    <PageBase
      metadataTitle='swap'
      breadcrumbItems={[{ label: "Swap" }]}
      title={<div className='flex items-center gap-1/2'>Swap</div>}
    >
      <div className='flex w-full flex-col pt-4'>
        <section className='flex w-full flex-col items-center pb-3'>
          <div className='flex w-full max-w-desktop items-center justify-between px-mobile md:px-desktop'>
            <div className='flex w-full flex-col justify-between gap-3 rounded-m lg:flex-row'>
              <div
                className='w-full lg:w-auto lg:flex-shrink-0'
                ref={swapContainerRef}
              >
                <DexHunterSwap
                  orderTypes={["SWAP", "LIMIT"]}
                  colors={colors}
                  theme={theme}
                  width='400'
                  partnerCode='cexplorernextgen61646472317139737a356b773430706d6e6b636d6d667673736d35667932767a6b6b376c30777535737a7632356e6e66666b716e6b633335717972676e717538746c3936753565656a79746776747371617472326d733668727868647a713470736c767032726dda39a3ee5e6b4b0d3255bfef95601890afd80709'
                  partnerName='cexplorernextgen'
                  displayType='DEFAULT'
                  className='!rounded-[27px] !border !border-border'
                />
              </div>

              <div className='w-full lg:flex-1'>
                {/* Chart */}
                {selectedAssetId ? (
                  <AssetExchangesCandlestickGraph
                    assetname={selectedAssetId}
                    className='!py-[67px]'
                  />
                ) : (
                  <div className='rounded-lg flex min-h-[500px] items-center justify-center border border-border bg-cardBg p-4'>
                    <p className='text-grayTextPrimary'>
                      Select a token in the swap widget to view chart
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageBase>
  );
};
