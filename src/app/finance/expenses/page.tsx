"use client";

import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import {
  CategoryData,
  CategoryOptions,
  CategoryResponse,
  CreateExpenseResponse,
  ExpensesResponse,
  FilterUpdate,
  HandleDetailPayload,
} from "./component/types";
import ExpensesTable from "./component/expensesTable";
import Filters from "./component/filters";
import Button from "@/components/Button";
import { Plus } from "lucide-react";
import AddExpenseModal from "./component/AddExpenseModal";
import { toast } from "sonner";

export default function Expense() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [expenses, setExpenses] = useState<ExpensesResponse | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<
    CategoryOptions[] | null
  >(null);

const getExpenses = async (data?: FilterUpdate | null) => {
  setLoading(true);

  try {
    const params = new URLSearchParams();

    if (data?.selectedCategory) {
      params.append("categoryId", data.selectedCategory);
    }

    if (data?.title) {
      params.append("search", data.title);
    }

    const response = await apiService.get<ExpensesResponse>(
      `/api/expenses?${params.toString()}`,
    );

    setExpenses(response);
  } catch (error) {
    console.log("getting error", error);
  } finally {
    setLoading(false);
  }
};
const handleRefresh = ()=>{
  getExpenses()
}
  const handleUpdateFilter = async (data: FilterUpdate) => {
    await getExpenses(data);
  };
  const getCategory = async () => {
    try {
      const response = await apiService.get<CategoryResponse>("/api/category");
      const categoryOptions = response?.categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      setCategoryOptions(categoryOptions || null);
    } catch (error) {
      console.log("getting error", error);
    }
  };
  const handleSubmit = async (detail: HandleDetailPayload) => {
    const formData = new FormData();
    formData.append("title", detail.title);
    formData.append("amount", detail.amount);
    formData.append("category_id", detail.category);
    if (detail.note) {
      formData.append("note", detail.note);
    }
    if (detail.bill) {
      formData.append("bill", detail.bill);
    }
    try {
      const result = await apiService.post<CreateExpenseResponse>(
        "/api/expenses",
        formData,
      );
      console.log("getting response", result);
      await getExpenses();
      toast.success("Expense Added");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong. Please try again",
      );
    } finally {
      setOpenModal(false);
    }
  };
  useEffect(() => {
    getCategory();
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
      <Filters
        categoryOption={categoryOptions || null}
        onRefresh={handleRefresh}
        filterUpdate={handleUpdateFilter}
      />
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
