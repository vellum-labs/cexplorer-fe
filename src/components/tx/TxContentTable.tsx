import type { TxDetailData } from "@/types/txTypes";
import { useEffect, useState } from "react";
import AssetLink from "../asset/AssetLink";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { AddressWithTxBadges } from "./AddressWithTxBadges";
import { filterUtxoBySearch } from "@/utils/tx/filterUtxoBySearch";

interface Props {
  title: string;
  data: TxDetailData | undefined;
  sort: "value" | "index";
  isOutput: boolean;
  searchQuery?: string;
}

const TxContentTable = ({
  title,
  data,
  sort,
  isOutput,
  searchQuery = "",
}: Props) => {
  const [inputs, setInputs] = useState(data?.all_inputs);
  const [outputs, setOutputs] = useState(data?.all_outputs);

  useEffect(() => {
    let tempInputs = [...(data?.all_inputs ?? [])].sort((a, b) =>
      sort === "value" ? b.value - a.value : a.tx_index - b.tx_index,
    );
    let tempOutputs = [...(data?.all_outputs ?? [])].sort((a, b) =>
      sort === "value" ? b.value - a.value : a.tx_index - b.tx_index,
    );

    if (searchQuery.trim() !== "") {
      tempInputs = tempInputs.sort((a, b) => {
        const aMatches = filterUtxoBySearch(a, searchQuery).matches;
        const bMatches = filterUtxoBySearch(b, searchQuery).matches;
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });

      tempOutputs = tempOutputs.sort((a, b) => {
        const aMatches = filterUtxoBySearch(a, searchQuery).matches;
        const bMatches = filterUtxoBySearch(b, searchQuery).matches;
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
    }

    setInputs(tempInputs);
    setOutputs(tempOutputs);
  }, [sort, data, searchQuery]);

  const deposit = data?.deposit && !isOutput ? data.deposit : 0;
  const content = isOutput ? outputs : inputs;
  let totalAda =
    content?.reduce((acc, curr) => acc + Number(curr.value), 0) ?? 0;
  if (deposit) totalAda -= deposit;

  const hasSearch = searchQuery.trim() !== "";

  return (
    <section className='m-0 flex h-full w-full flex-col rounded-l border border-border shadow-md'>
      <div className='flex w-full justify-between rounded-tl-l rounded-tr-l border-b border-border bg-darker px-2 py-1 text-text-sm font-medium text-grayTextPrimary'>
        <span>{title}</span>
        <span className='text-right text-text-sm font-regular text-grayTextPrimary'>
          Total: <AdaWithTooltip data={totalAda ?? 0} />
        </span>
      </div>

      {content?.map((utxo, index) => {
        const searchResult = filterUtxoBySearch(utxo, searchQuery);
        const isGrayedOut = hasSearch && !searchResult.matches;

        return (
          <div
            key={index}
            className={`flex min-h-[70px] justify-between border-b border-border px-2 py-1.5 last:rounded-bl-xl last:rounded-br-xl last:border-b-0 odd:bg-darker ${isGrayedOut ? "opacity-30" : ""}`}
          >
            <div className='flex flex-col justify-between'>
              <AddressWithTxBadges
                utxo={utxo}
                isOutput={isOutput}
                enableHover={hasSearch && searchResult.matches}
                matchTypes={searchResult.matchTypes}
              />
              {!Array.isArray(utxo?.asset) && utxo.asset && (
                <AssetLink
                  type={title === "Outputs" ? "output" : "input"}
                  asset={utxo.asset}
                />
              )}
              <div className='flex w-full flex-wrap gap-1/2'>
                {utxo?.asset &&
                  utxo.asset.length > 0 &&
                  utxo?.asset?.map((asset, index) => (
                    <AssetLink
                      type={title === "Outputs" ? "output" : "input"}
                      asset={asset}
                      key={index}
                    />
                  ))}
              </div>
            </div>
            <span className='inline-block w-fit text-nowrap text-text-sm'>
              <AdaWithTooltip
                data={utxo.value}
                triggerClassName={
                  searchResult.matchTypes.includes("value")
                    ? "rounded-s bg-hoverHighlight px-1/2 outline outline-1 outline-highlightBorder"
                    : ""
                }
              />
            </span>
          </div>
        );
      })}
    </section>
  );
};

export default TxContentTable;
