"use client";

import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import {
  CategoryData,
  CategoryOptions,
  CategoryResponse,
  CreateExpenseResponse,
  Expenses,
  ExpensesResponse,
  FilterUpdate,
  HandleDetailPayload,
} from "./component/types";
import ExpensesTable from "./component/expensesTable";
import Filters from "./component/filters";
import Button from "@/components/Button";
import { Plus, ScanText } from "lucide-react";
import ExpenseModal from "./component/ExpenseModal";
import { toast } from "sonner";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Loading } from "notiflix";
export default function Expense() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [expenses, setExpenses] = useState<ExpensesResponse | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editExpenseData, setEditExpenseData] = useState<Expenses | null>(null);
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
  const handleRefresh = () => {
    getExpenses();
  };
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
  const handleDelete = (data: any) => {
    Confirm.show(
      "Expense Delete",
      "Do you sure want to delete this expense?",
      "Yes",
      "no",
      async () => {
        Loading.standard("Deleting expense...");
        try {
          await apiService.delete<any>(`/api/expenses/${data.id}`);
          await getExpenses();
          toast.success("Expense successful deleted");
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message ||
              "Something went wrong, Please try later",
          );
        } finally {
          Loading.remove();
        }
      },
      () => {},
    );
  };
  useEffect(() => {
    getCategory();
  }, []);
  return (
    <>
      <div
        className="
          flex flex-col
          mb-5
          gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm text-text-muted
            "
          >
            Track and manage your daily expenses
          </p>
        </div>

        <div
          className="
            flex
            items-center gap-1.5
          "
        >
          <Button
            size="sm"
            buttonType="icon-text"
            leftIcon={<ScanText size={18} />}
            onClick={() => {
              setOpenModal(true);
            }}
            className="
              w-full
              py-2.5
              rounded-xl
              sm:w-auto
            "
          >
            Scan Bill
          </Button>
          <Button
            size="sm"
            buttonType="icon-text"
            leftIcon={<Plus size={18} />}
            onClick={() => {
              setOpenModal(true);
            }}
            className="
              w-full
              py-2.5
              rounded-xl
              sm:w-auto
            "
          >
            Add Expense
          </Button>
        </div>
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
        onDelete={handleDelete}
        onEdit={(data) => {
          setEditExpenseData(data || null);
          setOpenModal(true);
        }}
        totalAmount={expenses?.totalAmount ?? 0}
        loader={loading}
        onPageChange={(page) => {
          console.log("change page", page);
        }}
      />
      <ExpenseModal
        categoryOptions={categoryOptions ? categoryOptions : null}
        openModal={openModal}
        expenseDetail={editExpenseData}
        hasSubmit={handleSubmit}
        onClose={() => {
          setEditExpenseData(null);
          setOpenModal(false);
        }}
      />
    </>
  );
}
