import { useDropdownState } from "@/stores/states/dropdownState";
import type { NestedNavigation } from "@/types/navigationTypes";
import { generateUrlWithParams } from "@/utils/generateUrlWithParams";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";

interface DropdownProps {
  id: string;
  options: NestedNavigation;
  label: ReactNode;
  hideChevron?: boolean;
  triggerClassName?: string;
  wrapperClassname?: string;
  disableHover?: boolean;
  closeOnSelect?: boolean;
  card?: ReactNode;
}

export const ScreenDropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  hideChevron = false,
  triggerClassName,
  wrapperClassname,
  disableHover = false,
  closeOnSelect = false,
  card,
}) => {
  const { openId, setOpenId } = useDropdownState();
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [disabledClick, setDisabledClick] = useState(false);
  const wrapperRef = React.createRef<HTMLDivElement>();
  const contentRef = React.createRef<HTMLDivElement>();
  const triggerRef = React.createRef<HTMLButtonElement>();
  let timeout;

  const toggleDropdown = () => {
    if (disabledClick) return;
    if (!isOpen) {
      setIsClicked(!isClicked);
    }

    setIsOpen(!isOpen);

    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  const handleClose = () => {
    if (disableHover) return;
    if (isClicked) return;

    timeout = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleOpen = () => {
    if (disableHover) return;
    clearTimeout(timeout);
    setDisabledClick(true);
    setTimeout(() => {
      setDisabledClick(false);
    }, 300);
    setIsOpen(true);

    if (openId !== id) {
      setOpenId(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (closeOnSelect) {
        if (event.button !== 0) return;
        setTimeout(() => {
          setIsOpen(false);
          setIsClicked(false);
        }, 150);
      } else if (
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        if (
          !triggerRef?.current?.contains(event.target) &&
          !wrapperRef?.current?.contains(event.target) &&
          !contentRef?.current?.contains(event.target)
        ) {
          setIsOpen(false);
          setIsClicked(false);
        }
      }
    };
    const controller = new AbortController();
    const signal = controller.signal;

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, { signal });
    }

    return () => {
      controller.abort();
    };
  }, [isOpen, contentRef, triggerRef, wrapperRef, closeOnSelect]);

  useEffect(() => {
    if (openId && openId !== id) {
      setIsOpen(false);
    }
  }, [openId, id]);

  return (
    <div
      className={`z-50 ${wrapperClassname ? wrapperClassname : ""} ${isOpen ? "flex h-full items-center" : ""}`}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      ref={wrapperRef}
      aria-haspopup
      aria-expanded={isOpen}
    >
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-1/2 font-medium ${triggerClassName}`}
      >
        <span className={`text-sm`}>{label}</span>
        {!hideChevron && (
          <span>
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className={`translate-y-[1px] duration-150 ${isOpen && "rotate-180"}`}
            />
          </span>
        )}
      </button>
      {isOpen && (
        <div
          ref={contentRef}
          className={`absolute left-1/2 top-[75px] z-20 flex w-full max-w-[1410px] -translate-x-1/2 rounded-b-xl bg-cardBg p-2 text-sm shadow-lg border border-border border-t-primary`}
        >
          {card}
          <section className='flex w-[max(800px,95%)] justify-around gap-1'>
            {Object.keys(options).map(key => (
              <div
                key={key}
                className='flex flex-col gap-1 font-medium items-start'
                role='menuitem'
                aria-label='Menu item'
              >
                <div className='min-h-[1.5rem] flex items-start pb-1'>
                  {options[key].labelHref ? (
                    <Link
                      to={options[key].labelHref}
                      className='text-primary hover:underline'
                    >
                      {options[key].label}
                    </Link>
                  ) : (
                    <p className='text-primary'>{options[key].label}</p>
                  )}
                </div>
                {options[key].options.map(option => (
                  <Link
                    key={String(option?.href) + option?.params?.tab}
                    to={generateUrlWithParams(option.href, option.params)}
                    className='text-sm'
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
};
