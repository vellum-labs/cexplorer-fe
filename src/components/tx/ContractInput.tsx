import type { PlutusContract, TxInput } from "@/types/txTypes";
import { Fragment, useState, type FC } from "react";
import { LabelBadge } from "@vellumlabs/cexplorer-sdk";
import { PurposeBadge } from "@vellumlabs/cexplorer-sdk";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { formatNumber } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { JsonDisplay } from "@vellumlabs/cexplorer-sdk";
import { ConstLabelBadge } from "@vellumlabs/cexplorer-sdk";
import { TextDisplay } from "@vellumlabs/cexplorer-sdk";
import { Button, Switch } from "@vellumlabs/cexplorer-sdk";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useFetchMiscBasic } from "@/services/misc";
import { useMiscConst } from "@/hooks/useMiscConst";
import { parseCborHex } from "@/utils/uplc/uplc";

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
  const [uplcData, setUplcData] = useState<{
    compact: string;
    pretty: string;
  } | null>(null);
  const [uplcError, setUplcError] = useState<string | null>(null);
  const [prettyMode, setPrettyMode] = useState(false);

  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data?.version?.const);

  const handleConvertUplc = () => {
    try {
      const parsed = parseCborHex(contract.bytecode);
      setUplcData({
        compact: parsed.compact,
        pretty: parsed.pretty,
      });
      setUplcError(null);
    } catch (error) {
      setUplcError(
        error instanceof Error ? error.message : "Failed to parse UPLC",
      );
      setUplcData(null);
    }
  };

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
        <div className='w-fit rounded-m border border-border bg-background px-1 py-1/2 text-text-xs font-medium'>
          Input #{inputIndex + 1}
        </div>
        <PurposeBadge purpose={input.redeemer.purpose} />
        <span className='bg-blue-200/15 flex h-[25px] items-center rounded-max border border-border px-1 text-text-xs font-medium'>
          {contract.type.slice(0, 1).toUpperCase() + contract.type.slice(1)}
        </span>
        <span className='flex h-[25px] items-center rounded-max border border-border bg-secondaryBg px-1 text-text-xs font-medium'>
          Size {(contract.size / 1024).toFixed(2)}kB
        </span>
        <span className='flex h-[25px] items-center rounded-max border border-border bg-secondaryBg px-1 text-text-xs font-medium'>
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
          <span className='mt-1 flex items-center gap-1/2'>
            Script hash:{" "}
            <ConstLabelBadge
              type='sc'
              name={contract?.script_hash}
              miscConst={miscConst}
            />
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
        <div className='mt-2'>
          <span className='text-text-sm font-medium'>Bytes:</span>
        </div>
        <TextDisplay text={contract?.bytecode} />

        {!uplcData && (
          <div className='mt-3'>
            <Button
              label='Convert UPLC'
              variant='primary'
              size='sm'
              onClick={handleConvertUplc}
            />
          </div>
        )}

        {uplcError && (
          <div className='mt-2 rounded-m border border-red-500 bg-red-50 p-2 text-text-sm text-red-700 dark:bg-red-950 dark:text-red-300'>
            {uplcError}
          </div>
        )}

        {uplcData && (
          <div className='mt-4 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <span className='text-text-sm font-medium'>UPLC</span>
              <div className='flex items-center gap-2 text-text-sm'>
                <span>Pretty-print</span>
                <Switch
                  active={prettyMode}
                  onChange={checked => setPrettyMode(checked)}
                />
              </div>
            </div>
            <pre className='h-[300px] w-full overflow-auto rounded-m border border-border bg-cardBg p-[10px] font-mono text-text-xs shadow-md'>
              {prettyMode ? uplcData.pretty : uplcData.compact}
            </pre>
          </div>
        )}

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
