import type { FC } from "react";
import ReactECharts from "echarts-for-react";
import { useGraphColors } from "@/hooks/useGraphColors";
import { Tooltip } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

interface TotalThresholdChartProps {
  chartProps: {
    poolsCount: number;
    drepsCount: number;
    ccData: {
      count: number;
      quorum_numerator: number;
      quorum_denominator: number;
    };
    isSecuryTitle: boolean;
    visibility: {
      total: boolean;
      cc: boolean;
      drep: boolean;
      spo: boolean;
    };
    params: {
      cc: null | string;
      drep: null | string;
      spo: null | string;
    };
    ccCount?: number;
    drepCount?: number;
    spoCount?: number;
  };
}

export const TotalThresholdChart: FC<TotalThresholdChartProps> = ({
  chartProps,
}) => {
  const {
    poolsCount,
    drepsCount,
    ccData,
    isSecuryTitle,
    visibility,
    params,
    ccCount,
    drepCount,
    spoCount,
  } = chartProps;

  const { textColor, bgColor } = useGraphColors();

  const cc =
    ccCount ??
    (visibility.cc && ccData.quorum_denominator > 0
      ? Math.ceil(
          (ccData.count || 0) *
            (ccData.quorum_numerator / ccData.quorum_denominator),
        )
      : 0);

  const drep = drepCount ?? 0;
  const spo = spoCount ?? 0;

  const isParameterGraph =
    visibility.cc && visibility.drep && params.spo !== null;

  const totalNeeded =
    (visibility.cc ? cc : 0) +
    (visibility.drep ? drep : 0) +
    (visibility.spo ? spo : 0);

  let nonSecurity, security;

  if (isParameterGraph) {
    nonSecurity = cc + drep;
    security = cc + drep + spo;
  } else {
    nonSecurity = totalNeeded;
    security = 0;
  }

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        if (params.name.includes("CC Members")) {
          return "Minimum CC members needed to pass<br/>Count: " + cc;
        }
        if (params.name.includes("DReps")) {
          return "Minimum DReps needed to pass<br/>Count: " + drep;
        }
        if (params.name.includes("SPOs")) {
          return "Minimum SPOs needed to pass<br/>Count: " + spo;
        }
        return "Other";
      },
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        label: {
          show: true,
          position: "center",
          formatter: () =>
            security > 0
              ? `{main|${nonSecurity}}\n{gap|}\n{highlight|${security}}`
              : `{main|${nonSecurity}}`,
          rich: {
            main: {
              fontSize: 22,
              fontWeight: 600,
              color: textColor,
            },
            gap: {
              height: 10,
            },
            highlight: {
              fontSize: 22,
              fontWeight: 600,
              color: "#F79009",
            },
          },
        },
        data: [
          ...(visibility.cc
            ? [
                {
                  value:
                    visibility.cc && totalNeeded > 0
                      ? 50 * (cc / totalNeeded)
                      : 0,
                  name: `CC Members (${cc})`,
                  itemStyle: {
                    color: "#f43f5e",
                    borderColor: "#ffffff",
                    borderWidth: 2,
                  },
                },
              ]
            : []),
          ...(visibility.drep
            ? [
                {
                  value:
                    visibility.drep && totalNeeded > 0
                      ? 50 * (drep / totalNeeded)
                      : 0,
                  name: `DReps (${drep})`,
                  itemStyle: {
                    color: "#f43f5e",
                    borderColor: "#ffffff",
                    borderWidth: 2,
                  },
                },
              ]
            : []),
          ...(visibility.spo
            ? [
                {
                  value:
                    visibility.spo && totalNeeded > 0
                      ? 50 * (spo / totalNeeded)
                      : 0,
                  name: `SPOs (${spo})`,
                  itemStyle: {
                    color:
                      isParameterGraph && isSecuryTitle ? "#F79009" : "#f43f5e",
                    borderColor: "#ffffff",
                    borderWidth: 2,
                  },
                },
              ]
            : []),
          {
            value: 50,
            name: "Can't pass",
            itemStyle: {
              color: "#22c55e",
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex items-center gap-2'>
        <p className='mb-2 font-medium'>Total</p>
        <Tooltip
          content={
            <p className='max-w-[200px]'>
              {isParameterGraph
                ? "Theoretical minimum number of entities (CC, DReps, SPOs) needed to pass this governance action. If the parameter is a security parameter, SPO votes (orange) are also included."
                : "Theoretical minimum number of entities (CC, DReps, SPOs) needed to pass this governance action."}
            </p>
          }
        >
          <CircleHelp
            size={15}
            className='-translate-y-[4.5px] cursor-pointer text-grayTextPrimary'
          />
        </Tooltip>
      </div>
      <div className='h-[260px] w-full max-w-[260px]'>
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};
