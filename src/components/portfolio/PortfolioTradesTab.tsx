import type { FC } from "react";
import { DeFiOrderList } from "@/components/defi/DeFiOrderList";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useSearch } from "@tanstack/react-router";

export const PortfolioTradesTab: FC = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { wallets, selectedWalletId } = usePortfolioStore();
  const { stakeAddresses } = usePortfolioData();
  const { page } = useSearch({ from: "/portfolio/" });

  const selectedWallet = selectedWalletId
    ? wallets.find(w => w.id === selectedWalletId)
    : null;

  if (stakeAddresses.length === 0) {
    return (
      <div className='flex items-center justify-center p-8 text-grayTextPrimary'>
        {t("portfolio.empty.subtitle")}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {stakeAddresses.map(address => (
        <DeFiOrderList
          key={address}
          storeKey={`portfolio_defi_${address}`}
          stakeAddress={address}
          tabName='defi'
          page={page}
          disabledKeys={["dex"]}
          disableSearchSync
          pulseDot={false}
          titleClassname={
            stakeAddresses.length > 1 && !selectedWallet ? "" : "hidden"
          }
        />
      ))}
    </div>
  );
};
