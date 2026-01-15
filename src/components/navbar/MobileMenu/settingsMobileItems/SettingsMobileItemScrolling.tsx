import type { FC } from "react";

import { Check } from "lucide-react";
import { useInfiniteScrollingStore } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

export const SettingsMobileItemScrolling: FC = () => {
  const { t } = useAppTranslation("navigation");
  const { infiniteScrolling } = useInfiniteScrollingStore();

  return (
    <button className='flex w-full items-center justify-between'>
      <span className=''>{t("settings.infiniteScrolling")}</span>
      {infiniteScrolling && <Check size={20} />}
    </button>
  );
};
