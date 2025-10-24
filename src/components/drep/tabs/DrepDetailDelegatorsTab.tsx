import type { FC } from "react";
import { useState } from "react";

import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { DelegatorStructureSubtab } from "../subtabs/DelegatorStructureSubtab";
import { DelegatorSubtab } from "../subtabs/DelegatorSubtab";
import { useDrepDelegatorsStructureStore } from "@/stores/tables/drepDelegatorStructureTableStore";

interface DrepDetailDelegatorsTab {
  view: string;
}

export const DrepDetailDelegatorsTab: FC<DrepDetailDelegatorsTab> = ({
  view,
}) => {
  const [sortByAnimalSize, setSortByAnimalSize] = useState(false);
  const { columnsVisibility, setRows, rows, setColumnVisibility } =
    useDrepDelegatorsStructureStore();

  const tabs = [
    {
      key: "all_delegators",
      label: "All Delegators",
      content: <DelegatorSubtab type='all' view={view} />,
      visible: true,
    },
    {
      key: "new_delegators",
      label: "New Delegators",
      content: <DelegatorSubtab type='new' view={view} />,
      visible: true,
    },
    {
      key: "migrations",
      label: "Migrations",
      content: <DelegatorSubtab type='migrations' view={view} />,
      visible: true,
    },
    {
      key: "structure",
      label: "Structure",
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
