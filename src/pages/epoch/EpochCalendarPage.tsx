import LoadingSkeleton from "@/components/global/skeletons/LoadingSkeleton";
import SortBy from "@/components/ui/sortBy";
import { colors } from "@/constants/colors";
import { epochLength } from "@/constants/confVariables";
import { useFetchEpochList } from "@/services/epoch";
import { useFetchMiscBasic } from "@/services/misc";
import { useEpochCalendarStore } from "@/stores/epochCalendarStore";
import type {
  EpochListData,
  EpochSort,
  UpcomingEpochs,
} from "@/types/epochTypes";
import { formatDate } from "@/utils/format/format";
import { Link } from "@tanstack/react-router";
import { Calendar, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

export const EpochCalendarPage = () => {
  const { calendar, setCalendar } = useEpochCalendarStore();
  const [items, setItems] = useState<EpochListData[]>([]);
  const { data, isLoading } = useFetchEpochList();
  const { data: miscBasic } = useFetchMiscBasic();

  const sortItems = [
    {
      key: "desc",
      value: "Newest",
    },
    {
      key: "asc",
      value: "Oldest",
    },
  ];

  const upcomingEpochsItems = [
    {
      key: "1",
      value: "1",
    },
    {
      key: "10",
      value: "10",
    },
    {
      key: "25",
      value: "25",
    },
    {
      key: "50",
      value: "50",
    },
  ];

  useEffect(() => {
    if (!data || !miscBasic) return;

    const currentEpoch = Number(miscBasic.data.block.epoch_no);
    const currentEpochEndTime = new Date(
      data.data.find(epoch => epoch.no === currentEpoch)?.end_time ||
        Date.now(),
    );

    const tempData = [...(data?.data ?? [])];

    const numberOfFutureEpochs = parseInt(calendar.upcomingEpochs || "1", 10);
    for (let i = 1; i <= numberOfFutureEpochs; i++) {
      const futureEpochNo = currentEpoch + i;
      const futureEpochStartTime = new Date(
        currentEpochEndTime.getTime() + (i - 1) * epochLength * 1000,
      );
      const futureEpochEndTime = new Date(
        futureEpochStartTime.getTime() + epochLength * 1000,
      );

      tempData.push({
        no: futureEpochNo,
        start_time: futureEpochStartTime
          .toISOString()
          .replace("T", " ")
          .split(".")[0],
        end_time: futureEpochEndTime
          .toISOString()
          .replace("T", " ")
          .split(".")[0],
      } as EpochListData);
    }

    if (calendar.sort === "desc") {
      setItems(tempData.sort((a, b) => b.no - a.no));
    } else {
      setItems(tempData.sort((a, b) => a.no - b.no));
    }
  }, [calendar.sort, calendar.upcomingEpochs, data, miscBasic]);

  return (
    <PageBase
      title='Epoch calendar'
      breadcrumbItems={[{ label: "Epoch calendar" }]}
      metadataTitle='epochCalendar'
    >
      <div className='flex w-full max-w-desktop flex-wrap items-center justify-between gap-4 px-mobile md:px-desktop'>
        <div className='flex items-center gap-2 text-sm text-grayTextPrimary'>
          Show upcoming:{" "}
          <SortBy
            selectItems={upcomingEpochsItems}
            selectedItem={calendar.upcomingEpochs}
            setSelectedItem={key =>
              setCalendar({
                ...calendar,
                upcomingEpochs: key as UpcomingEpochs,
              })
            }
            label={false}
            width='60px'
          />
        </div>
        <SortBy
          selectItems={sortItems}
          setSelectedItem={key =>
            setCalendar({ ...calendar, sort: key as EpochSort })
          }
          selectedItem={calendar.sort}
          width='110px'
        />
      </div>
      {isLoading ? (
        <section className='grid w-full max-w-desktop grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 px-mobile pb-3 md:px-desktop'>
          {Array.from({ length: 100 }).map(() => (
            <LoadingSkeleton width='100%' height='167px' rounded='xl' />
          ))}
        </section>
      ) : (
        <section className='grid w-full max-w-desktop grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 px-mobile pb-3 md:px-desktop'>
          {items?.map(epoch => <EpochCard key={epoch.no} epoch={epoch} />)}
        </section>
      )}
    </PageBase>
  );
};

const EpochCard = ({ epoch }: { epoch: EpochListData }) => {
  const { data: miscBasic } = useFetchMiscBasic();
  const currentEpoch = Number(miscBasic?.data.block.epoch_no);
  const bgColor =
    currentEpoch === Number(epoch.no)
      ? colors.yellowText
      : currentEpoch > Number(epoch.no)
        ? colors.greenText
        : colors.border;

  return (
    <div className='flex flex-col gap-2 rounded-xl border border-border p-2'>
      <div className='mb-2 flex items-center gap-3'>
        {epoch.no > currentEpoch ? (
          <div className='rounded-full bg-grayTextSecondary p-1/2'>
            <Calendar size={15} color='white' className='' />
          </div>
        ) : (
          <CheckCircle
            color='white'
            className='rounded-full p-1/2'
            style={{
              backgroundColor: bgColor,
            }}
          />
        )}
        <h3 className=''>Epoch {epoch.no}</h3>
      </div>
      <span className='flex justify-between text-xs text-grayTextSecondary'>
        <p className='w-10'>Start</p>
        <span className='ml-2 text-grayTextPrimary'>
          {formatDate(epoch.start_time)}
        </span>
      </span>
      <span className='flex justify-between text-xs text-grayTextSecondary'>
        <p className='w-10'>End</p>
        <span className='ml-2 text-grayTextPrimary'>
          {formatDate(epoch.end_time)}
        </span>
      </span>
      <div className='mt-2 flex justify-end border-t border-border pt-1'>
        {currentEpoch >= epoch.no ? (
          <Link
            className='text-right text-sm font-medium text-primary'
            to='/epoch/$no'
            params={{ no: String(epoch.no) }}
          >
            Epoch detail
          </Link>
        ) : (
          <span className='text-sm font-medium text-grayTextPrimary'>
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
};
