import type { FC } from "react";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import Dropdown from "../global/dropdowns/Dropdown";
import { dexConfig } from "@/constants/dexConfig";
import type { DeFiOrder } from "@/types/tokenTypes";
import { renderWithException } from "@/utils/renderWithException";

interface FeeDropdownProps {
  total: number | undefined;
  orders: DeFiOrder[] | undefined;
  getFeeAmount: (order: DeFiOrder) => number | undefined;
  dropdownId: string;
}

export const FeeDropdown: FC<FeeDropdownProps> = ({
  total,
  orders,
  getFeeAmount,
  dropdownId,
}) => {
  return renderWithException(
    typeof total === "number",
    Array.isArray(orders) && orders.length > 1 ? (
      <Dropdown
        id={dropdownId}
        label={<AdaWithTooltip data={(total ?? 0) * 1e6} />}
        options={orders.map(order => ({
          label: (
            <div className='pointer-events-none flex items-center gap-2'>
              <span>
                {dexConfig[order.dex.toUpperCase()]?.label || order.dex}:
              </span>
              <AdaWithTooltip data={(getFeeAmount(order) ?? 0) * 1e6} />
            </div>
          ),
          onClick: () => {},
        }))}
        width='fit-content'
        triggerClassName='rounded-xl border border-border px-1 py-1/2 text-text-sm hover:bg-gray-50 cursor-default'
        poppoverClassname='w-fit !left-0 !right-auto [&_div[role=menuitem]]:hover:!bg-transparent [&_div[role=menuitem]]:hover:!text-inherit [&_div[role=menuitem]]:cursor-default'
        withBorder={true}
        disableHover={true}
        forceVerticalPosition='down'
      />
    ) : (
      <AdaWithTooltip data={(total ?? 0) * 1e6} />
    ),
  );
};
