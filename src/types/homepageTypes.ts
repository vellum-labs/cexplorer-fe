import type { FileRoutesByPath } from "@tanstack/react-router";

import type { WidgetDataTypes, WidgetTypes } from "@/types/widgetTypes";

export interface LayoutProps {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minH: number;
  maxH?: number;
  maxW?: number;
  minW?: number;
  static: boolean;
  type: WidgetTypes;
  dataType: WidgetDataTypes;
  title: string;
  linkTitle: string;
  detailAddr?: string;
  link: FileRoutesByPath[keyof FileRoutesByPath]["path"];
  rowHeight?: number;
}

export interface WidgetCategory {
  title: string;
  widgets: {
    x: number;
    w: number;
    h: number;
    minH: number;
    maxH?: number;
    maxW?: number;
    minW?: number;
    type: WidgetTypes;
    dataType: WidgetDataTypes;
    title: string;
    linkTitle: string;
    detailAddr?: string;
    link: FileRoutesByPath[keyof FileRoutesByPath]["path"];
    img: string;
    rowHeight?: number;
  }[];
}
