import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import React from "react";

type Props = {
  rows: number;
  visibleRows?: boolean;
  setRows: (rows: number) => void;
  columnsOptions: {
    label: ReactNode;
    isVisible: boolean;
    onClick?: any;
  }[];
  customContent?: ReactNode;
  customStyles?: CSSProperties;
};

const TableSettingsDropdown = ({
  columnsOptions,
  rows,
  setRows,
  visibleRows = true,
  customContent,
  customStyles,
}: Props) => {
  columnsOptions = columnsOptions.filter(
    item => typeof item.isVisible !== "undefined",
  );

  return (
    <NavigationMenu delayDuration={100}>
      <NavigationMenuList className=''>
        <NavigationMenuItem className=''>
          <NavigationMenuTrigger
            className='bg-cardBg p-0'
            onPointerMove={e => e.preventDefault()}
            onPointerLeave={e => e.preventDefault()}
            //@ts-expect-error hideChevron is not a valid prop
            hideChevron
          >
            {customContent ? (
              customContent
            ) : (
              <div className='flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-md border border-border'>
                <Settings size={22} />
              </div>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            onPointerLeave={e => e.preventDefault()}
            className='z-20 grid w-[150px] rounded-md border-[1px] border-border bg-background text-sm font-medium'
            style={customStyles}
          >
            <div>
              <Select
                defaultValue={String(rows)}
                onValueChange={value => {
                  setRows(Number(value));
                }}
              >
                {visibleRows && (
                  <div className='flex h-14 w-full items-center justify-between border-b border-border px-3'>
                    <span>Rows:</span>
                    <SelectTrigger className='w-[60px]'>
                      <SelectValue
                        placeholder={
                          <div className='flex w-full items-center justify-between gap-1 uppercase'>
                            <span>{rows}</span>
                          </div>
                        }
                      />
                    </SelectTrigger>
                  </div>
                )}
                <SelectContent align='end'>
                  {Array.from({ length: 50 }, (_, i) => i + 1)
                    .filter(item => item % 10 === 0)
                    .map(i => (
                      <SelectItem
                        className='flex w-full cursor-pointer justify-between px-2'
                        key={i}
                        value={String(i)}
                      >
                        <span>{i}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {columnsOptions.map((option, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex h-full cursor-pointer justify-between border-b-[1px] border-border p-3 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0 hover:bg-darker`}
                  onClick={option.onClick}
                >
                  <span>{option.label}</span>
                  <span>{option.isVisible && "✓"}</span>
                </div>
              </React.Fragment>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TableSettingsDropdown;
