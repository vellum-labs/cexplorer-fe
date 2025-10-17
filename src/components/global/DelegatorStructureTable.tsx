import type { FC } from "react";
import GlobalTable from "@/components/table/GlobalTable";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { getAnimalRangeByName } from "@/utils/address/getAnimalRangeByName";
import ReactEcharts from "echarts-for-react";

interface Items {
  title: string;
  icon: string;
  data: {
    count: number;
    sum: number;
  };
}

interface DelegatorStructureTableProps {
  items: Items[];
  columnsOrder: any;
  columnsVisibility: any;
  setColumsOrder: any;
  rows: number;
  query: any;
  columnType: "pool" | "drep";
}

export const DelegatorStructureTable: FC<DelegatorStructureTableProps> = ({
  items,
  columnsOrder,
  columnsVisibility,
  setColumsOrder,
  rows,
  query,
  columnType,
}) => {
  const columns = [
    {
      key: "wallet_size",
      render: (item: Items) => {
        return (
          <Tooltip
            content={
              <div className='min-w-[110px]'>
                {getAnimalRangeByName(item.title)}
              </div>
            }
          >
            <div className='flex items-center gap-1'>
              <div className='w-[30px]'>
                <img src={item.icon} />
              </div>
              <span>{item.title[0].toUpperCase() + item.title.slice(1)}</span>
            </div>
          </Tooltip>
        );
      },
      title: <p>Wallet Size</p>,
      visible: columnsVisibility.wallet_size,
      widthPx: columnType === "pool" ? 150 : 50,
    },
    {
      key: "amount",
      render: (item: Items) => {
        return <p className='text-right'>{item.data.count}</p>;
      },
      title: <p className='w-full text-right'>Count</p>,
      visible: columnsVisibility.amount,
      widthPx: columnType === "pool" ? 100 : 50,
    },
    {
      key: "amount_pie",
      render: (item: Items) => {
        const amountSum = items
          .map(item => item.data.count)
          .reduce((a, b) => a + b, 0);

        const usage = (item.data.count * 100) / amountSum;

        const option = {
          tooltip: {
            trigger: "item",
            confine: true,
            formatter: (param: any) => {
              if (param.data.name === "Usage") {
                const animalName =
                  item.title[0].toUpperCase() + item.title.slice(1);
                return `${animalName} count: ${usage.toFixed(2)}%`;
              } else {
                return `Others count: ${(100 - usage).toFixed(2)}%`;
              }
            },
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: usage.toFixed(2),
                  name: "Usage",
                  itemStyle: { color: "#47CD89" },
                },
                {
                  value: (100 - usage).toFixed(2),
                  name: "Left",
                  itemStyle: { color: "#FEC84B" },
                },
              ],
            },
          ],
        };

        return (
          <div className='flex w-full items-center justify-end gap-1/2'>
            <span>{usage.toFixed(2)}%</span>
            <ReactEcharts option={option} className='max-h-[50px] w-[50px]' />
          </div>
        );
      },
      title: <p className='w-full text-right'>Count %</p>,
      visible: columnsVisibility.amount_pie,
      widthPx: columnType === "pool" ? 100 : undefined,
    },
    {
      key: "holdings",
      render: (item: Items) => {
        return (
          <p className='text-right'>
            <AdaWithTooltip data={item.data.sum} />
          </p>
        );
      },
      title: <p className='w-full text-right'>Stake</p>,
      visible: columnsVisibility.holdings,
      widthPx: columnType === "pool" ? 100 : 50,
    },
    {
      key: "holdings_pie",
      render: (item: Items) => {
        const holdingsSum = items
          .map(item => item.data.sum)
          .reduce((a, b) => a + b, 0);

        const usage = (item.data.sum * 100) / holdingsSum;

        const option = {
          tooltip: {
            trigger: "item",
            confine: true,
            formatter: (param: any) => {
              if (param.data.name === "Usage") {
                const animalName =
                  item.title[0].toUpperCase() + item.title.slice(1);
                return `${animalName} stake: ${usage.toFixed(2)}%`;
              } else {
                return `Others stake: ${(100 - usage).toFixed(2)}%`;
              }
            },
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: usage.toFixed(2),
                  name: "Usage",
                  itemStyle: { color: "#47CD89" },
                },
                {
                  value: (100 - usage).toFixed(2),
                  name: "Left",
                  itemStyle: { color: "#FEC84B" },
                },
              ],
            },
          ],
        };

        return (
          <div className='flex w-full items-center justify-end gap-1/2'>
            <span>{usage.toFixed(2)}%</span>
            <ReactEcharts option={option} className='max-h-[50px] w-[50px]' />
          </div>
        );
      },
      title: <p className='w-full text-right'>Stake %</p>,
      visible: columnsVisibility.holdings_pie,
      widthPx: columnType === "pool" ? 100 : undefined,
    },
  ];

  return (
    <GlobalTable
      type='default'
      totalItems={items.length}
      itemsPerPage={rows}
      rowHeight={columnType === "pool" ? 69 : 80}
      scrollable
      pagination
      query={query}
      items={items}
      columns={columns.sort((a, b) => {
        return columnsOrder.indexOf(a.key) - columnsOrder.indexOf(b.key);
      })}
      onOrderChange={setColumsOrder}
    />
  );
};
