import type { FC } from "react";

import { Button as GlobalButton } from "@vellumlabs/cexplorer-sdk";
import { Plus, RefreshCcw, Wand } from "lucide-react";

import { useHomepageStore } from "@/stores/homepageStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const HomepageCustomize: FC = () => {
  const { t } = useAppTranslation("common");
  const { handleCancel, handleSave, handleReset, setAddWidget } =
    useHomepageStore();

  return (
    <div className='flex w-full flex-wrap items-center justify-between gap-1.5 rounded-m border border-border px-2 py-1.5 md:flex-nowrap md:gap-0'>
      <div className='flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1.5 md:w-auto md:justify-start'>
        <div
          className='flex cursor-pointer items-center gap-1/2'
          onClick={() => setAddWidget(true)}
        >
          <Plus size={16} className='text-primary' />
          <span className='text-text-sm font-semibold text-primary'>
            {t("homepage.addWidget")}
          </span>
        </div>
        <div className='flex cursor-pointer items-center gap-1/2'>
          <Wand size={16} className='text-primary' />
          <span className='text-text-sm font-semibold text-primary'>
            {t("homepage.automaticallyAlign")}
          </span>
        </div>
        <div
          className='flex cursor-pointer items-center gap-1/2'
          onClick={handleReset}
        >
          <RefreshCcw size={16} className='text-primary' />
          <span className='text-text-sm font-semibold text-primary'>
            {t("homepage.resetToDefault")}
          </span>
        </div>
      </div>
      <div className='flex w-full items-center justify-between gap-1 md:w-auto md:justify-start'>
        <GlobalButton
          size='md'
          variant='tertiary'
          label={t("actions.cancel")}
          onClick={handleCancel}
        />
        <GlobalButton
          size='md'
          className='!py-[6.4px]'
          variant='primary'
          label={t("homepage.saveSettings")}
          onClick={handleSave}
        />
      </div>
    </div>
  );
};
