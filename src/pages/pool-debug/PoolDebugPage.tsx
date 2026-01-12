import type { FC } from "react";
import { useState, useEffect } from "react";
import { PageBase } from "@/components/global/pages/PageBase";
import { Tabs } from "@vellumlabs/cexplorer-sdk";
import { DebuggerTab } from "@/components/pool-debug/tabs/DebuggerTab";
import { CheatSheetTab } from "@/components/pool-debug/tabs/CheatSheetTab";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Pool {
  pool_id: string;
  pool_name: {
    ticker: string;
    name: string;
  };
}

const STORAGE_KEY_POOL = "poolDebug_selectedPool";

export const PoolDebugPage: FC = () => {
  const { t } = useAppTranslation();
  const params = useParams({ strict: false }) as { poolId?: string };
  const urlPoolId = params.poolId;
  const navigate = useNavigate();

  const [selectedPool, setSelectedPool] = useState<Pool | null>(() => {
    if (urlPoolId) {
      return {
        pool_id: urlPoolId,
        pool_name: { ticker: "", name: urlPoolId },
      };
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_POOL);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedPool) {
      localStorage.setItem(STORAGE_KEY_POOL, JSON.stringify(selectedPool));
      if (urlPoolId !== selectedPool.pool_id) {
        navigate({
          to: "/pool-debug/$poolId",
          params: { poolId: selectedPool.pool_id },
          replace: true,
        });
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_POOL);
      if (urlPoolId) {
        navigate({
          to: "/pool-debug",
          replace: true,
        });
      }
    }
  }, [selectedPool, navigate, urlPoolId]);

  const isUrlInSync = !selectedPool || urlPoolId === selectedPool.pool_id;

  const tabItems = [
    {
      key: "debugger",
      label: t("tabs.poolDebug.debugger"),
      content: (
        <DebuggerTab
          selectedPool={isUrlInSync ? selectedPool : null}
          onSelectPool={setSelectedPool}
        />
      ),
      visible: true,
    },
    {
      key: "cheatsheet",
      label: t("tabs.poolDebug.cheatSheet"),
      content: <CheatSheetTab />,
      visible: true,
    },
  ];

  return (
    <PageBase
      metadataTitle='poolDebug'
      title={t("pages:poolDebug.title")}
      breadcrumbItems={[{ label: t("pages:breadcrumbs.poolDebug") }]}
      adsCarousel={false}
    >
      <div className='flex w-full max-w-desktop flex-col gap-3 p-mobile lg:p-desktop'>
        <Tabs items={tabItems} />
      </div>
    </PageBase>
  );
};
