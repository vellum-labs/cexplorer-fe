import type { FC } from "react";
import { BUILD_NODE_CODE } from "@/constants/poolDebug";
import { slotsPerKESPeriod } from "@/constants/confVariables";
import { Copy, LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Info } from "lucide-react";
import { useFetchBlockTip } from "@/services/blocks";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const CheatSheetTab: FC = () => {
  const { t } = useAppTranslation("pages");
  const { data: tipData, isLoading } = useFetchBlockTip();
  const currentSlot = tipData?.slot_no ?? 0;
  const kesPeriod = Math.floor(currentSlot / slotsPerKESPeriod);

  const kesUpdateCode = `cardano-cli node issue-op-cert \\
--kes-verification-key-file kes.vkey \\
--cold-signing-key-file cold.skey \\
--operational-certificate-issue-counter cold.counter \\
--kes-period ${kesPeriod} \\
--out-file node.cert`;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3 rounded-xl border border-border bg-cardBg p-3'>
        <div className='flex items-start gap-2'>
          <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-grayTextPrimary' />
          <p className='text-text-sm text-grayTextPrimary'>
            {t("poolDebug.cheatSheet.description")}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-text-lg font-semibold'>
          {t("poolDebug.cheatSheet.buildAndUpdate")}
        </h3>
        <div className='relative rounded-xl border border-border bg-cardBg p-3'>
          <Copy copyText={BUILD_NODE_CODE} className='absolute right-3 top-3' />
          <pre className='font-mono overflow-x-auto whitespace-pre-wrap text-text-sm text-grayTextPrimary'>
            {BUILD_NODE_CODE}
          </pre>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-text-lg font-semibold'>{t("poolDebug.cheatSheet.kesUpdate")}</h3>
        {isLoading ? (
          <LoadingSkeleton height='20px' width='70%' />
        ) : (
          <p className='text-text-sm text-grayTextPrimary'>
            {t("poolDebug.cheatSheet.slotsPerKESPeriod")} {slotsPerKESPeriod.toLocaleString()} {t("poolDebug.cheatSheet.slot")}{" "}
            {currentSlot.toLocaleString()} {">"} {t("poolDebug.cheatSheet.expr")} {currentSlot} /{" "}
            {slotsPerKESPeriod}: {kesPeriod}
          </p>
        )}
        {isLoading ? (
          <LoadingSkeleton height='140px' width='100%' rounded='xl' />
        ) : (
          <div className='relative rounded-xl border border-border bg-cardBg p-3'>
            <Copy copyText={kesUpdateCode} className='absolute right-3 top-3' />
            <pre className='font-mono overflow-x-auto whitespace-pre-wrap text-text-sm text-grayTextPrimary'>
              {kesUpdateCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
