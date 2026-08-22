"use client";
import { ReactNode } from "react";
interface InputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  error?: string;
  onlyDigits?: boolean;
  disabled?:boolean;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClickRightIcon?: () => void;
}
export default function Input({
  label,
  name,
  type = "text",
  value,
  placeholder = "",
  onChange,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  onlyDigits = false,
  maxLength = 200,
  error = "",
  required = false,
  onClickRightIcon = () => {},
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onlyDigits) {
      e.target.value = e.target.value.replace(/\D/g, "");
    }
    onChange(e);
  };
  return (
    <div
      className="
        w-full
      "
    >
      <label
        htmlFor={name}
        className="
          block
          mb-1
          text-sm font-medium text-text
        "
      >
        {label}
        {required && (
          <span
            className="
              ml-1
              text-primary
            "
          >
            *
          </span>
        )}
      </label>

      <div
        className="
          relative
        "
      >
        {leftIcon && (
          <div
            className="
              text-text-muted
              absolute left-3 top-1/2 -translate-y-1/2
            "
          >
            {leftIcon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onChange={handleChange}
          disabled={disabled}
          inputMode={onlyDigits ? "numeric" : undefined}
          className={`
            w-full
            px-4 py-3
            text-text
            bg-surface
            rounded-lg border
            outline-none
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
            error
            ? "border-red-500 focus:border-red-500"
            : "border-border focus:border-primary"
            }
          `}
        />

        {rightIcon && (
          <button
            type="button"
            onClick={onClickRightIcon}
            className="
              text-text-muted
              cursor-pointer
              absolute right-3 top-1/2 -translate-y-1/2
            "
          >
            {rightIcon}
          </button>
        )}
      </div>

      {error && (
        <p
          className="
            mt-1
            text-sm text-red-500
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}
