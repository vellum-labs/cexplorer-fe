import { colors } from "@/constants/colors";
import { Search } from "lucide-react";

export const NoResultsFound = () => {
  return (
    <div className='my-8 flex w-full flex-col items-center gap-2 text-center font-medium'>
      <div className='rounded-md border border-border p-1'>
        <Search color={colors.grayTextPrimary} size={17} />
      </div>
      No results found
    </div>
  );
};
