import type { FC } from "react";
import type { Currencies } from "@/types/storeTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { formatCurrency } from "@/utils/format/formatCurrency";
import { Settings } from "lucide-react";

interface SummaryData {
  period: string;
  ada: number;
  usd: number;
  secondary: number;
}

interface SummaryTableProps {
  data: SummaryData[];
  secondaryCurrency: Currencies;
  globalCurrency: Currencies;
}

export const SummaryTable: FC<SummaryTableProps> = ({
  data,
  secondaryCurrency,
  globalCurrency,
}) => {
  const showSecondaryCurrency = secondaryCurrency !== "usd";

  const formatPeriod = (period: string) => {
    const [year, month] = period.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" });
  };

  return (
    <div className='w-full overflow-hidden rounded-m border border-border'>
      <div className='flex items-center justify-between border-b border-border bg-darker px-3 py-2'>
        <h3 className='text-text-md font-semibold'>Summary</h3>
        <Settings size={18} className='cursor-pointer text-grayTextPrimary' />
      </div>

      <div className='w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[150px]'>Period</TableHead>
              <TableHead className='text-right'>Rewards ADA</TableHead>
              <TableHead className='text-right'>Rewards $</TableHead>
              {showSecondaryCurrency && (
                <TableHead className='text-right uppercase'>
                  Rewards {secondaryCurrency}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showSecondaryCurrency ? 4 : 3}
                  className='text-center text-grayTextPrimary'
                >
                  No data available for the last 3 months
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.period}>
                  <TableCell className='font-medium'>
                    {formatPeriod(row.period)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <span>₳ {row.ada.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}</span>
                      <Copy
                        copyText={row.ada.toString()}
                        className='translate-y-[1px]'
                      />
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <span>
                        {formatCurrency(row.usd, "usd", {
                          applyNumberFormatting: true,
                        })}
                      </span>
                      <Copy
                        copyText={row.usd.toFixed(2)}
                        className='translate-y-[1px]'
                      />
                    </div>
                  </TableCell>
                  {showSecondaryCurrency && (
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <span>
                          {formatCurrency(row.secondary, secondaryCurrency, {
                            applyNumberFormatting: true,
                          })}
                        </span>
                        <Copy
                          copyText={row.secondary.toFixed(2)}
                          className='translate-y-[1px]'
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
