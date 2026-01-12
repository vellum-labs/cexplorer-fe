import { ConstLabelBadge } from "@vellumlabs/cexplorer-sdk";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { SensitiveContentWarning } from "@vellumlabs/cexplorer-sdk";
import { useFetchTxDetail } from "@/services/tx";
import type { TxMetadata } from "@/types/txTypes";
import { getRouteApi } from "@tanstack/react-router";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useState } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const MetadataTabItem = () => {
  const { t } = useAppTranslation("common");
  const route = getRouteApi("/tx/$hash");
  const { hash } = route.useParams();
  const query = useFetchTxDetail(hash);
  const metadata = query?.data?.data?.metadata;
  const metadataArr: TxMetadata[] = [];

  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);

  const [showContent, setShowContent] = useState(() => {
    return localStorage.getItem("showSensitiveContent") === "true";
  });

  for (const obj in metadata) {
    metadataArr.push({ [obj]: metadata[obj] });
  }
  if (!metadata && !query.isLoading) {
    return <p className='w-full text-center text-text-sm'>{t("tx.noMetadataFound")}</p>;
  }

  if (query.isLoading) {
    return (
      <div className='flex flex-col gap-1.5'>
        <LoadingSkeleton rounded='xl' height='130px' />
      </div>
    );
  }

  if (!showContent) {
    return (
      <SensitiveContentWarning
        onDisplay={() => setShowContent(true)}
        localStorageKey='showSensitiveContent'
        title={t("tx.userGeneratedContent")}
        description={t("tx.userGeneratedContentDescription")}
      />
    );
  }

  return (
    <div className='flex flex-col gap-1.5'>
      {metadataArr.map((item, index) => (
        <section
          key={index}
          className='flex flex-col rounded-l border border-b border-border bg-darker px-2 py-1.5 shadow-md'
        >
          <div className='mb-1 flex items-center gap-1/2'>
            <div className='w-fit rounded-s border border-border bg-background px-1 py-1/2 text-text-xs font-medium'>
              {Object.values(item)[0].key}
            </div>
            <ConstLabelBadge
              type='metadatum'
              name={Object.values(item)[0].key}
              className='h-7'
              miscConst={miscConst}
            />
          </div>
          <JsonDisplay
            data={Object.values(item)[0]?.md ?? {}}
            isLoading={query.isLoading}
            isError={query.isError}
            search
          />
        </section>
      ))}
    </div>
  );
};

export default MetadataTabItem;
