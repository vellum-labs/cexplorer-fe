import type { useFetchBlocksList } from "@/services/blocks";
import { useThemeStore } from "@/stores/themeStore";

import { formatNumber } from "@/utils/format/format";
import { useWindowDimensions } from "@/utils/useWindowsDemensions";
import { useNavigate } from "@tanstack/react-router";
import { useGraphColors } from "../useGraphColors";

interface UseLatestBlocks {
  onEvents: (params: any) => void;
  option: any;
}

interface UseLatestBlocksArgs {
  query: ReturnType<typeof useFetchBlocksList>;
  sortedVersions: [string, number][];
}

export const useLatestBlocks = ({
  query,
  sortedVersions,
}: UseLatestBlocksArgs): UseLatestBlocks => {
  const { data } = query;
  const navigate = useNavigate();

  const blockData = data?.pages.flatMap(x => x.data.data);

  const { bgColor, textColor } = useGraphColors();
  const { theme } = useThemeStore();
  const { width } = useWindowDimensions();

  let squareSize: number;
  let gapSize: number;
  const rows = 5;
  const cols = 20;

  if (width < 1024) {
    squareSize = 45;
    gapSize = 4;
  }
  if (width < 800) {
    squareSize = 40;
    gapSize = 3;
  }
  if (width < 600) {
    squareSize = 30;
    gapSize = 2;
  } else {
    squareSize = 60;
    gapSize = 5;
  }

  const option = {
    grid: {
      top: "5px",
      bottom: "5px",
      left: "0px",
      right: "0px",
      containLabel: false,
    },
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: bgColor,
      textStyle: {
        color: textColor,
      },
      formatter: function (params) {
        const blockNo =
          params.data.block_no !== undefined
            ? formatNumber(params.data.block_no)
            : "N/A";
        const version = params.data.version;

        return `
          Version: ${version}<br />
          Block No: ${blockNo}
        `;
      },
    },
    xAxis: {
      type: "value",
      min: -squareSize / 2,
      max: (cols - 1) * (squareSize + gapSize) + squareSize / 2,
      show: false,
    },
    yAxis: {
      type: "value",
      min: -squareSize / 2,
      max: (rows - 1) * (squareSize + gapSize) + squareSize / 2,
      inverse: true,
      show: false,
    },
    series: [
      {
        type: "scatter",
        symbol: "rect",
        symbolSize: squareSize,
        data: generateBlockData(blockData ?? [], rows, cols, sortedVersions),
        itemStyle: {
          borderColor: theme === "dark" ? "#262d35" : "#fff",
          borderWidth: gapSize,
          opacity: 1,
        },
        emphasis: {
          itemStyle: {
            color: null,
          },
        },
      },
    ],
  };

  const onEvents = params => {
    navigate({
      to: "/block/$hash",
      params: {
        hash: params.data.hash,
      },
    });
  };

  function generateBlockData(
    blocks: any[],
    rows: number,
    cols: number,
    sortedVersions: [string, number][],
  ) {
    const data: any[] = [];
    const totalCells = rows * cols;

    for (let i = 0; i < totalCells; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const block = blocks[i] || null;
      const x = col * (squareSize + gapSize);
      const y = row * (squareSize + gapSize);

      let color = "#01ca86"; // default: green
      let version;

      if (block) {
        version =
          block.proto_major !== undefined
            ? String(block.proto_major) +
              (block.proto_minor !== undefined ? `.${block.proto_minor}` : "")
            : undefined;

        if (version === sortedVersions[0]?.[0]) {
          color = "#01ca86"; // green
        } else if (version === sortedVersions[1]?.[0]) {
          color = "#fdc53a"; // yellow
        } else {
          color = "#ff456c"; // red
        }
      }

      data.push({
        value: [x, y],
        itemStyle: {
          color,
          opacity: 1,
        },
        version,
        block_no: block?.block_no,
        hash: block?.hash,
      });
    }

    return data;
  }

  return {
    option,
    onEvents,
  };
};
