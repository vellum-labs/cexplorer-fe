import type { FC } from "react";

import Modal from "../global/Modal";
import { Plus, X } from "lucide-react";
import Button from "../global/Button";
import { HomepageModalWidget } from "./widgets/HomepageModalWidget";

import { useHomepageStore } from "@/stores/homepageStore";
import { useState } from "react";

export const HomepageModal: FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [activeWidget, setActiveWidget] = useState<number>();

  const { setAddWidget, widgetCategories, handleAddWidget } =
    useHomepageStore();

  return (
    <Modal
      className='w-full'
      maxWidth='1230px'
      onClose={() => setAddWidget(false)}
      hideClose
    >
      <div className='flex h-[30px] w-full items-center justify-between pb-6'>
        <h2>Add homepage widgets</h2>
        <X
          size={20}
          className='text-grayText cursor-pointer'
          onClick={() => setAddWidget(false)}
        />
      </div>
      <div className='flex py-5'>
        <div className='w-[150px]'>
          {widgetCategories.map((item, i) => (
            <div
              key={item.title}
              className={`flex h-[36px] cursor-pointer select-none items-center px-4 ${activeCategory === i ? "border-l-2 border-primary text-primary" : "border-l-2 border-transparent text-grayTextPrimary"}`}
              onClick={() => {
                setActiveWidget(undefined);
                setActiveCategory(i);
              }}
            >
              <span className='text-sm font-semibold text-inherit'>
                {item.title}
              </span>
            </div>
          ))}
        </div>
        <div className='thin-scrollbar flex h-[312px] w-full flex-wrap gap-3 overflow-y-auto overscroll-none border-l border-border px-3'>
          {widgetCategories[activeCategory].widgets.map((widget, index) => (
            <HomepageModalWidget
              key={index}
              widget={widget}
              activeCategory={activeCategory}
              active={activeWidget === index}
              isResetting={activeWidget !== undefined && activeWidget !== index}
              onClick={() => setActiveWidget(index)}
              onReset={() => setActiveWidget(undefined)}
            />
          ))}
        </div>
      </div>
      <div className='flex w-full items-center justify-end gap-2'>
        <Button
          size='md'
          variant='tertiary'
          label='Cancel'
          onClick={() => setAddWidget(false)}
        />
        <Button
          size='md'
          variant='primary'
          leftIcon={<Plus size={18} />}
          label='Add widget'
          onClick={() => {
            if (typeof activeWidget !== "undefined") {
              handleAddWidget(
                widgetCategories[activeCategory].widgets[activeWidget],
              );
              setAddWidget(false);
            }
          }}
          disabled={typeof activeWidget === "undefined"}
        />
      </div>
    </Modal>
  );
};
