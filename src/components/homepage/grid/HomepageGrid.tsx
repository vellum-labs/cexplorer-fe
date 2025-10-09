import type { FC } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import { HomepageGridItem } from "./HomepageGridItem";

import { useHomepageStore } from "@/stores/homepageStore";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const HomepageGrid: FC = () => {
  const { layout, onLayoutChange, customize } = useHomepageStore();

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 };
  const cols = { lg: 4, md: 4, sm: 2, xs: 1 };

  const layouts = {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
  };

  return (
    <ResponsiveGridLayout
      layouts={layouts}
      className={`${customize ? "customize-grid w-full" : "w-full"}`}
      isDraggable={customize}
      isResizable={customize}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={30}
      onLayoutChange={onLayoutChange}
      containerPadding={[0, 0]}
      margin={[16, 16]}
    >
      {layout.map(
        ({
          i,
          title,
          type,
          dataType,
          link,
          linkTitle,
          rowHeight,
          detailAddr,
          w,
        }) => (
          <div
            key={i}
            className='rounded-m border border-border bg-background'
          >
            <HomepageGridItem
              title={title}
              type={type}
              dataType={dataType}
              link={link}
              linkTitle={linkTitle}
              rowHeight={rowHeight}
              detailAddr={detailAddr}
              width={w}
            />
          </div>
        ),
      )}
    </ResponsiveGridLayout>
  );
};
