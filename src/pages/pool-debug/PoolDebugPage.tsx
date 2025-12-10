import type { FC } from "react";
import { useState, useEffect } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { DebuggerTab } from "@/components/pool-debug/tabs/DebuggerTab";
import { CheatSheetTab } from "@/components/pool-debug/tabs/CheatSheetTab";

interface Pool {
  pool_id: string;
  pool_name: {
    ticker: string;
    name: string;
  };
}

const STORAGE_KEY_POOL = "poolDebug_selectedPool";

export const PoolDebugPage: FC = () => {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_POOL);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<"debugger" | "cheatsheet">(
    "debugger",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedPool) {
      localStorage.setItem(STORAGE_KEY_POOL, JSON.stringify(selectedPool));
    } else {
      localStorage.removeItem(STORAGE_KEY_POOL);
    }
  }, [selectedPool]);

  const tabItems = [
    {
      key: "debugger",
      label: "Debugger",
      visible: true,
    },
    {
      key: "cheatsheet",
      label: "Cheat sheet",
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='poolDebug'
      title='SPO Debug'
      breadcrumbItems={[{ label: "SPO Debug" }]}
      adsCarousel={false}
    >
      <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile lg:p-desktop'>
        <Tabs
          items={tabItems}
          activeTabValue={activeTab}
          withPadding={false}
          withMargin={false}
          onClick={tab => setActiveTab(tab as "debugger" | "cheatsheet")}
        />

        {activeTab === "debugger" && (
          <DebuggerTab
            selectedPool={selectedPool}
            onSelectPool={setSelectedPool}
          />
        )}

        {activeTab === "cheatsheet" && <CheatSheetTab />}
      </div>
    </PageBase>
  );
};
