"use client";

import React from "react";
import Select, { MultiValue, SingleValue } from "react-select";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string | string[];
  options?: SelectOption[];
  clearable?: boolean;
  required?: boolean;
  multiSelect?: boolean;
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  className?: string;
  instanceId?: string;
}

export default function CustomSelect({
  label,
  placeholder = "Select an option",
  value,
  options = [],
  clearable = false,
  onChange,
  required = false,
  multiSelect = false,
  disabled = false,
  className = "",
  instanceId = "",
  error = "",
}: SelectProps) {
  const selectedValue = multiSelect
    ? options.filter((option) =>
        Array.isArray(value) ? value.includes(option.value) : false,
      )
    : options.find((option) => option.value === value) || null;
  return (
    <div
      className={`
        w-full
        ${className}
      `}
    >
      {label && (
        <label
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

      <Select
        instanceId={instanceId}
        options={options}
        required={required}
        value={selectedValue}
        placeholder={placeholder}
        isClearable={clearable}
        isMulti={multiSelect}
        isDisabled={disabled}
        onChange={(selected) => {
          if (multiSelect) {
            const values = (selected as MultiValue<SelectOption>).map(
              (option) => option.value,
            );
            onChange(values);
          } else {
            const option = selected as SingleValue<SelectOption>;
            onChange(option ? option.value : "");
          }
        }}
        classNamePrefix="custom-select"
        styles={{
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderWidth: "1px",
    borderRadius: "8px",
    backgroundColor: "var(--app-surface)",
    borderColor: error
      ? "var(--app-danger)"
      : state.isFocused
        ? "var(--app-primary)"
        : "var(--app-border)",

    boxShadow: error
      ? "0 0 0 1px var(--app-danger)"
      : state.isFocused
        ? "0 0 0 1px var(--app-primary)"
        : "none",

    "&:hover": {
      borderColor: error
        ? "var(--app-danger)"
        : "var(--app-primary)",
    },

    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "4px 12px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--app-text-muted)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

  }),

  singleValue: (base) => ({
    ...base,
    color: "var(--app-text)",
    fontWeight: 500,
  }),

  input: (base) => ({
    ...base,
    color: "var(--app-text)",
  }),

  menu: (base) => ({
    ...base,
    zIndex: 50,
    marginTop: "6px",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "var(--app-surface)",
    border: "1px solid var(--app-border)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
  }),

  menuList: (base) => ({
    ...base,
    padding: "6px",
    backgroundColor: "var(--app-surface)",
  }),

  option: (base, state) => ({
    ...base,
    padding: "10px 12px",
    marginBottom: "2px",
    borderRadius: "6px",
    backgroundColor: state.isSelected
      ? "var(--app-primary)"
      : state.isFocused
        ? "var(--app-border)"
        : "transparent",

    color: state.isSelected
      ? "#082f49"
      : "var(--app-text)",

    cursor: "pointer",
    transition: "background-color 150ms ease",

    "&:active": {
      backgroundColor: "var(--app-primary-hover)",
    },
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? "var(--app-primary)"
      : "var(--app-text-muted)",

    "&:hover": {
      color: "var(--app-primary)",
    },
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "var(--app-border)",
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "var(--app-text-muted)",

    "&:hover": {
      color: "var(--app-danger)",
    },
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--app-border)",
    borderRadius: "6px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--app-text)",
    fontWeight: 500,
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "var(--app-text-muted)",
    "&:hover": {
      backgroundColor: "var(--app-danger)",
      color: "#ffffff",
    },
  }),

  noOptionsMessage: (base) => ({
    ...base,
    color: "var(--app-text-muted)",
    backgroundColor: "var(--app-surface)",
  }),
}}
        className="
          text-sm
        "
      />
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
