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
            borderWidth: "0.5px",
            borderRadius: "8px",
            borderColor: error
              ? "var(--app-danger)"
              : state.isFocused
                ? "var(--app-primary)"
                : "var(--app-border)",

            boxShadow: error
              ? "0 0 0 0.5px var(--app-danger)"
              : state.isFocused
                ? "0 0 0 0.5px var(--app-primary)"
                : "none",

            "&:hover": {
              borderColor: error ? "var(--app-danger)" : "var(--app-primary)",
            },
          }),

          placeholder: (base) => ({
            ...base,
            color: "var(--app-text-muted)",
          }),

          singleValue: (base) => ({
            ...base,
            color: "var(--app-text)",
          }),

          input: (base) => ({
            ...base,
            color: "var(--app-text)",
          }),

          menu: (base) => ({
            ...base,
            zIndex: 50,
            borderRadius: "8px",
            overflow: "hidden",
          }),

          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "var(--app-primary)"
              : state.isFocused
                ? "#eef2ff"
                : "var(--app-surface)",
            color: state.isSelected ? "#ffffff" : "var(--app-text)",
            cursor: "pointer",
          }),

          multiValue: (base) => ({
            ...base,
            backgroundColor: "#eef2ff",
          }),

          multiValueLabel: (base) => ({
            ...base,
            color: "var(--app-primary)",
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
