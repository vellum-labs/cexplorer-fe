import type { TableColumns } from "@/types/tableTypes";

import { getNodeText } from "./getNodeText";

export const getExportJSON = (
  columns: TableColumns<any>,
  items: any[],
  currentPage: number,
) => {
  const res: any[] = [];

  for (let i = 0; i < items.length; i++) {
    const temp = {};
    for (let j = 0; j < columns.length; j++) {
      if (columns[j].standByRanking) {
        temp[getNodeText(columns[j].title)] =
          items.length * (currentPage - 1) + i + 1;
        continue;
      }

      const jsonFormat = columns[j].jsonFormat;
      const jsonTitleFormat = columns[j].jsonTitleFormat;
      const parsedNode = getNodeText(
        jsonFormat ? jsonFormat(items[i]) : columns[j].render(items[i]),
      );

      temp[jsonTitleFormat ? jsonTitleFormat : getNodeText(columns[j].title)] =
        typeof parsedNode !== "undefined" ? parsedNode : "Can't parse";
    }
    res.push(temp);
  }

  return res;
};
