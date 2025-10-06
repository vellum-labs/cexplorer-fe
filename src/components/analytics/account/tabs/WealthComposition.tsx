import { AdaWithTooltip } from "@/components/global/AdaWithTooltip";
import Tabs from "@/components/global/Tabs";
import GlobalTable from "@/components/table/GlobalTable";
import { useGraphColors } from "@/hooks/useGraphColors";
import { useMiscConst } from "@/hooks/useMiscConst";
import type { ReactEChartsProps } from "@/lib/ReactCharts";
import { useFetchWealthComposition } from "@/services/analytics";
import { useFetchMiscBasic } from "@/services/misc";
import type { TableColumns } from "@/types/tableTypes";
import { formatNumber } from "@/utils/format/format";
import { getAnimalImageByName } from "@/utils/getAnimalImageByName";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";
import EChartsReact from "echarts-for-react";
import { useEffect, useState } from "react";

const ranges = {
  plankton: "₳ 0 - ₳ 10",
  shrimp: "₳ 10 - ₳ 1K",
  crab: "₳ 1K - ₳ 5K",
  fish: "₳ 5K - ₳ 25K",
  tuna: "₳ 25K - ₳ 100K",
  dolphin: "₳ 100K - ₳ 250K",
  shark: "₳ 250K - ₳ 1M",
  whale: "₳ 1M - ₳ 5M",
  humpback: "₳ 5M - ₳ 20M",
  leviathan: "₳ 20M+",
};

const sortingOrder = [
  "plankton",
  "shrimp",
  "crab",
  "fish",
  "tuna",
  "dolphin",
  "shark",
  "whale",
  "humpback",
  "leviathan",
];

export const WealthComposition = () => {
  const { data: basicData } = useFetchMiscBasic(true);
  const miscConst = useMiscConst(basicData?.data.version.const);
  const circulatingSupply = miscConst?.circulating_supply ?? 1;
  const query = useFetchWealthComposition();
  const { width } = useWindowDimensions();
  const [radius, setRadius] = useState<string[]>(["50%", "70%"]);
  const [arrayData, setArrayData] = useState<
    Record<string, { count: number; sum: number }>[]
  >([]);
  const columns: TableColumns<Record<string, { count: number; sum: number }>> =
    [
      {
        key: "wallet_size",
        render: item => {
          return (
            <div className='flex items-center gap-2'>
              <img src={getAnimalImageByName(Object.keys(item)[0])} />
              <p>
                {Object.keys(item)[0].slice(0, 1).toUpperCase() +
                  Object.keys(item)[0].slice(1)}
              </p>
            </div>
          );
        },
        title: "Wallet size",
        visible: true,
        widthPx: 60,
      },
      {
        key: "count",
        render: item => {
          return <p>{formatNumber(item[Object.keys(item)[0]].count)}</p>;
        },
        title: "Count",
        visible: true,
        widthPx: 50,
      },
      {
        key: "sum",
        render: item => {
          return <AdaWithTooltip data={item[Object.keys(item)[0]].sum} />;
        },
        title: "Sum",
        visible: true,
        widthPx: 60,
      },
      {
        key: "sumPercentage",
        render: item => {
          return (
            <p>
              {(
                (item[Object.keys(item)[0]].sum / circulatingSupply) *
                100
              ).toFixed(1)}
              %
            </p>
          );
        },
        title: "Sum %",
        visible: true,
        widthPx: 60,
      },
      {
        key: "range",
        render: item => {
          return <p>{ranges[Object.keys(item)[0]]}</p>;
        },
        title: "Range",
        visible: true,
        widthPx: 60,
      },
    ];

  const tabs = [
    {
      key: "table",
      label: "Table",
      content: (
        <GlobalTable
          type='default'
          totalItems={arrayData.length}
          minContentWidth={700}
          scrollable
          query={query}
          items={arrayData}
          columns={columns}
        />
      ),
      visible: true,
    },
    {
      key: "charts",
      label: "Charts",
      content: (
        <div className='flex w-full flex-wrap'>
          <div className='h-full w-full basis-[550px] md:w-1/2'>
            <h3>Total supply</h3>
            <SumPieChart data={arrayData} radius={radius} />
          </div>
          <div className='h-full w-full basis-[550px] md:w-1/2'>
            <h3>Structure</h3>
            <CountPieChart data={arrayData} radius={radius} />
          </div>
        </div>
      ),
      visible: true,
    },
  ];

  useEffect(() => {
    if (width < 500) {
      setRadius(["20%", "35%"]);
    } else if (width < 1024) {
      setRadius(["45%", "65%"]);
    } else {
      setRadius(["50%", "90%"]);
    }
  }, [width]);

  useEffect(() => {
    const data = query.data?.data ?? {};
    if (Object.keys(data).length) {
      const arrayData: Record<string, { count: number; sum: number }>[] = [];
      Object.keys(data).forEach(key => {
        arrayData.push({ [key]: data[key] });
        arrayData.sort((a, b) => {
          return (
            sortingOrder.indexOf(Object.keys(a)[0]) -
            sortingOrder.indexOf(Object.keys(b)[0])
          );
        });
      });
      setArrayData(arrayData);
    }
  }, [query.data?.data]);

  return (
    <section>
      <h3 className='mb-2'>Wealth Composition by ADA balance</h3>
      <Tabs tabParam='view' withPadding={false} items={tabs} />
    </section>
  );
};

