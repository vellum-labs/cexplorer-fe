import type { EpochParam } from "@/types/epochTypes";
import type { FC } from "react";

import { Download } from "lucide-react";

import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@vellumlabs/cexplorer-sdk";
import { Fragment } from "react";

import { useEffect, useRef } from "react";

import { colors } from "@/constants/colors";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { safeFormatNumber } from "@/utils/safeFormatNumber";

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
  const { t } = useAppTranslation("pages");
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
      title: t("epochs.parameters.explanation"),
      width: 100,
    },
    {
      key: "parameter",
      title: t("epochs.parameters.parameter"),
      width: 85,
    },
    {
      key: "value",
      title: (
        <p className='w-full text-right'>{t("epochs.parameters.value")}</p>
      ),
      width: 85,
    },
  ];

  const rows = [
    {
      key: "min_fee_a",
      columns: [
        {
          title: t("epochs.parameters.minFeeA"),
        },
        {
          title: "min_fee_a",
        },
        {
          title: (
            <p className='w-full text-right'>
              {safeFormatNumber(param?.min_fee_a)}
            </p>
          ),
        },
      ],
    },
    {
      key: "min_fee_b",
      columns: [
        {
          title: t("epochs.parameters.minFeeB"),
        },
        {
          title: "min_fee_b",
        },
        {
          title: (
            <p className='w-full text-right'>
              {safeFormatNumber(param?.min_fee_b)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_block_size",
      columns: [
        {
          title: t("epochs.parameters.maxBlockSize"),
        },
        {
          title: "max_block_size",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.max_block_size)}</p>
          ),
        },
      ],
    },
    {
      key: "max_tx_size",
      columns: [
        {
          title: t("epochs.parameters.maxTxSize"),
        },
        {
          title: "max_tx_size",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.max_tx_size)}</p>
          ),
        },
      ],
    },
    {
      key: "max_bh_size",
      columns: [
        {
          title: t("epochs.parameters.maxBhSize"),
        },
        {
          title: "max_bh_size",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.max_bh_size)}</p>
          ),
        },
      ],
    },
    {
      key: "key_deposit",
      columns: [
        {
          title: t("epochs.parameters.keyDeposit"),
        },
        {
          title: "key_deposit",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.key_deposit)}</p>
          ),
        },
      ],
    },
    {
      key: "pool_deposit",
      columns: [
        {
          title: t("epochs.parameters.poolDeposit"),
        },
        {
          title: "pool_deposit",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.pool_deposit)}</p>
          ),
        },
      ],
    },
    {
      key: "max_epoch",
      columns: [
        {
          title: t("epochs.parameters.maxEpoch"),
        },
        {
          title: "max_epoch",
        },
        {
          title: (
            <p className='w-full text-right'>
              {safeFormatNumber(param?.max_epoch)}
            </p>
          ),
        },
      ],
    },
    {
      key: "optimal_pool_count",
      columns: [
        {
          title: t("epochs.parameters.optimalPoolCount"),
        },
        {
          title: "optimal_pool_count",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.optimal_pool_count)}
            </p>
          ),
        },
      ],
    },
    {
      key: "influence",
      columns: [
        {
          title: t("epochs.parameters.influence"),
        },
        {
          title: "influence",
        },
        {
          title: (
            <p className='w-full text-right'>
              {safeFormatNumber(param?.influence)}
            </p>
          ),
        },
      ],
    },
    {
      key: "monetary_expand_rate",
      columns: [
        {
          title: t("epochs.parameters.monetaryExpandRate"),
        },
        {
          title: "monetary_expand_rate",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.monetary_expand_rate)}
            </p>
          ),
        },
      ],
    },
    {
      key: "treasury_growth_rate",
      columns: [
        {
          title: t("epochs.parameters.treasuryGrowthRate"),
        },
        {
          title: "treasury_growth_rate",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.treasury_growth_rate)}
            </p>
          ),
        },
      ],
    },
    {
      key: "decentralisation",
      columns: [
        {
          title: t("epochs.parameters.decentralisation"),
        },
        {
          title: "decentralisation",
        },
        {
          title: (
            <p className='text-right'>
              {param?.decentralisation && param.decentralisation > 0
                ? safeFormatNumber(param?.decentralisation)
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
          title: t("epochs.parameters.protocolMajor"),
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
          title: t("epochs.parameters.protocolMinor"),
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
          title: t("epochs.parameters.minUtxoValue"),
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
          title: t("epochs.parameters.minPoolCost"),
        },
        {
          title: "min_pool_cost",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.min_pool_cost)}</p>
          ),
        },
      ],
    },
    {
      key: "nonce",
      columns: [
        {
          title: t("epochs.parameters.nonce"),
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
          title: t("epochs.parameters.priceMem"),
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
          title: t("epochs.parameters.priceStep"),
        },
        {
          title: "price_step",
        },
        {
          title: (
            <p className='w-full text-right'>
              {param?.price_step ? +param.price_step : null}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_tx_ex_mem",
      columns: [
        {
          title: t("epochs.parameters.maxTxExMem"),
        },
        {
          title: "max_tx_ex_mem",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.max_tx_ex_mem)}</p>
          ),
        },
      ],
    },
    {
      key: "max_tx_ex_steps",
      columns: [
        {
          title: t("epochs.parameters.maxTxExSteps"),
        },
        {
          title: "max_tx_ex_steps",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.max_tx_ex_steps)}</p>
          ),
        },
      ],
    },
    {
      key: "max_block_ex_mem",
      columns: [
        {
          title: t("epochs.parameters.maxBlockExMem"),
        },
        {
          title: "max_block_ex_mem",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.max_block_ex_mem)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_block_ex_steps",
      columns: [
        {
          title: t("epochs.parameters.maxBlockExSteps"),
        },
        {
          title: "max_block_ex_steps",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.max_block_ex_steps)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_val_size",
      columns: [
        {
          title: t("epochs.parameters.maxValSize"),
        },
        {
          title: "max_val_size",
        },
        {
          title: (
            <p className='text-right'>{safeFormatNumber(param?.max_val_size)}</p>
          ),
        },
      ],
    },
    {
      key: "collateral_percent",
      columns: [
        {
          title: t("epochs.parameters.collateralPercent"),
        },
        {
          title: "collateral_percent",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.collateral_percent)}
            </p>
          ),
        },
      ],
    },
    {
      key: "max_collateral_inputs",
      columns: [
        {
          title: t("epochs.parameters.maxCollateralInputs"),
        },
        {
          title: "max_collateral_inputs",
        },
        {
          title: (
            <p className='text-right'>
              {safeFormatNumber(param?.max_collateral_inputs)}
            </p>
          ),
        },
      ],
    },
  ];

  return (
    <>
      <div className='flex w-full items-center justify-between gap-1'>
        <h3 className='basis-[220px]'>{t("epochs.parameters.title")}</h3>
        <div className='flex h-[40px] w-fit shrink-0 items-center justify-center gap-1/2 rounded-s border border-border px-1.5'>
          <Download size={20} color={colors.text} />
          <span className='text-text-sm font-medium'>
            {t("epochs.parameters.export")}
          </span>
        </div>
      </div>
      <div
        className='thin-scrollbar relative mt-3 w-full max-w-desktop -scale-100 overflow-x-auto rounded-l border border-border [&>div]:w-full'
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
