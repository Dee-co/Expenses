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
  rightIcon,
  disabled = false,
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
    const variantClasses = {
    fill: "bg-primary text-white hover:bg-primary-hover",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3.5 text-lg",
  };
    return(
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

        ${variantClasses[variant]}
        ${sizeClasses[size]}

        ${buttonType === "icon" ? "p-3" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {buttonType !== "icon" && (
            <span>{children}</span>
          )}
          {buttonType === "icon" && leftIcon}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
    )
}