export const commonPieTooltip = (params, allData, bgColor, textColor) => {
  const total = allData.reduce((sum, item) => sum + item.value, 0);
  return `
    <div style="background:${bgColor};color:${textColor};padding:5px;border-radius:4px;">
      ${allData
        .filter(item => (item.value / total) * 100 >= 1)
        .map(item => {
          const percent = ((item.value / total) * 100).toFixed(2);
          const isHovered = item.name === params.name;
          return `<div style="margin-bottom:4px;">
            ${isHovered ? "<b>" : ""}${item.name}: ${percent}%${isHovered ? "</b>" : ""}
          </div>`;
        })
        .join("")}
    </div>
  `;
};

const SumPieChart = ({
  data,
  radius,
}: {
  data: Record<string, { count: number; sum: number }>[];
  radius: string[];
}) => {
  const { textColor, bgColor } = useGraphColors();
  const pieData = data.map(item => ({
    value: item[Object.keys(item)[0]].sum,
    name:
      Object.keys(item)[0].slice(0, 1).toUpperCase() +
      Object.keys(item)[0].slice(1),
  }));

  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: params =>
        commonPieTooltip(params, pieData, bgColor, textColor),
    },
    series: [
      {
        type: "pie",
        radius: radius,
        labelLine: {
          length: 20,
          length2: 10,
          lineStyle: {
            width: 1.5,
          },
        },
        labelLayout: {
          hideOverlap: true,
          moveOverlap: "shiftY",
        },
        data: pieData,
        label: {
          color: textColor,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: textColor,
          },
        },
        tooltip: {
          trigger: "item",
          confine: true,
        },
      },
    ],
  };

  return (
    <EChartsReact className='h-full w-full md:min-h-[400px]' option={option} />
  );
};

const CountPieChart = ({
  data,
  radius,
}: {
  data: Record<string, { count: number; sum: number }>[];
  radius?: string[];
}) => {
  const { textColor, bgColor } = useGraphColors();
  const pieData = data.map(item => ({
    value: item[Object.keys(item)[0]].count,
    name:
      Object.keys(item)[0].slice(0, 1).toUpperCase() +
      Object.keys(item)[0].slice(1),
  }));

  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: params =>
        commonPieTooltip(params, pieData, bgColor, textColor),
    },
    series: [
      {
        type: "pie",
        radius: radius,
        labelLine: {
          length: 20,
          length2: 10,
          lineStyle: {
            width: 1.5,
          },
        },
        labelLayout: {
          hideOverlap: true,
          moveOverlap: "shiftY",
        },
        data: pieData,
        label: {
          color: textColor,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: textColor,
          },
        },
        tooltip: {
          trigger: "item",
          confine: true,
        },
      },
    ],
  };

  return (
    <EChartsReact className='h-full w-full md:min-h-[400px]' option={option} />
  );
};
