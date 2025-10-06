import { navigationOptions } from "@/constants/navigationOptions";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  onBack?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const StakingMobileItems = ({ onBack, setOpen }: Props) => {
  return (
    <>
      <button
        onClick={onBack}
        className='mb-1 flex h-[34px] -translate-x-1 items-center gap-1 font-medium'
      >
        <ChevronLeft size={20} className='font-regular' />
        <span>Staking certificates</span>
      </button>
      <div className='flex flex-col'>
        {navigationOptions.staking
          .find(item => item.nestedOptions)
          ?.nestedOptions?.map(item => (
            <Link
              key={JSON.stringify(item.label)}
              to={item.href}
              onClick={() => setOpen(false)}
              className='ml-[31px] border-b border-border py-1.5 text-[14px] last:border-none last:pb-0 hover:text-primary'
            >
              {item.label}
            </Link>
          ))}
      </div>
    </>
  );
};
