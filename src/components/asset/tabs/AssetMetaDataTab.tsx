import { useState, type FC } from "react";

import { useFetchAssetMetadata } from "@/services/assets";

import { Dropdown } from "@vellumlabs/cexplorer-sdk";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { SensitiveContentWarning } from "@vellumlabs/cexplorer-sdk";
import { formatString } from "@vellumlabs/cexplorer-sdk";

interface AssetMetaDataTabProps {
  name: string | undefined;
  policy: string | undefined;
}

export const AssetMetaDataTab: FC<AssetMetaDataTabProps> = ({
  name,
  policy,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showContent, setShowContent] = useState(() => {
    return localStorage.getItem("showSensitiveContent") === "true";
  });

  const assetName = policy && name ? policy + name : undefined;
  const { data, isLoading, isFetching, isError } =
    useFetchAssetMetadata(assetName);

  const items = (data?.data?.data || []).filter(item => item?.tx?.hash);

  const tabOptions = (items || []).map((item, index) => ({
    label: (
      <span className={currentIndex === index ? "text-primary" : ""}>
        Tx: {formatString(item?.tx?.hash, "long")}
      </span>
    ),
    onClick: () => setCurrentIndex(index),
  }));

  if (isLoading || isFetching) {
    return (
      <div className='flex flex-grow flex-col gap-1.5 md:flex-shrink-0'>
        <LoadingSkeleton height='500px' width='100%' rounded='lg' />
      </div>
    );
  }

  if (!showContent) {
    return (
      <SensitiveContentWarning
        onDisplay={() => setShowContent(true)}
        localStorageKey='showSensitiveContent'
        title='User-generated content'
        description='Following content is user-generated and unmoderated by the Cexplorer team.'
      />
    );
  }

  return (
    <div className='flex flex-grow flex-col gap-1.5 md:flex-shrink-0'>
      <>
        {items.length > 0 && (
          <div className='w-fit border'>
            <Dropdown
              id='1'
              width='200px'
              label={`Tx: ${formatString((items || [])[currentIndex]?.tx?.hash, "long")}`}
              options={tabOptions}
              triggerClassName='text-primary font-medium px-1.5 py-1'
              closeOnSelect
            />
          </div>
        )}
        <JsonDisplay
          data={(items || [])[currentIndex]?.json}
          isLoading={isLoading || isFetching}
          isError={isError || items.length === 0}
          search
        />
      </>
    </div>
  );
};
