import type { FC } from "react";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { EmbedButtonsSubtab } from "../subtabs/EmbedButtonsSubtab";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface EmbedTabItemProps {
  poolId: string;
  poolTicker?: string;
}

export const EmbedTabItem: FC<EmbedTabItemProps> = ({ poolId, poolTicker }) => {
  const { t } = useAppTranslation("pages");
  const embedTabs = [
    {
      key: "buttons",
      label: t("pools.detailPage.embed.buttons"),
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
