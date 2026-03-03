import type { StablecoinData } from "@/types/stablecoinTypes";
import type { FC } from "react";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { generateImageUrl } from "@/utils/generateImageUrl";
import {
  formatNumberWithSuffix,
  Image,
  OverviewStatCard,
} from "@vellumlabs/cexplorer-sdk";
import { ArrowLeftRight, Crown, Landmark } from "lucide-react";

interface StablecoinOverviewProps {
  data: StablecoinData[];
  ex: number;
}

export const StablecoinOverview: FC<StablecoinOverviewProps> = ({
  data,
  ex,
}) => {
  const { t } = useAppTranslation();

  const mintedUsd = data.reduce((sum, sc) => {
    const decimals = sc.registry?.decimals ?? 0;
    return sum + (sc.mint?.inflow ?? 0) / 10 ** decimals;
  }, 0);
  const burnedUsd = data.reduce((sum, sc) => {
    const decimals = sc.registry?.decimals ?? 0;
    return sum + Math.abs(sc.mint?.outflow ?? 0) / 10 ** decimals;
  }, 0);
  const netFlowUsd = mintedUsd - burnedUsd;

  const marketCapUsd = data.reduce((sum, sc) => {
    const decimals = sc.registry?.decimals ?? 0;
    return sum + sc.quantity / 10 ** decimals;
  }, 0);
  const marketCapAda = ex > 0 ? marketCapUsd / ex : 0;

  const stablecoinShares = data
    .map(sc => {
      const decimals = sc.registry?.decimals ?? 0;
      const supply = sc.quantity / 10 ** decimals;
      return {
        ticker: sc.registry?.ticker ?? sc.fingerprint,
        fingerprint: sc.fingerprint,
        hasLogo: sc.registry?.has_logo,
        supply,
        share: marketCapUsd > 0 ? (supply / marketCapUsd) * 100 : 0,
      };
    })
    .sort((a, b) => b.share - a.share);

  const dominant = stablecoinShares[0];
  const others = stablecoinShares.slice(1);

  const statCards = [
    {
      key: "netFlow",
      icon: <ArrowLeftRight className='text-primary' />,
      label: t("stablecoinDashboard.netFlow"),
      content: (
        <p className='text-display-xs font-semibold'>
          ${formatNumberWithSuffix(Math.abs(netFlowUsd))}
          {netFlowUsd >= 0 ? "" : " "}
        </p>
      ),
      footer: (
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-1'>
            <span className='text-text-sm text-grayTextPrimary'>
              {t("stablecoinDashboard.minted")}
            </span>
            <span className='text-text-sm text-[#10B981]'>
              ${formatNumberWithSuffix(mintedUsd)}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <span className='text-text-sm text-grayTextPrimary'>
              {t("stablecoinDashboard.burned")}
            </span>
            <span className='text-text-sm text-redText'>
              ${formatNumberWithSuffix(burnedUsd)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "marketCap",
      icon: <Landmark className='text-primary' />,
      label: t("stablecoinDashboard.marketCap"),
      content: (
        <p className='text-display-xs font-semibold'>
          ${formatNumberWithSuffix(marketCapUsd)}
        </p>
      ),
      footer: (
        <span className='text-text-sm text-grayTextPrimary'>
          {t("stablecoinDashboard.adaMarketCap")}:{" "}
          <span className='font-medium text-text'>
            ₳{formatNumberWithSuffix(marketCapAda)}
          </span>
        </span>
      ),
    },
    {
      key: "dominance",
      icon: <Crown className='text-primary' />,
      label: t("stablecoinDashboard.dominance"),
      content: dominant ? (
        <div className='flex items-center gap-2'>
          <p className='text-display-xs font-semibold'>
            {dominant.share.toFixed(2)}%
          </p>
          <div className='flex items-center gap-1'>
            <Image
              type='asset'
              height={28}
              width={28}
              className='rounded-lg aspect-square h-[28px] w-[28px] shrink-0'
              src={generateImageUrl(dominant.fingerprint, "sm", "nft")}
              fallbackletters={dominant.ticker.slice(0, 2)}
            />
            <p className='text-display-xs font-semibold'>{dominant.ticker}</p>
          </div>
        </div>
      ) : (
        <p className='text-display-xs font-semibold'>-</p>
      ),
      footer: others.length > 0 && (
        <div className='flex gap-3 overflow-x-auto'>
          {others.map(sc => (
            <div
              key={sc.fingerprint}
              className='flex shrink-0 items-center gap-1'
            >
              <Image
                type='asset'
                height={16}
                width={16}
                className='rounded-sm aspect-square h-[16px] w-[16px] shrink-0'
                src={generateImageUrl(sc.fingerprint, "sm", "nft")}
                fallbackletters={sc.ticker.slice(0, 2)}
              />
              <span className='text-text-xs text-grayTextPrimary'>
                {sc.ticker} {sc.share.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
      <div className='flex h-full w-full flex-wrap items-stretch gap-2 lg:flex-nowrap'>
        {statCards.map(({ key, icon, label, content, footer }) => (
          <OverviewStatCard
            key={key}
            icon={icon}
            title={label}
            value={content}
            description={footer}
            className='min-w-[280px] flex-1'
          />
        ))}
      </div>
    </section>
  );
};
