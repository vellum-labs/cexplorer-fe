import { Link, type FileRoutesByPath } from "@tanstack/react-router";
import type { FC } from "react";

import { WidgetDataTypes } from "@/types/widgetTypes";
import { WidgetTypes } from "@/types/widgetTypes";

import { ArrowRight, X } from "lucide-react";

import { HomepageGraphWidget } from "../widgets/HomepageGraphWidget";
import { HomepageDetailWidget } from "../widgets/HomepageDetailWidget";
import { HomepageTableWidget } from "../widgets/HomepageTableWidget";

import { useHomepageStore } from "@/stores/homepageStore";

interface HomepageGridItemProps {
  title: string;
  linkTitle: string;
  link: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  type: WidgetTypes;
  dataType: WidgetDataTypes;
  rowHeight?: number;
  detailAddr?: string;
  width: number;
}

export const HomepageGridItem: FC<HomepageGridItemProps> = ({
  title,
  type,
  dataType,
  linkTitle,
  link,
  rowHeight,
  detailAddr,
  width,
}) => {
  const { customize, handleRemoveWidget } = useHomepageStore();

  return (
    <div className='relative h-full w-full'>
      <div className='relative flex h-[50px] items-center justify-between border-b border-border px-1.5'>
        {customize && (
          <X
            className='absolute right-1 top-1 cursor-pointer text-grayTextPrimary'
            size={13}
            onMouseDown={e => {
              e.stopPropagation();
              handleRemoveWidget(title, detailAddr);
            }}
          />
        )}
        {<span className='text-lg font-semibold'>{title}</span>}
        {type === WidgetTypes.TABLE && (
          <Link to={link}>
            <div className='flex items-center gap-1'>
              <span className='text-sm font-semibold text-primary'>
                {linkTitle}
              </span>
              <ArrowRight size={15} className='text-primary' />
            </div>
          </Link>
        )}
      </div>

      <div
        className={`thin-scrollbar w-full ${type === WidgetTypes.TABLE ? "h-[calc(100%-130px)]" : "h-[calc(100%-50px)]"} ${dataType === WidgetDataTypes.EPOCH ? "overflow-y-hidden" : "overflow-y-auto"}`}
        onMouseDown={e => {
          e.stopPropagation();
        }}
      >
        {type === WidgetTypes.TABLE && (
          <HomepageTableWidget
            rowHeight={rowHeight}
            type={type}
            dataType={dataType}
            width={width}
          />
        )}
        {type === WidgetTypes.GRAPH && (
          <HomepageGraphWidget type={type} dataType={dataType} />
        )}
        {type === WidgetTypes.DETAIL && detailAddr && (
          <HomepageDetailWidget
            type={type}
            dataType={dataType}
            detailAddr={detailAddr}
          />
        )}
      </div>
      {type === WidgetTypes.TABLE && <div className='h-[80px] w-full'></div>}
    </div>
  );
};
