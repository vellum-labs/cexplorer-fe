import type { FC } from "react";

import { Check } from "lucide-react";
import { useInfiniteScrollingStore } from "@/stores/infiniteScrollingStore";

export const SettingsMobileItemScrolling: FC = () => {
  const { infiniteScrolling } = useInfiniteScrollingStore();

  return (
    <button className='flex w-full items-center justify-between'>
      <span className=''>Infinite scrolling</span>
      {infiniteScrolling && <Check size={20} />}
    </button>
  );
};
