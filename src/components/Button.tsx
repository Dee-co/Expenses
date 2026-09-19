"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  variant?: "fill" | "outline";
  buttonType?: "text" | "icon" | "icon-text";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "danger" | "success" | "warning";
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick: () => void;
}

export default function Button({
  children,
  variant = "fill",
  buttonType = "text",
  loading = false,
  leftIcon,
  color = "primary",
  rightIcon,
  disabled = false,
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const variantClasses = {
    primary: {
      fill: "bg-primary text-white hover:bg-primary-hover",
      outline:
        "border border-primary text-primary hover:bg-primary hover:text-white",
    },

    danger: {
      fill: "bg-danger text-white hover:bg-danger/90",
      outline:
        "border border-danger text-danger hover:bg-danger hover:text-white",
    },

    success: {
      fill: "bg-success text-white hover:bg-success/90",
      outline:
        "border border-success text-success hover:bg-success/90 hover:text-white",
    },

    warning: {
      fill: "bg-warning text-white hover:bg-warning/90",
      outline:
        "border border-warning text-warning hover:bg-warning hover:text-white",
    },
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3.5 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition
        cursor-pointer
        disabled:cursor-not-allowed
        disabled:opacity-50

        ${variantClasses[color][variant]}

        ${buttonType === "icon" ? "p-3" : sizeClasses[size]}

        ${className}
      `}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {buttonType === "icon" ? (
            leftIcon || rightIcon
          ) : (
            <>
              {leftIcon && <span>{leftIcon}</span>}

              <span>{children}</span>

              {rightIcon && <span>{rightIcon}</span>}
            </>
          )}
        </>
      )}
    </button>
  );
}