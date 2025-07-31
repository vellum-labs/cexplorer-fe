import { useState, type FC } from "react";

import { useFetchAssetMetadata } from "@/services/assets";

import Dropdown from "@/components/global/dropdowns/Dropdown";
import { JsonDisplay } from "@/components/global/JsonDisplay";
import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { formatString } from "@/utils/format/format";

interface AssetMetaDataTabProps {
  name: string | undefined;
  policy: string | undefined;
}

export const AssetMetaDataTab: FC<AssetMetaDataTabProps> = ({
  name,
  policy,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
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

  return (
    <div className='flex flex-grow flex-col gap-3 md:flex-shrink-0'>
      {isLoading || isFetching ? (
        <LoadingSkeleton height='500px' width='100%' rounded='lg' />
      ) : (
        <>
          {items.length > 0 && (
            <div className='w-fit border'>
              <Dropdown
                id='1'
                width='200px'
                label={`Tx: ${formatString((items || [])[currentIndex]?.tx?.hash, "long")}`}
                options={tabOptions}
                triggerClassName='text-primary font-medium px-3 py-2'
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
      )}
    </div>
  );
};
