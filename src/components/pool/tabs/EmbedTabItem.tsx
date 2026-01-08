import type { FC } from "react";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { EmbedButtonsSubtab } from "../subtabs/EmbedButtonsSubtab";

interface EmbedTabItemProps {
  poolId: string;
  poolTicker?: string;
}

export const EmbedTabItem: FC<EmbedTabItemProps> = ({ poolId, poolTicker }) => {
  const embedTabs = [
    {
      key: "buttons",
      label: "Buttons",
      content: <EmbedButtonsSubtab poolId={poolId} poolTicker={poolTicker} />,
      visible: true,
    },
  ];

  return (
    <Tabs
      tabParam='subtab'
      withPadding={false}
      withMargin={false}
      items={embedTabs}
    />
  );
};
