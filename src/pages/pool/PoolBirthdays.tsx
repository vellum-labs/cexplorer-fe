import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { PoolCell } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "@/utils/generateImageUrl";
import type { PoolBirthday } from "@/types/poolTypes";
import type { PoolBirthdaysColumns, TableColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { poolBirthdaysTableOptions } from "@/constants/tables/poolBirthdaysTableOptions";

import { useFetchPoolBirthdays } from "@/services/pools";
import { usePoolBirthdaysTableStore } from "@/stores/tables/poolBirthdaysTableStore";
import { useEffect, useState } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { DateCell } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { formatOrdinalSuffix } from "@/utils/format/formatOrdinalSuffix";
import { format, parse, parseISO } from "date-fns";
import { PageBase } from "@/components/global/pages/PageBase";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const PoolBirthdays: FC = () => {
  const { t } = useAppTranslation(["pages", "common"]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    columnsVisibility,
    setColumsOrder,
    columnsOrder,
    setColumnVisibility,
    rows,
    setRows,
  } = usePoolBirthdaysTableStore();

  const poolsBirthdayQuery = useFetchPoolBirthdays(undefined);

  const totalPools = poolsBirthdayQuery.data?.data?.data?.length;
  const items = poolsBirthdayQuery.data?.data?.data ?? [];

  const columns: TableColumns<PoolBirthday> = [
    {
      key: "date",
      render: item => {
        if (!item.anniversary) {
          return "-";
        }

        return <DateCell time={item.anniversary} />;
      },
      jsonFormat: item => {
        if (!item.anniversary) {
          return "-";
        }

        return item.anniversary;
      },
      title: <p>{t("common:labels.date")}</p>,
      visible: columnsVisibility.date,
      widthPx: 50,
    },
    {
      key: "pool",
      render: item => {
        if (
          !item?.pool?.id &&
          !item.pool?.meta?.ticker &&
          !item.pool?.meta?.name
        ) {
          return "-";
        }

        return (
          <PoolCell
            poolInfo={{
              id: item.pool.id,
              meta: item.pool.meta,
            }}
            poolImageUrl={generateImageUrl(item.pool.id, "ico", "pool")}
          />
        );
      },
      title: t("common:labels.pool"),
      visible: columnsVisibility.pool,
      widthPx: 150,
    },
    {
      key: "birthday",
      render: item => {
        const anniversaryDate = new Date(item?.registered).getTime();
        const now = new Date().getTime();

        const timeDifference = now - anniversaryDate;

        const birthday = formatOrdinalSuffix(
          Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365)),
        );

        return (
          <div className='flex justify-end'>
            <div
              className='flex w-fit items-center justify-center gap-[0.5px] rounded-s border border-border px-1 py-[2px]'
              style={{
                boxShadow: "0px 1px 2px 0px #1018280D",
              }}
            >
              <span className='text-text-sm font-medium'>{birthday?.year}</span>
              <sup className='pt-[4px] font-medium'>{birthday?.suffix}</sup>
            </div>
          </div>
        );
      },
      title: <p className='w-full text-right'>{t("common:labels.birthday")}</p>,
      visible: columnsVisibility.birthday,
      widthPx: 50,
    },
    {
      key: "registered",
      render: item => {
        if (!item?.registered) return "-";

        const [registeredDate, registeredTime] = item.registered.split("T");

        const parsedDate = parseISO(registeredDate);
        const formattedDate = format(parsedDate, "do 'of' MMMM yyyy");

        const parsedTime = parse(registeredTime, "HH:mm:ss", new Date());
        const formattedTime = format(parsedTime, "hh:mm a");

        return (
          <div className='flex flex-col items-end'>
            <span className='text-text-sm'>{formattedDate}</span>
            <span className='text-text-sm'>{formattedTime}</span>
          </div>
        );
      },
      jsonFormat: item => {
        if (!item?.registered) return "-";

        const [registeredDate, registeredTime] = item.registered.split("T");

        const parsedDate = parseISO(registeredDate);
        const formattedDate = format(parsedDate, "do 'of' MMMM yyyy");

        const parsedTime = parse(registeredTime, "HH:mm:ss", new Date());
        const formattedTime = format(parsedTime, "hh:mm a");

        return `${formattedDate}, ${formattedTime}`;
      },
      title: (
        <p className='w-full text-right'>{t("common:labels.registered")}</p>
      ),
      visible: columnsVisibility.registered,
      widthPx: 60,
    },
    {
      key: "delegators",
      render: item => {
        if (!item?.delegators) {
          return <p className='text-right'>-</p>;
        }

        return <p className='text-right'>{formatNumber(item.delegators)}</p>;
      },
      title: (
        <p className='w-full text-right'>{t("common:labels.delegators")}</p>
      ),
      visible: columnsVisibility.delegators,
      widthPx: 50,
    },
    {
      key: "active_stake",
      render: item => {
        if (!item?.live_stake) {
          return "-";
        }

        return (
          <p className='text-right'>
            <AdaWithTooltip data={item?.live_stake} />
          </p>
        );
      },
      title: (
        <p className='w-full text-right'>{t("common:labels.activeStake")}</p>
      ),
      visible: columnsVisibility.active_stake,
      widthPx: 50,
    },
  ];

  useEffect(() => {
    if (totalPools && totalPools !== totalItems) {
      setTotalItems(totalPools);
    }
  }, [totalPools, totalItems]);

  return (
    <PageBase
      metadataTitle='poolBirthdayList'
      title={t("pools.birthdays.title")}
      breadcrumbItems={[{ label: t("pools.birthdays.title") }]}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
          <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
            {poolsBirthdayQuery.isLoading || poolsBirthdayQuery.isFetching ? (
              <LoadingSkeleton height='27px' width={"220px"} />
            ) : totalItems > 0 ? (
              <h3 className='basis-[230px] text-nowrap'>
                🎉{" "}
                {t("pools.birthdays.happyBirthday", {
                  count: formatNumber(totalItems),
                })}
              </h3>
            ) : (
              ""
            )}
            <div className='flex w-full justify-end md:hidden'>
              <div className='flex items-center gap-1 md:hidden'>
                <ExportButton columns={columns} items={items} />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  rowsLabel={t("common:table.rows")}
                  columnsOptions={poolBirthdaysTableOptions.map(item => {
                    return {
                      label: t(`common:tableSettings.${item.key}`),
                      isVisible: columnsVisibility[item.key],
                      onClick: () =>
                        setColumnVisibility(
                          item.key,
                          !columnsVisibility[item.key],
                        ),
                    };
                  })}
                />
              </div>
            </div>
          </div>
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("common:table.rows")}
              columnsOptions={poolBirthdaysTableOptions.map(item => {
                return {
                  label: t(`common:tableSettings.${item.key}`),
                  isVisible: columnsVisibility[item.key],
                  onClick: () =>
                    setColumnVisibility(item.key, !columnsVisibility[item.key]),
                };
              })}
            />
          </div>
        </div>
        <GlobalTable
          type='default'
          totalItems={totalItems}
          itemsPerPage={rows}
          scrollable
          query={poolsBirthdayQuery}
          items={items ?? []}
          columns={columns.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.key as keyof PoolBirthdaysColumns) -
              columnsOrder.indexOf(b.key as keyof PoolBirthdaysColumns)
            );
          })}
          onOrderChange={setColumsOrder}
          renderDisplayText={(count, total) =>
            t("common:table.displaying", { count, total })
          }
          noItemsLabel={t("common:table.noItems")}
        />
      </section>
    </PageBase>
  );
};
