import type { FC } from "react";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";

import { useRef, useEffect } from "react";

import { init, getInstanceByDom, registerTransform } from "echarts";
// @ts-expect-error test
import { transform } from "echarts-stat";

export interface ReactEChartsProps {
  option: EChartsOption;
  className?: string;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}

const ReactECharts: FC<ReactEChartsProps> = ({
  option,
  className,
  settings,
  loading,
  theme,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      registerTransform(transform.histogram);
      chart = init(chartRef.current, theme);
    }

    function resizeChart() {
      chart?.resize();
    }
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("resize", resizeChart, { signal });

    return () => {
      chart?.dispose();
      controller.abort();
    };
  }, [theme]);

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
    }
  }, [option, settings, theme]);

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return <div ref={chartRef} className={className} />;
};

export default ReactECharts;
