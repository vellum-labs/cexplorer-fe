import type { FC } from "react";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { EmbedButtonsSubtab } from "../subtabs/EmbedButtonsSubtab";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DrepDetailEmbedTabProps {
  drepId: string;
  drepName?: string;
}

export const DrepDetailEmbedTab: FC<DrepDetailEmbedTabProps> = ({
  drepId,
  drepName,
}) => {
  const { t } = useAppTranslation("pages");
  const embedTabs = [
    {
      key: "buttons",
      label: t("dreps.detailPage.embed.buttons"),
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
