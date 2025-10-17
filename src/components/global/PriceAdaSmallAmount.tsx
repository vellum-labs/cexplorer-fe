import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatSmallValueWithSub } from "@/utils/format/formatSmallValue";

interface PriceAdaSmallAmountProps {
  price: number | undefined | null;
}

export const PriceAdaSmallAmount = ({ price }: PriceAdaSmallAmountProps) => {
  if (!price) {
    return <span>-</span>;
  }

  const priceInAda = price / 1e6;
  const fullPrice = priceInAda.toFixed(20).replace(/\.?0+$/, "");

  return (
    <Tooltip
      content={
        <div className='flex items-center gap-1/2'>
          <span>₳ {fullPrice}</span>
          <Copy copyText={fullPrice} />
        </div>
      }
    >
      <div className='text-text-sm text-grayTextPrimary'>
        {formatSmallValueWithSub(priceInAda, "₳ ", 0.01, 6, 4)}
      </div>
    </Tooltip>
  );
};
