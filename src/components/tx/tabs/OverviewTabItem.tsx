import { Tabs } from "@vellumlabs/cexplorer-sdk";
import type { useFetchTxDetail } from "@/services/tx";
import type { FC } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { TxSankeyDiagram } from "../TxSankeyDiagram";
import { ClassicFlowView } from "./ClassicFlowView";

interface OverviewTabItemProps {
  query: ReturnType<typeof useFetchTxDetail>;
}

export const OverviewTabItem: FC<OverviewTabItemProps> = ({ query }) => {
  const { t } = useAppTranslation("common");
  const data = query.data?.data;

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
    />
  );
};
