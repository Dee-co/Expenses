"use client";
import { X } from "lucide-react";
import { ReactNode } from "react";
interface InputProps {
  label?: string;
  name: string;
  value: string;
  className?: string;
  type?: string;
  error?: string;
  onlyDigits?: boolean;
  amount?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClickRightIcon?: () => void;
}
export default function Input({
  label = "",
  name,
  type = "text",
  value,
  placeholder = "",
  onChange,
  className = "",
  disabled = false,
  clearable = false,
  leftIcon = null,
  rightIcon = null,
  amount = false,
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
    else if (amount) {
      e.target.value = e.target.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1")
        .replace(/^(\d*\.\d{0,2}).*$/, "$1");
    }
    
      onChange(e);
  };
  return (
    <div
      className="
        w-full
      "
    >
      {label && (
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
                text-danger
              "
            >
              *
            </span>
          )}
        </label>
      )}
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
            px-3 py-2
            text-text
            bg-surface
            rounded-lg border
            outline-none
            ${leftIcon ? "pl-10" : ""}
            ${clearable && rightIcon ? "pr-16" : ""}
            ${clearable && !rightIcon ? "pr-10" : ""}
            ${!clearable && rightIcon ? "pr-10" : ""}
            ${
            error
            ? "border-red-500 focus:border-red-500"
            : "border-border focus:border-primary"
            }
            ${className}
          `}
        />
        {value && clearable && (
          <button
            type="button"
            onClick={() => {
              const event = {
                target: {
                  value: "",
                },
              } as React.ChangeEvent<HTMLInputElement>;

              handleChange(event);
            }}
            className="
              flex
              text-text-muted
              cursor-pointer
              absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center hover:text-text
            "
          >
            <X size={18} />
          </button>
        )}

        {rightIcon && (
          <button
            type="button"
            onClick={onClickRightIcon}
            className="
              flex
              text-text-muted
              cursor-pointer
              absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center
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
