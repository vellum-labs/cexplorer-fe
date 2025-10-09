import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  hideClose?: boolean;
  className?: string;
}

const Modal = ({
  onClose,
  children,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  hideClose,
  className,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    document.addEventListener("keydown", handleKeyDown, { signal });
    return () => {
      controller.abort();
    };
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className='fixed inset-0 z-[51] h-full w-full bg-black/30 backdrop-blur-[1px]'
        aria-hidden='true'
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        ref={modalRef}
        tabIndex={-1}
        style={{
          width: minWidth || "95%",
          height: minHeight,
          maxWidth: maxWidth || "400px",
          maxHeight: maxHeight,
        }}
        className={`thin-scrollbar fixed left-1/2 top-1/2 z-[52] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-l bg-background p-1.5 md:p-5 ${className ? className : ""}`}
        onClick={e => e.stopPropagation()}
      >
        {!hideClose && (
          <button
            aria-label='Close dialog'
            onClick={onClose}
            className='absolute right-3 top-3 cursor-pointer md:right-5 md:top-5'
          >
            <X aria-hidden='true' />
          </button>
        )}

        <div id='modal-title'>{children}</div>
      </div>
    </>
  );
};

export default Modal;
