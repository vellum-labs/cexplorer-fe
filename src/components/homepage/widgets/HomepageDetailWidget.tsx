import type { WidgetDataTypes, WidgetTypes } from "@/types/widgetTypes";
import type { FC } from "react";

import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import { OverviewCard } from "@/components/global/cards/OverviewCard";
import SortBy from "@/components/ui/sortBy";

import { useEffect, useState } from "react";
import { useGetDetailWidget } from "@/hooks/widget/useGetWidget";

interface HomepageDetailWidgetProps {
  type: WidgetTypes;
  dataType: WidgetDataTypes;
  detailAddr: string;
}

export const HomepageDetailWidget: FC<HomepageDetailWidgetProps> = ({
  dataType,
  detailAddr,
  type,
}) => {
  const { isLoading, list, title } = useGetDetailWidget(
    type,
    dataType,
    detailAddr,
  );
  const [selectedItem, setSelectedItem] = useState<string>();

  const selectItems = list
    .map(item => item[0])
    .reduce((acc, key) => {
      const accValue = key.replace(/([A-Z])/g, " $1").toLowerCase();

      (acc as any).push({
        key,
        value: accValue[0].toUpperCase() + accValue.slice(1),
      });

      return acc;
    }, []);

  const item = list.find(item => item[0] === selectedItem);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const localStorageDetailBlock = localStorage.getItem("detail_widgets");

    if (!localStorageDetailBlock) {
      const detail = {
        [detailAddr]: selectedItem,
      };

      localStorage.setItem("detail_widgets", JSON.stringify(detail));
      return;
    }

    const detailBlocks = JSON.parse(localStorageDetailBlock);

    localStorage.setItem(
      "detail_widgets",
      JSON.stringify({
        ...detailBlocks,
        [detailAddr]: selectedItem,
      }),
    );
  }, [selectedItem]);

  useEffect(() => {
    const detailBlocks = localStorage.getItem("detail_widgets");

    if (!detailBlocks) {
      setSelectedItem(list[0][0]);
      return;
    }

    const detailBlocksParsed = JSON.parse(detailBlocks);

    if (!detailBlocksParsed[detailAddr]) {
      setSelectedItem(list[0][0]);
      return;
    }

    setSelectedItem(detailBlocksParsed[detailAddr]);
  }, []);

  return isLoading ? (
    <LoadingSkeleton height='100%' />
  ) : (
    <div className='flex h-full flex-col items-end'>
      <div className='flex w-full items-center justify-between gap-1.5 p-1'>
        {title && title}
        <div className='flex flex-wrap items-center gap-x-1'>
          <span className='text-text-xs text-grayTextPrimary'>Detail block: </span>
          <SortBy
            selectItems={selectItems as any}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem as any}
            label={false}
            className=''
          />
        </div>
      </div>
      <OverviewCard
        className='h-full !rounded-none !rounded-b-lg !border-none'
        title=''
        overviewList={item ? item[1] : []}
      />
    </div>
  );
};
