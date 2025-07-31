import { useViewStore } from "@/stores/viewStore";
import { LayoutGrid, List } from "lucide-react";
import type { ReactNode } from "react";

import { useState } from "react";

export interface ViewSwitchItem {
  key: string;
  icon: ReactNode;
  visible: boolean;
}

const viewItems = [
  {
    key: "grid",
    icon: <LayoutGrid size={20} />,
    visible: true,
  },
  {
    key: "list",
    icon: <List size={20} />,
    visible: true,
  },
];

export const ViewSwitch = () => {
  const { view, setView } = useViewStore();
  const [selectedItem, setSelectedItem] = useState<string>(view);

  const handleChange = (key: "grid" | "list") => {
    if (selectedItem === key) {
      return;
    }

    setSelectedItem(key);
    setView(key);
  };

  return (
    <div className='flex h-[40px] cursor-pointer items-center justify-center rounded-md border border-border text-sm'>
      {viewItems.map(
        ({ icon, key, visible }) =>
          visible && (
            <button
              key={key}
              className={` ${
                selectedItem === key && "text-primary"
              } duration-300" flex h-full w-9 shrink-0 items-center justify-center px-1 transition-all`}
              onClick={() => handleChange(key as "grid" | "list")}
            >
              {icon}
            </button>
          ),
      )}
    </div>
  );
};
