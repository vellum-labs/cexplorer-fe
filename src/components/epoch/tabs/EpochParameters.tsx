import type { EpochParam } from "@/types/epochTypes";
import type { FC } from "react";

import { Download } from "lucide-react";

import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";

import { useEffect, useRef } from "react";

import { colors } from "@/constants/colors";
import { formatNumber } from "@/utils/format/format";

interface EpochParametersProps {
  param: EpochParam | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const EpochParameters: FC<EpochParametersProps> = ({
  param,
  isError,
  isLoading,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.scrollTo(10000, 0);
    }
  }, []);

  const tableHeader = [
    {
      key: "explanation",
      title: "Explanation",
      width: 100,
    },
    {
      key: "parameter",
      title: "Parameter",
      width: 85,
    },
    {
      key: "value",
      title: <p className='w-full text-right'>Value</p>,
      width: 85,
    },
  ];

  const rows = [
    {
      key: "min_fee_a",
      columns: [
        {
          title: "The 'a' parameter to calculate the minimum transaction fee.",
        },
        {
          title: "min_fee_a",
        },
        {
          title: (
            <p className='w-full text-right'>
              {formatNumber(param?.min_fee_a)}
            </p>
          ),
        },
      ],
    },
    {
      key: "min_fee_b",
      columns: [
        {
          title: "The 'b' parameter to calculate the minimum transaction fee.",
        },
        {
          title: "min_fee_b",
        },
        {
          title: (
            <p className='w-full text-right'>
              {formatNumber(param?.min_fee_b)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_block_size",
      columns: [
        {
          title: "The maximum block size (in bytes).",
        },
        {
          title: "max_block_size",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.max_block_size)}</p>
          ),
        },
      ],
    },
    {
      key: "max_tx_size",
      columns: [
        {
          title: "The maximum transaction size (in bytes).",
        },
        {
          title: "max_tx_size",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.max_tx_size)}</p>
          ),
        },
      ],
    },
    {
      key: "max_bh_size",
      columns: [
        {
          title: "The maximum block header size (in bytes).",
        },
        {
          title: "max_bh_size",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.max_bh_size)}</p>
          ),
        },
      ],
    },
    {
      key: "key_deposit",
      columns: [
        {
          title:
            "The amount (in Lovelace) require for a deposit to register a StakeAddress.",
        },
        {
          title: "key_deposit",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.key_deposit)}</p>
          ),
        },
      ],
    },
    {
      key: "pool_deposit",
      columns: [
        {
          title:
            "The amount (in Lovelace) require for a deposit to register a stake pool.",
        },
        {
          title: "pool_deposit",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.pool_deposit)}</p>
          ),
        },
      ],
    },
    {
      key: "max_epoch",
      columns: [
        {
          title:
            "The maximum number of epochs in the future that a pool retirement is allowed to be scheduled for.",
        },
        {
          title: "max_epoch",
        },
        {
          title: (
            <p className='w-full text-right'>
              {formatNumber(param?.max_epoch)}
            </p>
          ),
        },
      ],
    },
    {
      key: "optimal_pool_count",
      columns: [
        {
          title: "The optimal number of stake pools.",
        },
        {
          title: "optimal_pool_count",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.optimal_pool_count)}
            </p>
          ),
        },
      ],
    },
    {
      key: "influence",
      columns: [
        {
          title:
            "The influence of the pledge on a stake pool's probability on minting a block.",
        },
        {
          title: "influence",
        },
        {
          title: (
            <p className='w-full text-right'>
              {formatNumber(param?.influence)}
            </p>
          ),
        },
      ],
    },
    {
      key: "monetary_expand_rate",
      columns: [
        {
          title: "The monetary expansion rate.",
        },
        {
          title: "monetary_expand_rate",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.monetary_expand_rate)}
            </p>
          ),
        },
      ],
    },
    {
      key: "treasury_growth_rate",
      columns: [
        {
          title: "The treasury growth rate.",
        },
        {
          title: "treasury_growth_rate",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.treasury_growth_rate)}
            </p>
          ),
        },
      ],
    },
    {
      key: "decentralisation",
      columns: [
        {
          title:
            "The decentralisation parameter (1 fully centralised, 0 fully decentralised).",
        },
        {
          title: "decentralisation",
        },
        {
          title: (
            <p className='text-right'>
              {param!.decentralisation > 0
                ? formatNumber(param?.decentralisation)
                : param?.decentralisation}
            </p>
          ),
        },
      ],
    },
    {
      key: "protocol_major",
      columns: [
        {
          title: "The protocol major number.",
        },
        {
          title: "protocol_major",
        },
        {
          title: <p className='w-full text-right'>{param?.protocol_major}</p>,
        },
      ],
    },
    {
      key: "protocol_minor",
      columns: [
        {
          title: "The protocol minor number.",
        },
        {
          title: "protocol_minor",
        },
        {
          title: <p className='w-full text-right'>{param?.protocol_minor}</p>,
        },
      ],
    },
    {
      key: "min_utxo_value",
      columns: [
        {
          title: "The minimum value of a UTxO entry.",
        },
        {
          title: "min_utxo_value",
        },
        {
          title: <p className='w-full text-right'>{param?.min_utxo_value}</p>,
        },
      ],
    },
    {
      key: "min_pool_cost",
      columns: [
        {
          title: "The minimum pool cost.",
        },
        {
          title: "min_pool_cost",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.min_pool_cost)}</p>
          ),
        },
      ],
    },
    {
      key: "nonce",
      columns: [
        {
          title: "The nonce value for this epoch.",
        },
        {
          title: "nonce",
        },
        {
          title: <p className='text-wrap break-words'>{param?.nonce}</p>,
        },
      ],
    },
    {
      key: "price_mem",
      columns: [
        {
          title: "The per word cost of script memory usage.",
        },
        {
          title: "price_mem",
        },
        {
          title: <p className='w-full text-right'>{param?.price_mem}</p>,
        },
      ],
    },
    {
      key: "price_step",
      columns: [
        {
          title: "The cost of script execution step usage.",
        },
        {
          title: "price_step",
        },
        {
          title: <p className='w-full text-right'>{+param!.price_step}</p>,
        },
      ],
    },
    {
      key: "max_tx_ex_mem",
      columns: [
        {
          title:
            "The maximum number of execution memory allowed to be used in a single transaction.",
        },
        {
          title: "max_tx_ex_mem",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.max_tx_ex_mem)}</p>
          ),
        },
      ],
    },
    {
      key: "max_tx_ex_steps",
      columns: [
        {
          title:
            "The maximum number of execution steps allowed to be used in a single transaction.",
        },
        {
          title: "max_tx_ex_steps",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.max_tx_ex_steps)}</p>
          ),
        },
      ],
    },
    {
      key: "max_block_ex_mem",
      columns: [
        {
          title:
            "The maximum number of execution memory allowed to be used in a single block.",
        },
        {
          title: "max_block_ex_mem",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.max_block_ex_mem)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_block_ex_steps",
      columns: [
        {
          title:
            "The maximum number of execution steps allowed to be used in a single block.",
        },
        {
          title: "max_block_ex_steps",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.max_block_ex_steps)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_val_size",
      columns: [
        {
          title: "The maximum Val size.",
        },
        {
          title: "max_val_size",
        },
        {
          title: (
            <p className='text-right'>{formatNumber(param?.max_val_size)}</p>
          ),
        },
      ],
    },
    {
      key: "collateral_percent",
      columns: [
        {
          title:
            "The percentage of the txfee which must be provided as collateral when including non-native scripts.",
        },
        {
          title: "collateral_percent",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.collateral_percent)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_collateral_inputs",
      columns: [
        {
          title:
            "The maximum number of collateral inputs allowed in a transaction.",
        },
        {
          title: "max_collateral_inputs",
        },
        {
          title: (
            <p className='text-right'>
              {formatNumber(param?.max_collateral_inputs)}
            </p>
          ),
        },
      ],
    },
  ];

  return (
    <>
      <div className='flex w-full items-center justify-between gap-1'>
        <h3 className='basis-[220px]'>Epoch Parameters</h3>
        <div className='flex h-[40px] w-fit shrink-0 items-center justify-center gap-1/2 rounded-md border border-border px-1.5'>
          <Download size={20} color={colors.text} />
          <span className='text-sm font-medium'>Export</span>
        </div>
      </div>
      <div
        className='thin-scrollbar relative mt-3 w-full max-w-desktop -scale-100 overflow-x-auto rounded-xl border border-border [&>div]:w-full'
        ref={wrapperRef}
      >
        <Table className='thin-scrollbar -scale-100' minwidth={1300}>
          <TableHeader className='border-none bg-darker'>
            <TableRow>
              {tableHeader.map(({ key, title, width }) => (
                <Fragment key={key}>
                  <TableHead
                    style={{
                      maxWidth: `${width}px`,
                      width: `${width}px`,
                    }}
                    className='table-cell font-semibold first:pl-4 last:pr-4'
                  >
                    {title}
                  </TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ key, columns }, index) => (
              <TableRow
                className={`${index % 2 !== 0 ? "bg-darker" : ""} h-[55px] w-[55px]`}
                key={key}
              >
                {columns.map(({ title }, index) => (
                  <TableCell
                    key={index}
                    style={{
                      width: tableHeader[index].width,
                      maxWidth: tableHeader[index].width,
                    }}
                    className={`table-cell h-[55px] py-1.5 text-left first:pl-4 last:pr-4 [&>a]:text-primary`}
                  >
                    {isError || isLoading || !param ? (
                      <LoadingSkeleton height='20px' />
                    ) : (
                      title
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
