import type { FC } from "react";
import { useState } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { DelegatorStructureSubtab } from "../subtabs/DelegatorStructureSubtab";
import { DelegatorSubtab } from "../subtabs/DelegatorSubtab";
import { useDrepDelegatorsStructureStore } from "@/stores/tables/drepDelegatorStructureTableStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface DrepDetailDelegatorsTab {
  view: string;
}

export const DrepDetailDelegatorsTab: FC<DrepDetailDelegatorsTab> = ({
  view,
}) => {
  const { t } = useAppTranslation("pages");
  const [sortByAnimalSize, setSortByAnimalSize] = useState(false);
  const { columnsVisibility, setRows, rows, setColumnVisibility } =
    useDrepDelegatorsStructureStore();

  const tabs = [
    {
      key: "all_delegators",
      label: t("dreps.detailPage.delegatorsTabs.allDelegators"),
      content: <DelegatorSubtab type='all' view={view} />,
      visible: true,
    },
    {
      key: "new_delegators",
      label: t("dreps.detailPage.delegatorsTabs.newDelegators"),
      content: <DelegatorSubtab type='new' view={view} />,
      visible: true,
    },
    {
      key: "migrations",
      label: t("dreps.detailPage.delegatorsTabs.migrations"),
      content: <DelegatorSubtab type='migrations' view={view} />,
      visible: true,
    },
    {
      key: "structure",
      label: t("dreps.detailPage.delegatorsTabs.structure"),
      content: (
        <DelegatorStructureSubtab
          view={view}
          sortByAnimalSize={sortByAnimalSize}
          setSortByAnimalSize={setSortByAnimalSize}
          rows={rows}
          setRows={setRows}
          columnsVisibility={columnsVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      ),
      visible: true,
    },
  ];

  return (
    <Tabs
      tabParam='subTab'
      items={tabs}
      withPadding={false}
      wrapperClassname='mt-0'
    />
  );
};
