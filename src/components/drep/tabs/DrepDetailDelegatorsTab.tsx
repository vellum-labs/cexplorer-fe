import type { FC } from "react";

import Tabs from "@/components/global/Tabs";
import { DelegatorStructureSubtab } from "../subtabs/DelegatorStructureSubtab";
import { DelegatorSubtab } from "../subtabs/DelegatorSubtab";

interface DrepDetailDelegatorsTab {
  view: string;
}

export const DrepDetailDelegatorsTab: FC<DrepDetailDelegatorsTab> = ({
  view,
}) => {
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
      content: <DelegatorStructureSubtab view={view} />,
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
