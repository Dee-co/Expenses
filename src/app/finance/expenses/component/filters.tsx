"use client";
import CustomSelect from "@/components/CustomSelect";
import Input from "@/components/Input";
import React, { useState } from "react";
import { FilterProps } from "./types";
import Button from "@/components/Button";
import { RotateCw } from "lucide-react";

export default function Filters({ categoryOption }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [title, setTitle] = useState("");
  return (
    <div
      className="
        grid grid-cols-1
        mb-3
        gap-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-4
      "
    >
      <Input
        name="title"
        placeholder="Search by title"
        value={title}
        clearable
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <CustomSelect
        instanceId="expense-category-id"
        clearable
        placeholder="Search by category"
        options={categoryOption ? categoryOption : []}
        value={selectedCategory}
        onChange={(value) => {
          if (typeof value === "string") {
            setSelectedCategory(value);
          }
        }}
      />
      <div>
        <Button
        buttonType="icon"
        size="sm"
        variant="outline"
        onClick={() => {}}
        leftIcon={<RotateCw size={15} />}
      />
      </div>
    </div>
  );
}
