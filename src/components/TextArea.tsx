"use client";

import { X } from "lucide-react";

interface TextareaProps {
  label?: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
  label,
  name,
  value,
  placeholder,
  error,
  disabled = false,
  clearable = false,
  required = false,
  rows = 4,
  maxLength,
  className = "",
  onChange,
}: TextareaProps) {
  const handleClear = () => {
    const event = {
      target: {
        name,
        value: "",
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange(event);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-text"
        >
          {label}

          {required && (
            <span className="ml-1 text-danger">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          onChange={onChange}
          className={`
            w-full
            resize-y
            rounded-lg
            border
            bg-surface
            px-3
            py-2.5
            text-sm
            text-text
            outline-none
            transition

            placeholder:text-text-muted

            ${
              error
                ? "border-danger focus:border-danger"
                : "border-border focus:border-primary"
            }

            disabled:cursor-not-allowed
            disabled:opacity-50

            ${clearable && value ? "pr-10" : ""}
          `}
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-2
              top-2
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-text-muted
              transition
              hover:bg-background
              hover:text-text
            "
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        {error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : (
          <span />
        )}

        {maxLength && (
          <span className="text-xs text-text-muted">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}