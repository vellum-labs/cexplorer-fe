import { useDropdownState } from "@/stores/states/dropdownState";
import type { NavigationOptions } from "@/types/navigationTypes";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import React, { useEffect, useLayoutEffect, useState } from "react";

interface DropdownProps {
  id: string;
  options: NavigationOptions;
  width?: string;
  label: ReactNode;
  hideChevron?: boolean;
  triggerClassName?: string;
  disableHover?: boolean;
  closeOnSelect?: boolean;
  forceVerticalPosition?: "down" | "up";
  poppoverClassname?: string;
  wrapperClassname?: string;
  withBorder?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  width = "190px",
  hideChevron = false,
  triggerClassName,
  disableHover = false,
  closeOnSelect = false,
  forceVerticalPosition,
  poppoverClassname,
  wrapperClassname,
  withBorder = false,
}) => {
  const { openId, setOpenId } = useDropdownState();
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [disabledClick, setDisabledClick] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [verticalPosition, setVerticalPosition] = useState<"down" | "up">(
    forceVerticalPosition ?? "down",
  );
  const [horizontalPosition, setHorizontalPosition] = useState<
    "left" | "right"
  >("left");
  const wrapperRef = React.createRef<HTMLDivElement>();
  const contentRef = React.createRef<HTMLDivElement>();
  const triggerRef = React.createRef<HTMLButtonElement>();
  let timeout;
  let submenuTimeout;

  const calculateDropdownPosition = () => {
    if (!contentRef.current || !triggerRef.current) return;

    const dropdownRect = contentRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const leftOverflow = dropdownRect.width > dropdownRect.left;
    const bottomOverflow =
      viewportHeight < triggerRect.bottom + dropdownRect.height;

    if (leftOverflow) {
      setHorizontalPosition("right");
    } else {
      setHorizontalPosition("left");
    }

    if (bottomOverflow && !forceVerticalPosition) {
      setVerticalPosition("up");
    } else {
      setVerticalPosition("down");
    }
  };

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
    }, 250);
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

  const openSubmenu = (id: string) => {
    clearTimeout(submenuTimeout);
    setActiveSubmenu(id);
  };

  const closeSubmenu = () => {
    submenuTimeout = setTimeout(() => {
      setActiveSubmenu(null);
    }, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(prev => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && options[focusedIndex]?.onClick) {
          options[focusedIndex]?.onClick();
          if (closeOnSelect) handleClose();
        } else {
          toggleDropdown();
        }
        break;
      case "Escape":
        handleClose();
        break;
      default:
        break;
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (closeOnSelect) {
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
      className={`relative ${isOpen ? "z-[16]" : "z-[15]"} font-medium ${wrapperClassname ? wrapperClassname : ""}`}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`flex items-center justify-between gap-1/2 bg-transparent ${triggerClassName}`}
        aria-haspopup='menu'
        aria-expanded={isOpen}
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
          className={`absolute bg-cardBg animate-in ${horizontalPosition === "left" ? "right-0" : "left-0"} ${verticalPosition === "down" ? "top-[calc(100%+3px)]" : "bottom-[calc(100%+3px)]"} z-20 rounded-m bg-background p-1 text-text-sm shadow-md ${withBorder ? 'border border-border' : ''} ${poppoverClassname || ''}`}
          style={{
            width: `${width}`,
          }}
        >
          {options
            .filter(option => option)
            .map((option, index) => (
              <React.Fragment key={index}>
                {option?.href && option.href.includes("http") ? (
                  <a
                    href={option.href}
                    target='_blank'
                    className={`z-50 border-b border-border first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:bg-darker hover:text-primary ${option.divider ? "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-border" : ""}`}
                    style={{
                      display: "block",
                      padding: "10px",
                    }}
                    role='menuitem'
                    aria-label='Menu item'
                    onClick={() => setIsOpen(false)}
                  >
                    {option.label}
                  </a>
                ) : option?.href ? (
                  <Link
                    to={option.href}
                    search={option?.params ?? undefined}
                    className={`relative rounded-m hover:bg-darker hover:text-primary ${option.divider ? "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-border" : ""}`}
                    style={{
                      display: "block",
                      padding: "10px",
                    }}
                    role='menuitem'
                    aria-label='Menu item'
                    onClick={() => setIsOpen(false)}
                  >
                    {option.label}
                  </Link>
                ) : (
                  <div
                    className={`relative flex w-full justify-between rounded-m p-1.5 ${option.divider ? "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-border" : ""} hover:bg-darker hover:text-primary`}
                    onClick={option?.onClick}
                    style={{
                      //   padding: "10px",
                      cursor: "pointer",
                    }}
                    role='menuitem'
                    aria-label='Menu item'
                  >
                    {option?.nestedOptions ? (
                      <div
                        onMouseOver={() => openSubmenu(String(option.label))}
                        onMouseLeave={closeSubmenu}
                        className='relative flex w-full items-center justify-between'
                      >
                        {option.label}
                        {option.nestedOptions && <ChevronRight size={15} />}
                        {activeSubmenu === option.label && (
                          <div
                            className={`absolute left-[110%] top-0 z-50 rounded-l bg-cardBg p-1 shadow-md border border-border`}
                            style={{
                              width: width,
                            }}
                          >
                            {option.nestedOptions.map((nestedOption, index) => (
                              <Link
                                to={nestedOption?.href as any}
                                key={index}
                                className={`relative flex w-full justify-between rounded-m text-text hover:bg-darker hover:text-primary ${option.divider ? "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-border" : ""}`}
                                style={{
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                                role='menuitem'
                                aria-label='Menu item'
                                onClick={() => {
                                  nestedOption?.onClick &&
                                    nestedOption?.onClick();
                                  setIsOpen(false);
                                  setActiveSubmenu(null);
                                }}
                              >
                                {nestedOption?.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>{option?.label}</>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
