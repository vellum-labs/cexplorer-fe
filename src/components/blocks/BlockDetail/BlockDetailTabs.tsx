import type { FC } from "react";
import type { BlockDetailResponseData } from "@/types/blockTypes";
import type { UseQueryResult } from "@tanstack/react-query";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { BlockDetailTable } from "./BlockDetailTable";
import { BlockBarChart } from "../BlockBarChart";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface BlockDetailTabsProps {
  blockDetail: UseQueryResult<BlockDetailResponseData, Error>;
}

export const BlockDetailTabs: FC<BlockDetailTabsProps> = ({ blockDetail }) => {
  const { t } = useAppTranslation("common");
  const data = blockDetail.data;

  const tabs = [
    {
      key: "transactions",
      label: t("blocks.transactions"),
      content: <BlockDetailTable txs={data?.txs} blockDetail={blockDetail} />,
      visible: true,
    },
    {
      key: "visualization",
      label: t("blocks.visualization"),
      content: <BlockBarChart txs={data?.txs ?? []} />,
      visible: true,
    },
  ];

  return <Tabs items={tabs} withPadding={false} mobileItemsCount={2} />;
};
