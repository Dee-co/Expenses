"use client";
import { X } from "lucide-react";
import React, { ReactNode, useEffect, useRef } from "react";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg" | "md" | "full";
  persist?: boolean;
  subTitle?: string;
  closeButton?: boolean;
  loading?: boolean;
  className?: string;
  footerClassName?: string;
}
export default function Modal({
  open,
  onClose,
  title,
  subTitle = "",
  children,
  header,
  footer,
  size = "md",
  persist = false,
  closeButton = true,
  loading = false,
  className = "",
  footerClassName = "",
}: ModalProps) {
  const modalHistoryRef = useRef(false);
  useEffect(() => {
    if (!open) return;
    window.history.pushState(
      {
        ...window.history.state,
        modal: true,
      },
      "",
      window.location.href,
    );
    modalHistoryRef.current = true;
    const handlePopState = () => {
      modalHistoryRef.current = false;
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !persist && !loading) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, persist, loading]);
  if (!open) return null;
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    full: "max-w-none w-full h-full rounded-none",
  };
  const handleClose = () => {
    if (loading) return;

    if (modalHistoryRef.current) {
      modalHistoryRef.current = false;
      window.history.back();
      return;
    }

    onClose();
  };
  const handleBackdropClick = () => {
    if (!persist && !loading) {
      handleClose();
    }
  };

  return (
    <div
      onMouseDown={handleBackdropClick}
      className="
        z-50 flex
        p-4
        bg-black/50
        fixed inset-0 items-center justify-center
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "model-title" : undefined}
        onMouseDown={(event) => event.stopPropagation()}
        className={`
          overflow-hidden
          w-full max-h-[90vh]
          bg-surface
          rounded-xl
          shadow-xl
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {(title || header || closeButton) && (
          <div
            className="
              flex
              px-3 py-2
              border-b border-border
              items-center justify-between
            "
          >
            <div
              className="
                flex-1
                min-w-0
              "
            >
              {header
                ? header
                : title && (
                    <div
                      id="modal-title"
                      className="
                        text-lg font-semibold text-text
                      "
                    >
                      {title}
                    </div>
                  )}
              {subTitle && (
                <div
                  className="
                    text-text text-sm
                  "
                >
                  {subTitle}
                </div>
              )}
            </div>

            {closeButton && (
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="
                  flex
                  h-8 w-8
                  ml-4
                  text-text-muted
                  rounded-lg border-primary
                  cursor-pointer
                  hover:border shrink-0 items-center justify-center transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div
          className={`
            overflow-y-auto
            max-h-[calc(90vh-160px)]
            px-3
            sm:max-h-[calc(90vh-120px)]
          `}
        >
          {children}
        </div>
        {footer && (
          <div
            className={`
              flex
              px-5 py-4
              border border-border
              items-center gap-3 ${footerClassName || "justify-end"}
            `}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
