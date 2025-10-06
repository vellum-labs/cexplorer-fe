import type { FC } from "react";

import { Cardano } from "@/resources/images/icons/Cardano";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Box, Coins } from "lucide-react";
import { OverviewStatCard } from "../global/cards/OverviewStatCard";

import { HomepageCardanoEpoch } from "./stats/HomepageCardanoEpoch";
import { HomepageCardanoLiveStake } from "./stats/HomepageCardanoLiveStake";
// import { HomepageCardanoNativeAssets } from "./stats/HomepageCardanoNativeAssets";
import { HomepageCardanoPrice } from "./stats/HomepageCardanoPrice";

import { colors } from "@/constants/colors";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";

export const HomepageOverview: FC = () => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);

  const statCards = [
    {
      key: "cardano_price",
      icon: <Cardano color={colors.primary} size={25} />,
      label: <span className='text-sm font-semibold'>Cardano price</span>,
      content: <HomepageCardanoPrice miscConst={miscConst} />,
      footer: (
        <div className='flex h-[40px] items-center justify-end border-t border-border px-3'>
          <Link to='/ada-price'>
            <div className='flex items-center gap-1'>
              <span className='text-sm font-semibold text-primary'>
                Price graph
              </span>
              <ArrowRight size={15} className='text-primary' />
            </div>
          </Link>
        </div>
      ),
    },
    {
      key: "epoch",
      icon: <Box className='text-primary' />,
      label: (
        <span className='text-sm font-semibold'>
          Epoch <span className='text-primary'>{miscConst?.no}</span>
        </span>
      ),
      content: <HomepageCardanoEpoch miscConst={miscConst} />,
      footer: (
        <div className='flex h-[40px] items-center justify-end border-t border-border px-3'>
          <Link to='/epoch'>
            <div className='flex items-center gap-1'>
              <span className='text-sm font-semibold text-primary'>
                Epoch list
              </span>
              <ArrowRight size={15} className='text-primary' />
            </div>
          </Link>
        </div>
      ),
    },
    {
      key: "live_stake",
      icon: <Coins className='text-primary' />,
      label: <span className='text-sm font-semibold'>Live stake</span>,
      content: <HomepageCardanoLiveStake miscConst={miscConst} />,
      footer: (
        <div className='flex h-[40px] items-center justify-end border-t border-border px-3'>
          <Link to='/analytics/pool'>
            <div className='flex items-center gap-1'>
              <span className='text-sm font-semibold text-primary'>
                Staking analytics
              </span>
              <ArrowRight size={15} className='text-primary' />
            </div>
          </Link>
        </div>
      ),
    },
    // {
    //   key: "cardano_native_assets",
    //   icon: <Box className='text-primary' />,
    //   label: (
    //     <span className='text-sm font-semibold'>Cardano native assets</span>
    //   ),
    //   content: <HomepageCardanoNativeAssets />,
    //   footer: (
    //     <div className='flex h-[40px] items-center justify-end border-t border-border px-3'>
    //       <Link to='/asset'>
    //         <div className='flex items-center gap-1'>
    //           <span className='text-sm font-semibold text-primary'>Assets</span>
    //           <ArrowRight size={15} className='text-primary' />
    //         </div>
    //       </Link>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className='flex flex-wrap items-stretch gap-4 xl:flex-nowrap'>
      {statCards.map(({ icon, key, label, content, footer }) => (
        <OverviewStatCard
          key={key}
          icon={icon}
          title={label}
          value={content}
          description={footer}
          fullContentHeight
          titleClassname='px-1.5 '
          className={
            "min-h-[225px] flex-grow basis-[330px] justify-between !px-0 pb-0 pt-1.5"
          }
        />
      ))}
    </div>
  );
};
