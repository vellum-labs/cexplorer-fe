import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { ScriptListInteractionsTab } from "@/components/script/tabs/ScriptListInteractionsTab";
import { ScriptListRanklistTab } from "@/components/script/tabs/ScriptListRanklistTab";
import { ScriptListTVLTab } from "@/components/script/tabs/ScriptListTVLTab";
import type { FC } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const ScriptListPage: FC = () => {
  const { t } = useAppTranslation();

  const tabs = [
    {
      key: "ranklist",
      label: t("tabs.script.ranklist"),
      content: <ScriptListRanklistTab />,
      visible: true,
    },
    {
      key: "interactions",
      label: t("tabs.script.interactions"),
      content: <ScriptListInteractionsTab />,
      visible: true,
    },
    {
      key: "tvl",
      label: t("tabs.script.tvl"),
      content: <ScriptListTVLTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='scriptList'
      title={t("pages.scriptList.title")}
      breadcrumbItems={[{ label: t("breadcrumbs.scriptList") }]}
    >
      <Tabs mobileItemsCount={3} items={tabs} />
    </PageBase>
  );
};
