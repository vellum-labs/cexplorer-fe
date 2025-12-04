import type { GenesisAddress } from "@/types/analyticsTypes";
import type {
  GenesisAddressesTableColumns,
  TableColumns,
} from "@/types/tableTypes";
import type { FC } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import AddressCell from "@/components/address/AddressCell";
import ExportButton from "@/components/table/ExportButton";
import { genesisAddressesTableOptions } from "@/constants/tables/genesisAddressesTableOptions";
import { useFetchGenesisAddresses } from "@/services/analytics";
import { useGenesisAddressesTableStore } from "@/stores/tables/genesisAddressesTableStore";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";

export const GenesisAddressesPage: FC = () => {
  const { infiniteScrolling } = useInfiniteScrollingStore();
  const { page } = useSearch({ from: "/analytics/genesis" });

  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsVisibility,
    columnsOrder,
    rows,
    setColumnVisibility,
    setRows,
    setColumsOrder,
  } = useGenesisAddressesTableStore()();

  const genesisQuery = useFetchGenesisAddresses(
    infiniteScrolling ? 0 : (page ?? 1) * rows - rows,
    rows,
  );

  const totalAddresses = genesisQuery.data?.pages[0].data.count;
  const items = genesisQuery.data?.pages.flatMap(page => page.data.data);

  const columns: TableColumns<GenesisAddress> = [
    {
      key: "order",
      render: () => null,
      title: "#",
      standByRanking: true,
      visible: columnsVisibility.order,
      widthPx: 30,
    },
    {
      key: "address",
      render: item => {
        if (!item.address) {
          return "-";
        }

        return <AddressCell address={item.address} />;
      },
      title: "Address",
      visible: columnsVisibility.address,
      widthPx: 150,
    },
    {
      key: "value",
      render: item => {
        if (!item.value) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.value} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Initial Value</p>,
      visible: columnsVisibility.value,
      widthPx: 80,
    },
    {
      key: "balance",
      render: item => {
        if (!item.detail?.balance) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.detail.balance} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Current Balance</p>,
      visible: columnsVisibility.balance,
      widthPx: 80,
    },
    {
      key: "first_activity",
      render: item => {
        if (!item.detail?.first) {
          return <p>-</p>;
        }

        return <DateCell time={item.detail.first} />;
      },
      title: <p>First activity</p>,
      visible: columnsVisibility.first_activity,
      widthPx: 60,
    },
    {
      key: "last_activity",
      render: item => {
        if (!item.detail?.last) {
          return <p>-</p>;
        }

        return <DateCell time={item.detail.last} />;
      },
      title: <p>Last activity</p>,
      visible: columnsVisibility.last_activity,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (totalAddresses !== undefined && totalAddresses !== totalItems) {
      setTotalItems(totalAddresses);
    }
  }, [totalAddresses, totalItems]);

  return (
    <PageBase
      metadataTitle='genesisAddresses'
      breadcrumbItems={[
        { label: "Analytics", link: "/analytics" },
        { label: "Genesis Addresses" },
      ]}
      title='Genesis Addresses'
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
            {totalItems === 0 &&
            (genesisQuery.isLoading || genesisQuery.isFetching) ? (
              <LoadingSkeleton height='27px' width='220px' />
            ) : totalItems > 0 ? (
              <h3 className='basis-[230px] text-nowrap'>
                Total of {formatNumber(totalItems)} genesis addresses
              </h3>
            ) : (
              ""
            )}
            <div className='flex items-center gap-1'>
              <ExportButton
                columns={columns}
                items={items}
                currentPage={page ?? 1}
              />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                columnsOptions={genesisAddressesTableOptions.map(item => {
                  return {
                    label: item.name,
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(item.key, !columnsVisibility[item.key]),
                  };
                })}
              />
            </div>
          </div>
        </div>
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={totalItems}
          itemsPerPage={rows}
          scrollable
          query={genesisQuery}
          items={items}
          minContentWidth={900}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(
                a.key as keyof GenesisAddressesTableColumns,
              ) -
              columnsOrder.indexOf(b.key as keyof GenesisAddressesTableColumns)
            );
          })}
          onOrderChange={setColumsOrder}
        />
      </section>
    </PageBase>
  );
};
