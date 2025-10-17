import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";
import type { EpochSort, UpcomingEpochs } from "@/types/epochTypes";

type Calendar = {
  sort: EpochSort;
  upcomingEpochs: UpcomingEpochs;
};

export const useEpochCalendarStore = handlePersistStore<
  { calendar: Calendar },
  { setCalendar: (value: Calendar) => void }
>(
  "epoch_calendar_store",
  { calendar: { sort: "desc", upcomingEpochs: "1" } },
  set => ({
    setCalendar: (value: Calendar) =>
      set(state => {
        state.calendar = value;
      }),
  }),
);
