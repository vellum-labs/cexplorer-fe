import { WidgetTypes } from "@/types/widgetTypes";

export const widgetMinWidth = {
  [WidgetTypes.TABLE]: 2,
  [WidgetTypes.GRAPH]: 2,
  [WidgetTypes.DETAIL]: 1,
};

export const tableWidgetStoreKeys = {
  tx: "homepage_tx_list_widget_columns",
  block: "homepage_block_list_widget_columns",
  drep: "homepage_drep_list_widget_columns",
  pool: "homepage_pool_list_widget_columns",
  asset: "homepage_asset_list_widget_columns",
  epoch: "homepage_epoch_list_widget_columns",
};
