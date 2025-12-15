import type { FC } from "react";
import { BUILD_NODE_CODE, KES_UPDATE_CODE } from "@/constants/poolDebug";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { Info } from "lucide-react";

export const CheatSheetTab: FC = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3 rounded-xl border border-border bg-cardBg p-3'>
        <div className='flex items-start gap-2'>
          <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-grayTextPrimary' />
          <p className='text-text-sm text-grayTextPrimary'>
            Quick reference guide for stake pool operators. Copy-paste commands
            for building cardano-node, calculating KES periods, and generating
            operational certificates—the cheatsheet that SPOs actually use.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-text-lg font-semibold'>
          Build and update Cardano Node
        </h3>
        <div className='relative rounded-xl border border-border bg-cardBg p-3'>
          <Copy copyText={BUILD_NODE_CODE} className='absolute right-3 top-3' />
          <pre className='overflow-x-auto whitespace-pre-wrap font-mono text-text-sm text-grayTextPrimary'>
            {BUILD_NODE_CODE}
          </pre>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-text-lg font-semibold'>KES update</h3>
        <p className='text-text-sm text-grayTextPrimary'>
          slotsPerKESPeriod: 129600 slot: 172484179 {'>'} expr 172484179 /
          129600: 1330
        </p>
        <div className='relative rounded-xl border border-border bg-cardBg p-3'>
          <Copy copyText={KES_UPDATE_CODE} className='absolute right-3 top-3' />
          <pre className='overflow-x-auto whitespace-pre-wrap font-mono text-text-sm text-grayTextPrimary'>
            {KES_UPDATE_CODE}
          </pre>
        </div>
      </div>
    </div>
  );
};
