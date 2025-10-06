import type { TxDetailData } from "@/types/txTypes";
import { useEffect, useState } from "react";
import AssetLink from "../asset/AssetLink";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { AddressWithTxBadges } from "./AddressWithTxBadges";

interface Props {
  title: string;
  data: TxDetailData | undefined;
  sort: "value" | "index";
  isOutput: boolean;
}

const TxContentTable = ({ title, data, sort, isOutput }: Props) => {
  const [inputs, setInputs] = useState(data?.all_inputs);
  const [outputs, setOutputs] = useState(data?.all_outputs);

  useEffect(() => {
    const tempInputs = [...(data?.all_inputs ?? [])].sort((a, b) =>
      sort === "value" ? b.value - a.value : a.tx_index - b.tx_index,
    );
    const tempOutputs = [...(data?.all_outputs ?? [])].sort((a, b) =>
      sort === "value" ? b.value - a.value : a.tx_index - b.tx_index,
    );

    setInputs(tempInputs);
    setOutputs(tempOutputs);
  }, [sort, data]);

  const deposit = data?.deposit && !isOutput ? data.deposit : 0;
  const content = isOutput ? outputs : inputs;
  let totalAda =
    content?.reduce((acc, curr) => acc + Number(curr.value), 0) ?? 0;
  if (deposit) totalAda -= deposit;

  return (
    <section className='m-0 flex h-full w-full flex-col rounded-xl border border-border shadow'>
      <div className='flex w-full justify-between rounded-tl-xl rounded-tr-xl border-b border-border bg-darker px-2 py-1 text-sm font-medium text-grayTextPrimary'>
        <span>{title}</span>
        <span className='text-right text-sm font-normal text-grayTextPrimary'>
          Total: <AdaWithTooltip data={totalAda ?? 0} />
        </span>
      </div>

      {content?.map((utxo, index) => (
        <div
          key={index}
          className='flex min-h-[70px] justify-between border-b border-border px-2 py-1.5 last:rounded-bl-xl last:rounded-br-xl last:border-b-0 odd:bg-darker'
        >
          <div className='flex flex-col justify-between'>
            <AddressWithTxBadges utxo={utxo} isOutput={isOutput} />
            {!Array.isArray(utxo?.asset) && utxo.asset && (
              <AssetLink
                type={title === "Outputs" ? "output" : "input"}
                asset={utxo.asset}
              />
            )}
            <div className='flex w-full flex-wrap gap-1'>
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
          <span className='inline-block w-fit text-nowrap text-sm'>
            <AdaWithTooltip data={utxo.value} />
          </span>
        </div>
      ))}
    </section>
  );
};

export default TxContentTable;
