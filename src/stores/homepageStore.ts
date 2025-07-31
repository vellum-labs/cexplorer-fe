import type { LayoutProps, WidgetCategory } from "@/types/homepageTypes";
import { WidgetDataTypes, WidgetTypes } from "@/types/widgetTypes";

import { create } from "zustand";
import { toast } from "sonner";

import { initialLayout, initialWidgetCategories } from "@/constants/homepage";
import { tableWidgetStoreKeys } from "@/constants/widget";

interface HomepageStore {
  customize: boolean;
  addWidget: boolean;
  layout: LayoutProps[];
  widgetCategories: WidgetCategory[];
  onLayoutChange: (newLayout: LayoutProps[]) => void;
  handleCustomize: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  handleReset: () => void;
  setAddWidget: (value: boolean) => void;
  setWidgetCategories: (
    value: WidgetCategory[] | ((prev: WidgetCategory[]) => WidgetCategory[]),
  ) => void;
  handleAddWidget: (widget: WidgetCategory["widgets"][0]) => void;
  handleRemoveWidget: (title: string, detailAddr?: string) => void;
}

export const useHomepageStore = create<HomepageStore>()((set, get) => {
  const savedLayout = localStorage.getItem("homepage_layout");
  const parsedLayout = savedLayout ? JSON.parse(savedLayout) : initialLayout;

  return {
    customize: false,
    addWidget: false,
    layout: parsedLayout,
    widgetCategories: initialWidgetCategories,

    onLayoutChange: newLayout => {
      set(state => ({
        layout: newLayout.map(newItem => {
          const oldItem = state.layout.find(p => p.i === newItem.i);

          if (oldItem) {
            return {
              ...oldItem,
              x: newItem.x,
              y: newItem.y,
              w: newItem.w,
              h: newItem.h,
              static: newItem.static,
            };
          }

          return {
            ...newItem,
            type: WidgetTypes.TABLE,
            dataType: WidgetDataTypes.TX,
            title: "New widget",
          };
        }),
      }));
    },

    handleCustomize: () => {
      const { customize, handleCancel } = get();
      if (customize) {
        handleCancel();
        return;
      }
      set({ customize: true });
    },

    handleCancel: () => {
      const saved = localStorage.getItem("homepage_layout");
      set({
        customize: false,
        layout: saved ? JSON.parse(saved) : initialLayout,
      });
    },

    handleSave: () => {
      try {
        const { layout } = get();
        localStorage.setItem("homepage_layout", JSON.stringify(layout));
        set({ customize: false });
        toast.success("Successfully saved.");
      } catch {
        toast.error("Error while saving.");
      }
    },

    handleReset: () => {
      try {
        localStorage.setItem("homepage_layout", JSON.stringify(initialLayout));
        set({ layout: initialLayout, customize: false });
        toast.success("Successfully reset.");
      } catch {
        toast.error("Reset error.");
      }
    },

    setAddWidget: value => set({ addWidget: value }),

    setWidgetCategories: value => {
      if (typeof value === "function") {
        set(state => ({ widgetCategories: value(state.widgetCategories) }));
      } else {
        set({ widgetCategories: value });
      }
    },

    handleAddWidget: widget => {
      const { layout, customize } = get();

      const isPrevLayoutContains = layout.find(item =>
        item.detailAddr
          ? item.detailAddr === widget.detailAddr
          : item.title === widget.title,
      );

      if (isPrevLayoutContains) return;

      const maxY = layout.reduce(
        (max, item) => Math.max(max, item.y + item.h),
        0,
      );

      const newWidget = {
        i: layout.length ? String(+layout[layout.length - 1].i + 1) : "1",
        y: maxY,
        static: !customize,
        ...widget,
      };

      set({ layout: [...layout, newWidget] });
    },

    handleRemoveWidget: (title, detailAddr) => {
      set(state => {
        switch (title) {
          case "Tx list":
            localStorage.removeItem(tableWidgetStoreKeys.tx);
            break;
          case "Block list":
            localStorage.removeItem(tableWidgetStoreKeys.block);
            break;
          case "Drep list":
            localStorage.removeItem(tableWidgetStoreKeys.drep);
            break;
          case "Pool list":
            localStorage.removeItem(tableWidgetStoreKeys.pool);
            break;
          case "Asset list":
            localStorage.removeItem(tableWidgetStoreKeys.asset);
            break;
          case "Epoch list":
            localStorage.removeItem(tableWidgetStoreKeys.epoch);
            break;
        }

        return {
          layout: state.layout.filter(item =>
            detailAddr ? detailAddr !== item.detailAddr : item.title !== title,
          ),
        };
      });
    },
  };
});
