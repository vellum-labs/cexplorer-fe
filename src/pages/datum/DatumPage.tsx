import type { FC } from "react";

import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { useFetchDatumDetail } from "@/services/datum";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { formatString } from "@vellumlabs/cexplorer-sdk";

import { convertConstrToObject } from "@/utils/convertConstrToObject";
import { blake2bHex } from "blakejs";
import { Buffer } from "buffer";
import { Data } from "@lucid-evolution/lucid";

import { PageBase } from "@/components/global/pages/PageBase";

export const DatumPage: FC = () => {
  const { datum, hash } = useSearch({ from: "/datum/" });
  const [inputHash, setHash] = useState(hash ?? "");
  const [inputDatum, setInputDatum] = useState<string>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lucidData, setLucidData] = useState<any>(
    (() => {
      try {
        if (datum) {
          return convertConstrToObject(Data.from(datum ?? ""));
        }
      } catch {
        return {};
      }
    })(),
  );

  const debouncedHash = useDebounce(inputHash.toLowerCase());

  const datumQuery = useFetchDatumDetail(debouncedHash);

  const { data, isLoading, isFetching, isError } = datumQuery;

  const changeInputDatum = (value: string) => {
    setInputDatum(value);
  };

  useEffect(() => {
    if (inputDatum && (isError || Array.isArray(data?.data))) {
      try {
        const decodedData = Data.from(inputDatum ?? "");
        setLucidData(convertConstrToObject(decodedData));
      } catch {
        setLucidData({});
      }
    }
  }, [inputDatum, isError, data]);

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      !isFetching &&
      !Array.isArray(data?.data) &&
      data?.data &&
      isInitialLoad
    ) {
      setInputDatum(data.data.datum);
      setIsInitialLoad(false);
    }
  }, [isLoading, isFetching, isError, data, datum]);

  useEffect(() => {
    if (isInitialLoad) {
      return;
    }

    if (inputDatum) {
      const newUrl = new URL(window.location.href);
      newUrl.search = "";
      newUrl.searchParams.set("datum", inputDatum);
      window.history.replaceState(null, "", newUrl.toString());
    } else {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("datum");
      window.history.replaceState(null, "", newUrl.toString());
    }
  }, [inputDatum]);

  useEffect(() => {
    if (hash) {
      setHash(hash);
    }
  }, [hash]);

  useEffect(() => {
    if (inputDatum) {
      const datumBuffer = Buffer.from(inputDatum, "hex");

      setHash(blake2bHex(datumBuffer, undefined, 32));
    } else {
      setHash("");
    }
  }, [inputDatum]);

  useEffect(() => {
    if (datum) {
      const datumBuffer = Buffer.from(datum, "hex");

      setHash(blake2bHex(datumBuffer, undefined, 32));
    }
  }, [datum]);

  const txColumns = [
    {
      key: "hash",
      render: item => (
        <Link
          to='/tx/$hash'
          params={{ hash: item.id }}
          className='text-primary'
        >
          {formatString(item.id, "long")}
        </Link>
      ),
      title: "Transaction Hash",
      visible: true,
      widthPx: 60,
    },
  ];

  const sameTxColumns = [
    {
      key: "hash",
      render: item => (
        <Link
          to='/datum'
          params={{ hash: item.id }}
          search={{
            hash: item.id,
          }}
          className='text-primary'
        >
          {formatString(item.id, "long")}
        </Link>
      ),
      title: "Datum Hash",
      visible: true,
      widthPx: 60,
    },
  ];

  return (
    <PageBase
      adsCarousel={false}
      metadataTitle='datumInspector'
      title='Datum Inspector'
      breadcrumbItems={[
        { label: "Developers", link: "/dev" },
        { label: "Datum" },
      ]}
      subTitle={
        inputHash ? (
          <HeaderBannerSubtitle
            hashString={formatString(inputHash, "long")}
            hash={inputHash}
            title='Hash'
          />
        ) : undefined
      }
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile py-1 md:px-desktop'>
        <div className='mb-2 flex w-full flex-col justify-between gap-1'>
          <h2>Datum convertor</h2>
          <div className='flex w-full flex-wrap gap-2 lg:flex-nowrap'>
            <div className='flex h-[360px] w-1/2 flex-grow flex-col gap-1'>
              <h3>Input</h3>
              <textarea
                className='h-full w-full resize-none rounded-m border border-border bg-cardBg p-[10px] text-text-md text-text-xs shadow-md outline-none'
                spellCheck={false}
                onChange={e => changeInputDatum(e.currentTarget.value)}
                defaultValue={datum ? datum : inputDatum}
              ></textarea>
            </div>
            <div className='flex h-[360px] w-1/2 flex-grow flex-col gap-1'>
              <h3>Output</h3>
              <JsonDisplay
                data={isError || Array.isArray(data?.data) ? lucidData : data}
                isLoading={isLoading || isFetching}
                isError={isError}
                search
              />
            </div>
          </div>
          {!isLoading &&
            !isFetching &&
            !isError &&
            !Array.isArray(data?.data) && (
              <div className='flex w-full flex-wrap gap-2 lg:flex-nowrap'>
                <div className='flex w-[360px] flex-grow flex-col gap-1'>
                  <h3>Transaction with this datum</h3>
                  <GlobalTable
                    type='default'
                    columns={txColumns}
                    minContentWidth={500}
                    pagination={false}
                    items={data?.data.tx}
                    query={datumQuery}
                  />
                </div>
                <div className='flex w-[360px] flex-grow flex-col gap-1'>
                  <h3>Other datums from the same transactions</h3>
                  <GlobalTable
                    type='default'
                    columns={sameTxColumns}
                    minContentWidth={500}
                    pagination={false}
                    items={data?.data.datums_in_same_tx}
                    query={datumQuery}
                  />
                </div>
              </div>
            )}
        </div>
      </section>
    </PageBase>
  );
};
