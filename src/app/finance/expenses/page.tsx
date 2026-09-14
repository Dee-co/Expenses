"use client";

import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import {
  CategoryData,
  CategoryOptions,
  CategoryResponse,
  ExpensesResponse,
  HandleDetailPayload,
} from "./component/types";
import ExpensesTable from "./component/expensesTable";
import Filters from "./component/filters";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import AddExpenseModal from "./component/AddExpenseModal";

export default function Expense() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [expenses, setExpenses] = useState<ExpensesResponse | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<
    CategoryOptions[] | null
  >(null);
  const getExpenses = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<ExpensesResponse>(`/api/expenses`);
      setExpenses(response);
    } catch (error) {
      console.log("getting error", error);
    } finally {
      setLoading(false);
    }
  };
  const getCategory = async () => {
    try {
      const response = await apiService.get<CategoryResponse>("/api/category");
      const categoryOptions = response?.categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      setCategoryOptions(categoryOptions || null);
      console.log("getting category option", categoryOptions);
    } catch (error) {
      console.log("getting error", error);
    }
  };
  const handleSubmit = (detail:HandleDetailPayload)=>{
    console.log("getting details",detail)
  }
  useEffect(() => {
    getCategory();
    getExpenses();
  }, []);
  return (
    <>
      <div
        className="
          flex
          mb-2
          justify-between items-center
        "
      >
        <h1> Expense</h1>
        <Button
          size="sm"
          buttonType="icon-text"
          leftIcon={<Plus size={18} />}
          onClick={() => {
            setOpenModal(true);
          }}
          className="
            py-2
          "
        >
          Add Expense
        </Button>
      </div>
      <Filters categoryOption={categoryOptions || null} />
      <ExpensesTable
        data={expenses?.expenses ?? []}
        pagination={
          expenses?.pagination ?? {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          }
        }
        loader={loading}
        onPageChange={(page) => {
          console.log("change page", page);
        }}
      />
      <AddExpenseModal
        categoryOptions={categoryOptions ? categoryOptions : null}
        openModal={openModal}
        hasSubmit={handleSubmit}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
