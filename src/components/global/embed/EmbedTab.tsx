import type { FC } from "react";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { EmbedButtonsSubtab } from "./EmbedButtonsSubtab";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface EmbedTabProps {
  entityType: "pools" | "dreps";
  entityId: string;
  displayName: string;
}

export const EmbedTab: FC<EmbedTabProps> = ({
  entityType,
  entityId,
  displayName,
}) => {
  const { t } = useAppTranslation("pages");

  const embedTabs = [
    {
      key: "buttons",
      label: t(`${entityType}.detailPage.embed.buttons`),
      content: (
        <EmbedButtonsSubtab
          entityType={entityType}
          entityId={entityId}
          displayName={displayName}
        />
      ),
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
