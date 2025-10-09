import type { PlutusContract, TxInput } from "@/types/txTypes";
import { Fragment, useState, type FC } from "react";
import { LabelBadge } from "../global/badges/LabelBadge";
import { PurposeBadge } from "../global/badges/PurposeBadge";
import { AdaWithTooltip } from "../global/AdaWithTooltip";
import { formatNumber } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import Copy from "../global/Copy";
import { JsonDisplay } from "../global/JsonDisplay";
import ConstLabelBadge from "../global/badges/ConstLabelBadge";
import { TextDisplay } from "../global/TextDisplay";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ContractInputProps {
  input: TxInput;
  contract: PlutusContract;
  inputIndex: number;
  isError: boolean;
  isLoading: boolean;
}

export const ContractInput: FC<ContractInputProps> = ({
  input,
  contract,
  inputIndex,
  isError,
  isLoading,
}) => {
  const [open, setOpen] = useState<boolean>(inputIndex === 0);

  return (
    <Fragment>
      <div className='mt-1.5 flex flex-wrap items-center gap-1'>
        {open ? (
          <ChevronDown
            onClick={() => setOpen(false)}
            className='cursor-pointer select-none'
            size={17}
          />
        ) : (
          <ChevronRight
            onClick={() => setOpen(true)}
            className='cursor-pointer select-none'
            size={17}
          />
        )}
        {contract.label && <LabelBadge variant='lg' label={contract?.label} />}
        <div className='rounded-m py-1/2 text-text-xs w-fit border border-border bg-background px-1 font-medium'>
          Input #{inputIndex + 1}
        </div>
        <PurposeBadge purpose={input.redeemer.purpose} />
        <span className='rounded-max text-text-xs flex h-[25px] items-center border border-border bg-blue-200/15 px-1 font-medium'>
          {contract.type.slice(0, 1).toUpperCase() + contract.type.slice(1)}
        </span>
        <span className='rounded-max text-text-xs flex h-[25px] items-center border border-border bg-secondaryBg px-1 font-medium'>
          Size {(contract.size / 1024).toFixed(2)}kB
        </span>
        <span className='rounded-max text-text-xs flex h-[25px] items-center border border-border bg-secondaryBg px-1 font-medium'>
          Fee <AdaWithTooltip data={input.redeemer.fee} />
        </span>
      </div>

      <div
        className={`gap-1text-text-sm mt-4 flex-col ${open ? "flex" : "hidden"}`}
      >
        <span>Mem: {formatNumber(input?.redeemer?.unit.mem)}</span>
        <span>Steps: {formatNumber(input?.redeemer?.unit.steps)}</span>
        <span className='mt-1'>
          Redeemer Data Hash:{" "}
          <span className='flex items-center gap-1'>
            <Link
              to='/datum'
              search={{
                hash: input.redeemer.datum.hash,
              }}
              className='block overflow-hidden text-ellipsis text-primary'
            >
              {input?.redeemer.datum.hash}
            </Link>
            <Copy copyText={input?.redeemer.datum.hash} />
          </span>
        </span>
        <JsonDisplay
          isError={isError}
          isLoading={isLoading}
          data={input.redeemer.datum.value}
          search
        />
        <span>
          <span className='gap-1/2 mt-1 flex items-center'>
            Script hash:{" "}
            <ConstLabelBadge type='sc' name={contract?.script_hash} />
          </span>
          <span className='flex items-center gap-1'>
            <Link
              to='/script/$hash'
              params={{ hash: contract?.script_hash }}
              className='block overflow-hidden text-ellipsis text-primary'
            >
              {contract?.script_hash}
            </Link>
            <Copy copyText={contract?.script_hash} />
          </span>
        </span>
        <span className='mt-1'>Bytes:</span>
        <TextDisplay text={contract?.bytecode} />
        {(contract.output || []).map(output => (
          <span className='mt-1'>
            Datum hash:{" "}
            <span className='flex items-center gap-1'>
              <Link
                to='/datum'
                search={{
                  hash: output.hash,
                }}
                className='mb-1 block overflow-hidden text-ellipsis text-primary'
              >
                {output?.hash}
              </Link>
              <Copy copyText={output?.hash} />
            </span>
            <JsonDisplay
              isError={isError}
              isLoading={isLoading}
              search
              data={output?.value}
            />
          </span>
        ))}
      </div>
    </Fragment>
  );
};
