import { useFetchMiscBasic } from "@/services/misc";
import { Link } from "@tanstack/react-router";

export const EpochCell = ({
  no,
  substractFromCurrent,
}: {
  no: number | undefined;
  substractFromCurrent?: boolean;
}) => {
  const { data } = useFetchMiscBasic();
  const currentEpoch = data?.data.block.epoch_no;

  if (no === undefined) {
    return <span className='flex justify-end'>-</span>;
  }

  if (currentEpoch !== undefined && no > currentEpoch) {
    return <span className='flex justify-end'>{no}</span>;
  }

  if (substractFromCurrent && currentEpoch !== undefined) {
    return (
      <Link
        to='/epoch/$no'
        params={{ no: String(currentEpoch - no) }}
        className='flex justify-end text-primary'
      >
        {currentEpoch - no}
      </Link>
    );
  }

  return (
    <Link
      to='/epoch/$no'
      params={{ no: String(no) }}
      className='flex justify-end text-primary'
    >
      {no}
    </Link>
  );
};
