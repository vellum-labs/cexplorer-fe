import type { FC } from "react";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { EmbedButtonsSubtab } from "../subtabs/EmbedButtonsSubtab";

interface DrepDetailEmbedTabProps {
  drepId: string;
  drepName?: string;
}

export const DrepDetailEmbedTab: FC<DrepDetailEmbedTabProps> = ({
  drepId,
  drepName,
}) => {
  const embedTabs = [
    {
      key: "buttons",
      label: "Buttons",
      content: <EmbedButtonsSubtab drepId={drepId} drepName={drepName} />,
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
