import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFetchTopMultiDelegators } from "@/services/pools";
import { lovelaceToAda } from "@vellumlabs/cexplorer-sdk";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { useMultiPoolDelegatorsTableStore } from "@/stores/tables/multiPoolDelegatorsTableStore";
import { multiPoolDelegatorsTableOptions } from "@/constants/tables/multiPoolDelegatorsTableOptions";
import ExportButton from "@/components/table/ExportButton";
import { StakeCell } from "@vellumlabs/cexplorer-sdk";
import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const MultiPoolDelegatorsPage = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const { page } = useSearch({ from: "/multi-pool-delegations/" });

  const {
    rows,
    setRows,
    setColumsOrder,
    columnsOrder,
    columnsVisibility,
    setColumnVisibility,
  } = useMultiPoolDelegatorsTableStore();

  const [total, setTotal] = useState(0);

  const delegatorsQuery = useFetchTopMultiDelegators(
    rows,
    (page ?? 1) * rows - rows,
  );

  const items = delegatorsQuery.data?.pages[0].data.data ?? [];
  const count = delegatorsQuery.data?.pages[0].data.count ?? 0;

  const maxStake = 10000000000000;

  const columns = [
    {
      key: "payment_cred",
      title: t("delegations.table.paymentCredential"),
      visible: columnsVisibility.payment_cred,
      widthPx: 200,
      render: (row: any) => (
        <Link
          to='/script/$hash'
          params={{ hash: row.payment_cred ?? "" }}
          className='text-primary'
        >
          {formatString(row.payment_cred, "long")}
        </Link>
      ),
      jsonFormat: (row: any) => row.payment_cred,
    },
    {
      key: "stake",
      title: t("common:labels.stake"),
      visible: columnsVisibility.stake,
      widthPx: 160,
      render: (row: any) => (
        <StakeCell stake={row.stake.balance ?? 0} maxStake={maxStake} />
      ),
      jsonFormat: (row: any) => lovelaceToAda(row.stake.balance ?? 0),
    },
    {
      key: "delegated_to",
      title: <p className='w-full text-right'>{t("delegations.table.stakeKeys")}</p>,
      visible: columnsVisibility.delegated_to,
      widthPx: 200,
      render: (row: any) => (
        <div className='flex justify-end'>
          <Badge
            color='blue'
            className='min-w-[50px] justify-center text-center text-text-xs'
          >
            {row.stake.count}
          </Badge>
        </div>
      ),
      jsonFormat: (row: any) => row.stake.count,
    },
  ];

  useEffect(() => {
    if (count && count !== total) {
      setTotal(count);
    }
  }, [count, total]);

  return (
    <PageBase
      metadataTitle='multiPoolDelegators'
      title={t("delegations.multiPool.title")}
      breadcrumbItems={[{ label: t("delegations.multiPool.title") }]}
    >
      <section className='w-full max-w-desktop px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-2 md:flex-nowrap md:items-center'>
          {!total ? (
            <LoadingSkeleton height='27px' width={"290px"} />
          ) : (
            <h3 className='basis-[230px] text-nowrap'>
              {t("common:phrases.totalOf")} {formatNumber(total)} {t("delegations.multiPool.totalOfSuffix")}
            </h3>
          )}
          <div className='flex items-center gap-1'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              columnsOptions={multiPoolDelegatorsTableOptions.map(col => ({
                label: t(`common:tableSettings.${col.key}`),
                isVisible: columnsVisibility[col.key],
                onClick: () =>
                  setColumnVisibility(col.key, !columnsVisibility[col.key]),
              }))}
            />
          </div>
        </div>
        <GlobalTable
          type='infinite'
          currentPage={page ?? 1}
          totalItems={total}
          itemsPerPage={rows}
          query={delegatorsQuery}
          items={items}
          columns={columns.sort(
            (a, b) =>
              columnsOrder.indexOf(a.key as keyof typeof columnsVisibility) -
              columnsOrder.indexOf(b.key as keyof typeof columnsVisibility),
          )}
          onOrderChange={setColumsOrder}
          scrollable
        />
      </section>
    </PageBase>
  );
};
