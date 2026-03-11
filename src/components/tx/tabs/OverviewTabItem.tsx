import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import type { useFetchTxDetail } from "@/services/tx";
import type { FC } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { TxSankeyDiagram } from "../TxSankeyDiagram";
import { ClassicFlowView } from "./ClassicFlowView";

const OVERVIEW_SUBTAB_KEY = "tx_overview_subtab";

interface OverviewTabItemProps {
  query: ReturnType<typeof useFetchTxDetail>;
}

export const OverviewTabItem: FC<OverviewTabItemProps> = ({ query }) => {
  const { t } = useAppTranslation("common");
  const data = query.data?.data;
  const search = useSearch({ strict: false });
  const hasSubTabInUrl = !!search.subTab;
  const savedSubTab = localStorage.getItem(OVERVIEW_SUBTAB_KEY);
  const defaultTab = !hasSubTabInUrl && savedSubTab ? savedSubTab : undefined;

  const handleTabClick = (key: string) => {
    localStorage.setItem(OVERVIEW_SUBTAB_KEY, key);
  };

  const tabs = [
    {
      key: "classic",
      label: t("tx.overview.classic"),
      content: <ClassicFlowView query={query} />,
      visible: true,
    },
    {
      key: "flow",
      label: t("tx.overview.flow"),
      content: (
        <TxSankeyDiagram
          inputs={data?.all_inputs ?? []}
          outputs={data?.all_outputs ?? []}
        />
      ),
      visible: true,
    },
  ];

  return (
    <Tabs
      tabParam="subTab"
      withPadding={false}
      withMargin={false}
      items={tabs}
      activeTabValue={defaultTab}
      onClick={handleTabClick}
    />
  );
};
