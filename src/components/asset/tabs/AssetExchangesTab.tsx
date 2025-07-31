import type { useFetchAssetDetail } from "@/services/assets";
import type { FC } from "react";

import { AssetExchangesCandlestickGraph } from "../subtabs/AssetExchangesGraph";
import { AssetExchangesLiquidity } from "../subtabs/AssetExchangesLiquidity";

import Tabs from "@/components/global/Tabs";

interface AssetExchangesTabProps {
  assetname: string;
  query: ReturnType<typeof useFetchAssetDetail>;
}

export const AssetExchangesTab: FC<AssetExchangesTabProps> = ({
  assetname,
  query,
}) => {
  const subTabs = [
    {
      key: "graph",
      label: "Graph",
      content: <AssetExchangesCandlestickGraph assetname={assetname} />,
      visible: true,
    },
    {
      key: "liquidity",
      label: "Liquidity",
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
