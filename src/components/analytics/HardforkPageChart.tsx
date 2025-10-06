import type { FC } from "react";
import type { ReactEChartsProps } from "../../lib/ReactCharts";

import ReactECharts from "../../lib/ReactCharts";

interface HardforkPageChartProps {
  title: string;
  option: ReactEChartsProps["option"];
}

const HardforkPageChart: FC<HardforkPageChartProps> = ({ option, title }) => {
  return (
    <div className='flex w-full flex-col items-center rounded-l border border-border px-3 py-2'>
      <p className='w-full text-base font-semibold text-text'>{title}</p>
      <ReactECharts
        option={option}
        className='h-full min-h-[400px] w-full max-w-[450px] lg:min-h-max'
      />
    </div>
  );
};

export default HardforkPageChart;
