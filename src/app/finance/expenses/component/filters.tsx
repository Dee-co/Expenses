"use client";
import CustomSelect from "@/components/CustomSelect";
import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import { FilterProps } from "./types";
import Button from "@/components/Button";
import { RotateCw } from "lucide-react";

export default function Filters({ categoryOption,onRefresh, filterUpdate }: FilterProps) {
  const [title,setTitle]= useState("")
  const [filters, setFilters] = useState({
    selectedCategory: "",
    title: "",
  });
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setFilters((prev)=>({...prev,title}))
    },500)
    return()=>{
      clearTimeout(timer)
    }
  },[title])
  useEffect(() => {
    filterUpdate(filters);
  }, [filters]);
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
          setTitle(e.target.value)
        }}
      />
      <CustomSelect
        instanceId="expense-category-id"
        clearable
        placeholder="Search by category"
        options={categoryOption ? categoryOption : []}
        value={filters.selectedCategory}
        onChange={(value) => {
          if (typeof value === "string") {
            setFilters((prev) => ({ ...prev, selectedCategory: value }));
          }
        }}
      />
      <div>
        <Button
          buttonType="icon"
          size="sm"
          variant="outline"
          onClick={() => {
            setFilters({
              selectedCategory: "",
              title: "",
            });
            onRefresh()
          }}
          leftIcon={<RotateCw size={15} />}
        />
      </div>
    </div>
  );
}
