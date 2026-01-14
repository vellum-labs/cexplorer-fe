import type { AddressDetailUTXOColumns } from "@/types/tableTypes";
import type { FC } from "react";

import { TableSettingsDropdown } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import ExportButton from "@/components/table/ExportButton";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useFetchAddressUTXO } from "@/services/address";
import { useAddressDetailUTXOTableStore } from "@/stores/tables/addressDetailUTXOTableStore";
import { useEffect, useState } from "react";

import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { TableSearchInput } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";
import { HashCell } from "@/components/tx/HashCell";
import { addressDetailUTXOOptions } from "@/constants/tables/addressDetailUTXOTableOptions";
import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { calculateMinUtxo } from "@/utils/calculateUTXOSize";
import { useSearchTable } from "@/hooks/tables/useSearchTable";

interface UTXOTabProps {
  address: string;
}

export const UTXOTab: FC<UTXOTabProps> = ({ address }) => {
  const { t } = useAppTranslation("common");
  const utxoQuery = useFetchAddressUTXO(address);
  const { data, isLoading } = utxoQuery;

  const {
    rows,
    columnsOrder,
    columnsVisibility,
    setColumnVisibility,
    setColumsOrder,
    setRows,
  } = useAddressDetailUTXOTableStore();

  const [totalItems, setTotalItems] = useState(0);

  const [{ debouncedTableSearch, tableSearch }, setTableSearch] =
    useSearchTable({
      debounceFilter: tableSearch =>
        tableSearch.toLowerCase().slice(tableSearch.indexOf(":") + 1),
    });

  const totalUTXOs = data?.count;
  const items = data?.data[0]?.utxo_set;

  const columns = [
    {
      key: "hash",
      render: item => <HashCell hash={item?.tx_hash} />,
      jsonFormat: item => {
        if (!item?.tx_hash) {
          return "-";
        }

        return item.tx_hash;
      },
      title: t("labels.txHash"),
      visible: columnsVisibility.hash,
      widthPx: 65,
    },
    {
      key: "index",
      render: item => (
        <p>{item?.tx_index !== undefined ? item.tx_index : "-"}</p>
      ),
      jsonFormater: item => {
        if (!item?.tx_index) {
          return "-";
        }

        return item.tx_index;
      },
      title: <p>{t("address.index")}</p>,
      visible: columnsVisibility.index,
      widthPx: 20,
    },
    {
      key: "amount",
      render: item => (
        <p>
          {item?.value !== undefined ? (
            <>
              <div className='flex flex-col gap-1/2'>
                <div className='flex items-center gap-1.5'>
                  <AdaWithTooltip data={item.value} />
                  <Copy copyText={item.value} />
                  {!!item?.asset_list?.length && <span>+</span>}
                </div>
                {!!item?.asset_list?.length && (
                  <div className='flex flex-col'>
                    {item.asset_list.map((item, i) => (
                      <div key={i} className='flex w-full items-center'>
                        <div className='flex min-w-[200px] items-center gap-1.5'>
                          <Copy copyText={item.quantity} />
                          <span>{item.quantity}</span>
                        </div>
                        <div className='flex items-center justify-start gap-1.5 overflow-hidden'>
                          <Copy copyText={item.name} />
                          <Link
                            to='/asset/$fingerprint'
                            params={{
                              fingerprint: getAssetFingerprint(item.name),
                            }}
                            className='text-primary'
                          >
                            <span>{formatString(item.name, "long")}</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {item?.datum_hash ? (
                  <div className='flex items-center gap-1/2'>
                    <span>+</span>
                    <Link
                      to='/datum'
                      search={{
                        hash: item.datum_hash,
                      }}
                      className='text-primary'
                    >
                      {formatString(item.datum_hash, "long")}
                    </Link>
                    <Copy copyText={item.datum_hash} />
                  </div>
                ) : (
                  <div className='flex items-center gap-1/2'>
                    <span>+</span>
                    <span>{t("address.noDatum")}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            "-"
          )}
        </p>
      ),
      extraContent: (
        <div className='h-[400px] w-full border border-border'></div>
      ),
      title: <p>{t("labels.amount")}</p>,
      visible: columnsVisibility.amount,
      widthPx: 260,
    },
    {
      key: "min_utxo",
      render: item => {
        if (!item?.asset_list?.length) {
          return <p className='text-right'>-</p>;
        }

        return (
          <p className='text-end'>
            <AdaWithTooltip data={calculateMinUtxo(item?.asset_list)} />
          </p>
        );
      },
      jsonFormater: item => {
        if (!item?.asset_list?.length) {
          return 1000000;
        }

        return 1000000 + item?.asset_list?.length * 500000;
      },
      title: <p className='w-full text-right'>{t("address.minUtxoAda")}</p>,
      visible: columnsVisibility.min_utxo,
      widthPx: 55,
    },
  ];

  useEffect(() => {
    if (totalUTXOs && totalUTXOs !== totalItems) {
      setTotalItems(totalUTXOs);
    }
  }, [totalUTXOs, totalItems]);

  return (
    <section className='flex w-full max-w-desktop flex-col'>
      <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
        <div className='flex w-full flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
          {isLoading ? (
            <LoadingSkeleton height='27px' width={"220px"} />
          ) : (
            <h3 className='basis-[230px] text-nowrap'>
              {t("address.totalUtxos", { count: formatNumber(totalItems) })}
            </h3>
          )}
          <div className='flex justify-end max-[435px]:w-full md:hidden'>
            <div className='flex items-center gap-1 md:hidden'>
              <ExportButton columns={columns} items={items} />
              <TableSettingsDropdown
                rows={rows}
                setRows={setRows}
                rowsLabel={t("table.rows")}
                columnsOptions={addressDetailUTXOOptions.map(item => {
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

        <div className='flex gap-1'>
          <TableSearchInput
            placeholder={t("address.searchByTxHash")}
            value={tableSearch}
            onchange={setTableSearch}
            wrapperClassName='md:w-[320px] w-full'
            showSearchIcon
            showPrefixPopup={false}
          />
          <div className='hidden items-center gap-1 md:flex'>
            <ExportButton columns={columns} items={items} />
            <TableSettingsDropdown
              rows={rows}
              setRows={setRows}
              rowsLabel={t("table.rows")}
              columnsOptions={addressDetailUTXOOptions.map(item => {
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
      </div>
      <GlobalTable
        type='default'
        totalItems={totalItems}
        itemsPerPage={rows}
        minContentWidth={800}
        scrollable
        pagination
        query={utxoQuery}
        items={(items || []).filter(item =>
          String(item.tx_hash).includes(debouncedTableSearch),
        )}
        columns={columns.sort((a, b) => {
          return (
            columnsOrder.indexOf(a.key as keyof AddressDetailUTXOColumns) -
            columnsOrder.indexOf(b.key as keyof AddressDetailUTXOColumns)
          );
        })}
        onOrderChange={setColumsOrder}
        renderDisplayText={(count, total) =>
          t("table.displaying", { count, total })
        }
        noItemsLabel={t("table.noItems")}
      />
    </section>
  );
};
