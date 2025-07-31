import type { FC } from "react";

import ReactEcharts from "echarts-for-react";

interface DrepAnalytcsPieGraphProps {
  option: any;
}

export const DrepAnalytcsPieGraph: FC<DrepAnalytcsPieGraphProps> = ({
  option,
}) => {
  return (
    <ReactEcharts
      opts={{ height: 400 }}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      className='h-full min-h-[400px] w-full'
    />
  );
};
