import SortBy from "@/components/ui/sortBy";
import { useFetchUserInfo } from "@/services/user";
import type { GraphSortData } from "@/types/graphTypes";
import { GraphTimePeriod } from "@/types/graphTypes";
import { Lock } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { epochLength } from "@/constants/confVariables";

interface Props extends GraphSortData {
  sortBy?: "epochs" | "days";
}

export const GraphEpochSort = ({
  query,
  selectedItem,
  setData,
  setSelectedItem,
  ignoreFiveDays,
  sortBy,
}: Props) => {
  const userQuery = useFetchUserInfo();
  const nftCount = userQuery.data?.data?.membership.nfts;
  const allTime = query?.data?.data;

  const daysInEpoch = epochLength / (60 * 60 * 24);

  const five = sortBy === "days" ? daysInEpoch : 1;
  const ten = sortBy === "days" ? 2 * daysInEpoch : 2;
  const thirty = sortBy === "days" ? 6 * daysInEpoch : 6;
  const hundred = sortBy === "days" ? 20 * daysInEpoch : 20;
  const fiveHundred = sortBy === "days" ? 100 * daysInEpoch : 100;

  const fiveItems = (allTime ?? [])?.slice(0, five);
  const tenItems = (allTime ?? [])?.slice(0, ten);
  const thirtyItems = (allTime ?? [])?.slice(0, thirty);
  const hundredItems = (allTime ?? [])?.slice(0, hundred);
  const fiveHundredItems = (allTime ?? [])?.slice(0, fiveHundred);

  const getLabel = (daysInEpoch: number, epoch: number) => {
    return `${daysInEpoch * epoch > 1 ? `${daysInEpoch * epoch} Days` : `${daysInEpoch * epoch} Day`} (${epoch} epoch${epoch > 1 ? "s" : ""})`;
  };

  const fiveDaysLabel = getLabel(daysInEpoch, 1);
  const tenDaysLabel = getLabel(daysInEpoch, 2);
  const thirtyDaysLabel = getLabel(daysInEpoch, 6);
  const hundredDaysLabel = getLabel(daysInEpoch, 20);
  const fiveHundredDaysLabel = getLabel(daysInEpoch, 100);

  const selectItems = [
    {
      key: GraphTimePeriod.AllTime,
      value: nftCount ? (
        "All time"
      ) : (
        <span className='flex items-center gap-1'>
          All time (PRO feature) <Lock size={13} />
        </span>
      ),
      disabled: !nftCount,
    },
    !ignoreFiveDays
      ? {
          key: GraphTimePeriod.FiveDays,
          value: fiveDaysLabel,
        }
      : undefined,
    {
      key: GraphTimePeriod.TenDays,
      value: tenDaysLabel,
    },
    {
      key: GraphTimePeriod.ThirtyDays,
      value: thirtyDaysLabel,
    },
    {
      key: GraphTimePeriod.HundredDays,
      value: hundredDaysLabel,
    },
    {
      key: GraphTimePeriod.FiveHundredDays,
      value: fiveHundredDaysLabel,
    },
  ];

  useEffect(() => {
    if (!query.isLoading && !query.isFetching && Array.isArray(allTime)) {
      setData(thirtyItems);
    }
  }, [query.isLoading, query.isFetching, allTime]);

  useEffect(() => {
    switch (selectedItem) {
      case GraphTimePeriod.AllTime:
        setData(allTime);
        break;
      case GraphTimePeriod.FiveDays:
        setData(fiveItems);
        break;
      case GraphTimePeriod.TenDays:
        setData(tenItems);
        break;
      case GraphTimePeriod.ThirtyDays:
        setData(thirtyItems);
        break;
      case GraphTimePeriod.HundredDays:
        setData(hundredItems);
        break;
      case GraphTimePeriod.FiveHundredDays:
        setData(fiveHundredItems);
        break;
    }
  }, [selectedItem]);

  return (
    <SortBy
      selectItems={selectItems}
      selectedItem={selectedItem}
      setSelectedItem={
        setSelectedItem as Dispatch<SetStateAction<string | undefined>>
      }
      label={false}
      width='160px'
    />
  );
};
