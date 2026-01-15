import { poolBlocksTableOptions } from "@/constants/tables/poolBlocksTableOptions";
import { useFetchBlocksList } from "@/services/blocks";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { usePoolBlocksTableStore } from "@/stores/tables/poolBlocksTableStore";
import type { PoolBlocksColumns } from "@/types/tableTypes";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { BlockCell } from "@vellumlabs/cexplorer-sdk";
import { EpochCell } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "../table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { SizeCell } from "@vellumlabs/cexplorer-sdk";
import { ProtocolDot } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { HashCell } from "@/components/tx/HashCell";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface Props {
  poolId: string;
}

const PoolBlocksTable = ({ poolId }: Props) => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/pool/$id" });
  const {
    columnsVisibility,
    columnsOrder,
    setColumsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolBlocksTableStore();
  const [totalItems, setTotalItems] = useState(0);

  const { data: basicData } = useFetchMiscBasic();
  const miscData = useMiscConst(basicData?.data?.version?.const);

  const poolBlocksQuery = useFetchBlocksList(
    rows,
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    true,
    poolId,
  );

  const totalBlocks = poolBlocksQuery.data?.pages[0].data.count;
  const items = poolBlocksQuery.data?.pages.flatMap(page => page.data.data);
  const filteredItems = items?.filter(item => item?.block_no);

  const columns = [
    {
      key: "date",
      render: item => <DateCell time={item.time} />,
      jsonFormat: item => {
        if (!item.time) {
          return "-";
        }

        return item.time;
      },
      title: t("common:labels.date"),
      visible: columnsVisibility.date,
      widthPx: 65,
    },
    {
      key: "block_no",
      render: item => <BlockCell hash={item.hash} no={item.block_no ?? 0} />,
      title: <p className='w-full text-right'>{t("common:labels.height")}</p>,
      visible: columnsVisibility.block_no,
      widthPx: 75,
    },
    {
      key: "epoch_no",
      render: item => <EpochCell no={item.epoch_no} />,
      title: <p className='w-full text-right'>{t("common:labels.epoch")}</p>,
      visible: columnsVisibility.epoch_no,
      widthPx: 50,
    },
    {
      key: "slot_no",
      render: item => (
        <p className='text-right'>{formatNumber(item.slot_no)}</p>
      ),
      title: <p className='w-full text-right'>{t("common:labels.slot")}</p>,
      visible: columnsVisibility.slot_no,
      widthPx: 80,
    },
    {
      key: "tx_count",
      render: item => <p className='text-right'>{item.tx_count}</p>,
      title: (
        <p className='w-full text-right'>
          {t("pools.detailPage.blocksTable.txs")}
        </p>
      ),
      visible: columnsVisibility.tx_count,
      widthPx: 50,
    },
    {
      key: "hash",
      render: item => (
        <div className='flex justify-end'>
          <HashCell hash={item.hash} href='/block/$hash' formatType='long' />
        </div>
      ),
      jsonFormat: item => {
        if (!item.hash) {
          return "-";
        }

        return item.hash;
      },
      title: (
        <p className='flex w-full justify-end'>{t("common:labels.hash")}</p>
      ),
      visible: columnsVisibility.hash,
      widthPx: 90,
    },
    {
      key: "size",
      title: t("common:labels.size"),
      render: item => (
        <div className='text-right'>
          {
            <SizeCell
              maxSize={item.epoch_param?.max_block_size ?? 0}
              size={item.size}
            />
          }
        </div>
      ),
      jsonFormat: item => {
        const elapsedPercentage =
          (item?.size * 100) / (item.epoch_param?.max_block_size ?? 0);

        return (
          "Size: " +
          ((item?.size ?? 0) / 1024).toFixed(2) +
          "kB" +
          " Percentage: " +
          (elapsedPercentage ?? 0).toFixed(2) +
          "%"
        );
      },
      visible: columnsVisibility.size,
      widthPx: 90,
    },
    {
      key: "protocol",
      render: item => (
        <div className='flex items-center justify-end gap-1'>
          <ProtocolDot
            protNo={Number(`${item.proto_major}.${item.proto_minor}`)}
            miscData={miscData}
          />
          <p className='text-right'>{`${item.proto_major}.${item.proto_minor}`}</p>
        </div>
      ),
      jsonFormat: item => {
        if (!item.protocol) {
          return "-";
        }

        return `${item.protocol.major}.${item.protocol.minor}`;
      },
      title: (
        <span className='flex w-full justify-end'>
          {t("common:labels.protocol")}
        </span>
      ),
      visible: columnsVisibility.protocol,
      widthPx: 50,
    },
    {
      key: "cert_counter",
      render: item => (
        <p className='text-right'>{item.op_cert_counter ?? "-"}</p>
      ),
      title: (
        <p className='w-full text-right'>
          {t("pools.detailPage.blocksTable.certCount")}
        </p>
      ),
      visible: columnsVisibility.cert_counter,
      widthPx: 70,
    },
  ];

  useEffect(() => {
    if (totalBlocks && totalBlocks !== totalItems) {
      setTotalItems(totalBlocks);
    }
  }, [totalBlocks, totalItems]);

  return (
    <>
      <div className='flex items-center gap-1'>
        <ExportButton columns={columns} items={items} />
        <TableSettingsDropdown
          rows={rows}
          setRows={setRows}
          rowsLabel={t("common:table.rows")}
          columnsOptions={poolBlocksTableOptions.map(item => {
            return {
              label: t(`common:tableSettings.${item.key}`),
              isVisible: columnsVisibility[item.key],
              onClick: () =>
                setColumnVisibility(item.key, !columnsVisibility[item.key]),
            };
          })}
        />
      </div>
      <GlobalTable
        type='infinite'
        currentPage={page ?? 1}
        totalItems={totalItems}
        itemsPerPage={rows}
        scrollable
        query={poolBlocksQuery}
        items={filteredItems}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof PoolBlocksColumns) -
            columnsOrder.indexOf(b.key as keyof PoolBlocksColumns)
          );
        })}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("common:table.displaying", { count, total })
        }
        noItemsLabel={t("common:table.noItems")}
      />
    </>
  );
};

export default PoolBlocksTable;
