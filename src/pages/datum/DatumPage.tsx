import type { FC } from "react";

import { HeaderBannerSubtitle } from "@vellumlabs/cexplorer-sdk";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";
import { GlobalTable } from "@vellumlabs/cexplorer-sdk";

import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { useFetchDatumDetail } from "@/services/datum";
import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { formatString } from "@vellumlabs/cexplorer-sdk";

import { blake2bHex } from "blakejs";
import { Buffer } from "buffer";
import { deserializeDatum } from "@meshsdk/core";
import { Cbor } from "@harmoniclabs/cbor";

import { PageBase } from "@/components/global/pages/PageBase";

const parseSimpleCborInt = (hex: string): { int: string } | null => {
  if (!hex || typeof hex !== "string" || hex.length < 2) return null;
  const firstByte = parseInt(hex.slice(0, 2), 16);

  if (firstByte <= 0x17 && hex.length === 2) {
    return { int: String(firstByte) };
  }
  if (firstByte === 0x18 && hex.length === 4) {
    return { int: String(parseInt(hex.slice(2, 4), 16)) };
  }
  if (firstByte === 0x19 && hex.length === 6) {
    return { int: String(parseInt(hex.slice(2, 6), 16)) };
  }
  if (firstByte === 0x1a && hex.length === 10) {
    return { int: String(parseInt(hex.slice(2, 10), 16)) };
  }
  if (firstByte >= 0x20 && firstByte <= 0x37 && hex.length === 2) {
    return { int: String(-1 - (firstByte - 0x20)) };
  }
  return null;
};

const decodeDatum = (input: any): any => {
  if (!input) return {};
  const hex = typeof input === "string" ? input : String(input);

  const simpleInt = parseSimpleCborInt(hex);
  if (simpleInt) {
    return simpleInt;
  }

  try {
    const result = deserializeDatum(hex);
    if (typeof result === "number" || typeof result === "bigint") {
      return { int: String(result) };
    }
    if (typeof result === "boolean") {
      return { int: result ? "1" : "0" };
    }
    return result;
  } catch {
    try {
      const bytes = Buffer.from(hex, "hex");
      const decoded = Cbor.parse(bytes);
      return convertCborToJson(decoded);
    } catch {
      return {};
    }
  }
};

const convertCborToJson = (value: any): any => {
  if (typeof value === "number" || typeof value === "bigint") {
    return { int: String(value) };
  }
  if (typeof value === "string") {
    return { bytes: Buffer.from(value).toString("hex") };
  }
  if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
    return { bytes: Buffer.from(value).toString("hex") };
  }
  if (Array.isArray(value)) {
    return { list: value.map(convertCborToJson) };
  }
  if (value instanceof Map) {
    return {
      map: Array.from(value.entries()).map(([k, v]) => ({
        k: convertCborToJson(k),
        v: convertCborToJson(v),
      })),
    };
  }
  if (typeof value === "object" && value !== null) {
    if ("tag" in value && "data" in value) {
      return {
        constructor: String(value.tag - 121),
        fields: Array.isArray(value.data)
          ? value.data.map(convertCborToJson)
          : [convertCborToJson(value.data)],
      };
    }
    return value;
  }
  return { int: String(value) };
};

export const DatumPage: FC = () => {
  const { datum, hash } = useSearch({ from: "/datum/" });
  const [inputHash, setHash] = useState(hash ?? "");
  const [inputDatum, setInputDatum] = useState<string>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [parsedDatum, setParsedDatum] = useState<any>(
    datum ? decodeDatum(datum) : {},
  );

  const debouncedHash = useDebounce(inputHash.toLowerCase());

  const datumQuery = useFetchDatumDetail(debouncedHash);

  const { data, isLoading, isFetching, isError } = datumQuery;

  const changeInputDatum = (value: string) => {
    setInputDatum(value);
    setIsInitialLoad(false);
  };

  useEffect(() => {
    if (inputDatum) {
      setParsedDatum(decodeDatum(inputDatum));
    }
  }, [inputDatum]);

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      !isFetching &&
      !Array.isArray(data?.data) &&
      data?.data &&
      data.data.datum &&
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
      try {
        const datumStr = String(inputDatum);
        const datumBuffer = Buffer.from(datumStr, "hex");
        setHash(blake2bHex(datumBuffer, undefined, 32));
      } catch {
        setHash("");
      }
    } else {
      setHash("");
    }
  }, [inputDatum]);

  useEffect(() => {
    if (datum) {
      try {
        const datumStr = String(datum);
        const datumBuffer = Buffer.from(datumStr, "hex");
        setHash(blake2bHex(datumBuffer, undefined, 32));
      } catch {
        // empty
      }
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
                data={parsedDatum}
                isLoading={false}
                isError={false}
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
