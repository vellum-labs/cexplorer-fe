import { WidgetDataTypes } from "@/types/widgetTypes";
import type { FileRoutesByPath } from "@tanstack/react-router";
import type { FC } from "react";

import TableSearchInput from "@/components/global/inputs/SearchInput";

import { WidgetTypes } from "@/types/widgetTypes";

import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useFetchMiscValidate } from "@/services/misc";
import { useHomepageStore } from "@/stores/homepageStore";
interface HomepageModalWidgetProps {
  widget: {
    type: WidgetTypes;
    dataType: WidgetDataTypes;
    title: string;
    linkTitle: string;
    link: FileRoutesByPath[keyof FileRoutesByPath]["path"];
    img: string;
  };
  active: boolean;
  isResetting: boolean;
  activeCategory: number;
  onClick: () => void;
  onReset: () => void;
}

export const HomepageModalWidget: FC<HomepageModalWidgetProps> = ({
  widget: { title, img, type, dataType },
  active,
  isResetting,
  activeCategory,
  onClick,
  onReset,
}) => {
  const { setWidgetCategories } = useHomepageStore();

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>("");
  const [validIdent, setValidIdent] = useState<boolean>();

  const debouncedTableSearch = useDebounce(tableSearch);

  const validationType =
    dataType === WidgetDataTypes.POOL_DETAIL
      ? "pool"
      : dataType === WidgetDataTypes.ASSET_DETAIL
        ? "asset"
        : "drep";

  const { data } = useFetchMiscValidate(validationType, debouncedTableSearch);

  const handleCard = () => {
    if (onReset) {
      onReset();
    }

    setIsFlipped(open => !open);
  };

  const handleClick = () => {
    setWidgetCategories(prev => {
      const newCategories = [...prev];

      const index = newCategories[activeCategory].widgets.findIndex(
        item => item.title === title,
      );

      if (index !== -1) {
        newCategories[activeCategory].widgets[index].detailAddr =
          debouncedTableSearch;
      }

      return newCategories;
    });
    onClick();
  };

  useEffect(() => {
    if (data?.data?.valid) {
      setValidIdent(true);
      return;
    }

    setValidIdent(false);
  }, [data]);

  useEffect(() => {
    if (isResetting) {
      setIsFlipped(false);
    }
  }, [isResetting]);

  useEffect(() => {
    if (validIdent) {
      handleClick();
      return;
    }

    onReset();
  }, [validIdent]);

  if (type !== WidgetTypes.DETAIL) {
    return (
      <div
        key={title}
        className={`h-[150px] w-[300px] cursor-pointer rounded-lg ${active ? "border border-primary" : ""}`}
        onClick={onClick}
      >
        <img src={img} alt={title} className='rounded-lg' />
      </div>
    );
  }

  return (
    <div
      className={`relative h-[150px] w-[300px] cursor-pointer rounded-lg`}
      onClick={handleCard}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
        }}
      >
        <div
          className='backface-hidden absolute h-full w-full rounded-lg'
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <img src={img} alt={title} className='h-full w-full rounded-lg' />
        </div>

        <div
          className='backface-hidden absolute flex h-full w-full rounded-lg bg-border text-center'
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className='flex flex-col items-start gap-3 p-1.5'>
            <h3 className='text-lg font-bold'>Detail information</h3>
            <div
              className='w-fit'
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <TableSearchInput
                placeholder='Type hash,id,address...'
                value={tableSearch}
                inputClassName='bg-background'
                onchange={setTableSearch}
                wrapperClassName='w-[250px]'
                showSearchIcon
                showPrefixPopup={false}
              />
            </div>
            {debouncedTableSearch && !validIdent && <span>Unknown ident!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
