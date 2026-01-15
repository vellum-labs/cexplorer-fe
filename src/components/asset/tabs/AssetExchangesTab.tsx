import type { useFetchAssetDetail } from "@/services/assets";
import type { FC } from "react";

import { AssetExchangesCandlestickGraph } from "../subtabs/AssetExchangesGraph";
import { AssetExchangesLiquidity } from "../subtabs/AssetExchangesLiquidity";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface AssetExchangesTabProps {
  assetname: string;
  query: ReturnType<typeof useFetchAssetDetail>;
}

export const AssetExchangesTab: FC<AssetExchangesTabProps> = ({
  assetname,
  query,
}) => {
  const { t } = useAppTranslation("common");

  const subTabs = [
    {
      key: "graph",
      label: t("asset.graphTab"),
      content: <AssetExchangesCandlestickGraph assetname={assetname} />,
      visible: true,
    },
    {
      key: "liquidity",
      label: t("asset.liquidityTab"),
      content: <AssetExchangesLiquidity query={query} />,
      visible: true,
    },
  ];

  return (
    <Tabs
      items={subTabs}
      tabParam='subTab'
      withPadding={false}
      wrapperClassname='mt-0'
    />
  );
};
