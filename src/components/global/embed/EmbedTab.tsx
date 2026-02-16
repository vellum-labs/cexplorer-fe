import type { FC } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { EmbedButtonsSubtab } from "./EmbedButtonsSubtab";
import { EmbedEntity } from "./EmbedEntity";

import { useAppTranslation } from "@/hooks/useAppTranslation";

import {
  ALLOWED_PARAMS,
  EMBED_DATA_DOMAIN,
  EMBED_TYPES,
} from "@/constants/embed";

interface EmbedTabProps {
  entityType: "pools" | "dreps" | "tokens";
  entityId: string;
  displayName: string;
}

export const EmbedTab: FC<EmbedTabProps> = ({
  entityType,
  entityId,
  displayName,
}) => {
  const { t } = useAppTranslation("pages");

  const bannersConfig = {
    pools:
      ALLOWED_PARAMS["config"][EMBED_TYPES.BANNERS][EMBED_DATA_DOMAIN.POOL],
    dreps:
      ALLOWED_PARAMS["config"][EMBED_TYPES.BANNERS][EMBED_DATA_DOMAIN.DREP],
    tokens:
      ALLOWED_PARAMS["config"][EMBED_TYPES.BANNERS][EMBED_DATA_DOMAIN.TOKEN],
  };

  const embedTabs = [
    ...(entityType !== "tokens"
      ? [
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
        ]
      : []),
    {
      key: "banners",
      label: t(`${entityType}.detailPage.embed.banners`),
      content: (
        <EmbedEntity
          entityId={entityId}
          entityType={entityType}
          config={bannersConfig[entityType]}
          embedType={EMBED_TYPES.BANNERS}
        />
      ),
      visible: true,
    },
    {
      key: "simpleLinks",
      label: t(`${entityType}.detailPage.embed.simpleLinks`),
      content: (
        <EmbedEntity
          entityId={entityId}
          entityType={entityType}
          config={ALLOWED_PARAMS["config"][EMBED_TYPES.SIMPLE_LINK]}
          embedType={EMBED_TYPES.SIMPLE_LINK}
        />
      ),
      visible: true,
    },
    {
      key: "graphs",
      label: t(`${entityType}.detailPage.embed.graphs`),
      content: (
        <EmbedEntity
          entityId={entityId}
          entityType={entityType}
          config={ALLOWED_PARAMS["config"][EMBED_TYPES.GRAPH]}
          embedType={EMBED_TYPES.GRAPH}
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
