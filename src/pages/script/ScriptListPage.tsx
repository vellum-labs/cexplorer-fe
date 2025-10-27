import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { ScriptListInteractionsTab } from "@/components/script/tabs/ScriptListInteractionsTab";
import { ScriptListRanklistTab } from "@/components/script/tabs/ScriptListRanklistTab";
import { ScriptListTVLTab } from "@/components/script/tabs/ScriptListTVLTab";
import type { FC } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

export const ScriptListPage: FC = () => {
  const tabs = [
    {
      key: "ranklist",
      label: "Ranklist",
      content: <ScriptListRanklistTab />,
      visible: true,
    },
    {
      key: "interactions",
      label: "Interactions",
      content: <ScriptListInteractionsTab />,
      visible: true,
    },
    {
      key: "tvl",
      label: "TVL",
      content: <ScriptListTVLTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='scriptList'
      title='Script List'
      breadcrumbItems={[{ label: "Script List" }]}
    >
      <Tabs mobileItemsCount={3} items={tabs} />
    </PageBase>
  );
};
