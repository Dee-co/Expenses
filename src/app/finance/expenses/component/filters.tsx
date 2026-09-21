"use client";

import CustomSelect from "@/components/CustomSelect";
import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import { FilterProps } from "./types";
import Button from "@/components/Button";
import { RotateCw } from "lucide-react";

export default function Filters({
  categoryOption,
  onRefresh,
  filterUpdate,
}: FilterProps) {
  const [title, setTitle] = useState("");

  const [filters, setFilters] = useState({
    selectedCategory: "",
    title: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, title }));
    }, 500);

    return () => clearTimeout(timer);
  }, [title]);

  useEffect(() => {
    filterUpdate(filters);
  }, [filters]);

  const handleRefresh = () => {
    setTitle("");

    setFilters({
      selectedCategory: "",
      title: "",
    });

    onRefresh();
  };

  return (
    <div
      className="
        mb-3
        grid
        grid-cols-1
        gap-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-4
      "
    >
      {/* Search by Title */}
      <Input
        name="title"
        placeholder="Search by title"
        value={title}
        clearable
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      {/* Category + Refresh - Mobile Same Row */}
      <div className="flex min-w-0 items-center gap-2 md:contents">
        <div className="min-w-0 flex-1">
          <CustomSelect
            instanceId="expense-category-id"
            clearable
            placeholder="Search by category"
            options={categoryOption ?? []}
            value={filters.selectedCategory}
            onChange={(value) => {
              if (typeof value === "string") {
                setFilters((prev) => ({
                  ...prev,
                  selectedCategory: value,
                }));
              }
            }}
          />
        </div>

        <div className="shrink-0">
          <Button
            buttonType="icon"
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            leftIcon={<RotateCw size={15} />}
          />
        </div>
      </div>
    </div>
  );
}