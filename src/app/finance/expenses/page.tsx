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
  ScanFormData,
} from "./component/types";
import ExpensesTable from "./component/expensesTable";
import Filters from "./component/filters";
import Button from "@/components/Button";
import { Plus, ScanText } from "lucide-react";
import ExpenseModal from "./component/ExpenseModal";
import { toast } from "sonner";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import ScanBillModal from "./component/ScanBillModal";
import { extractBillText } from "@/lib/ocr";
import ExpensesCard from "./component/ExpensesCard";
export default function Expense() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [expenses, setExpenses] = useState<ExpensesResponse | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openScanBillModal, setOpenScanBillModal] = useState(false);
  const [scanFormData, setScanFormData] = useState<ScanFormData | null>(null);
  const [editExpenseData, setEditExpenseData] = useState<Expenses | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    CategoryOptions[] | null
  >(null);
  const handleScanBill = async (file: File) => {
    Loading.standard("Extracting bill text...");

    try {
      const extractedText = await extractBillText(file);

      console.log("OCR Text:", extractedText);
      if (!extractedText.trim()) {
        toast.error("Unable to extract text from bill");
        return;
      }
      Loading.change("Analyzing bill with AI...");
      const response = await apiService.post<any>("/api/ai/analyze-bill", {
        text: extractedText,
      });

      const data = response?.data || response;
      console.log("Parsed JSON:", data);
      const categoryId = categoryOptions?.find(
        (category) =>
          category.label.toLowerCase() === data.category?.toLowerCase(),
      )?.value;
      const scannedData: ScanFormData = {
        title: data.title || "Grocery Shopping",
        amount:
          data.amount !== null && data.amount !== undefined
            ? String(data.amount)
            : "",
        category: categoryId || "",
        note: data.note || "",
        bill: file,
      };
      setScanFormData(scannedData);
      setOpenScanBillModal(false);
      setOpenModal(true);
      toast.success("Bill scanned successfully");
    } catch (error: any) {
      console.error("Bill scanning error:", error);
      toast.error(error?.response?.data?.error || "Unable to analyze bill");
    } finally {
      Loading.remove();
    }
  };
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
  const handleSubmit = async (
    detail: HandleDetailPayload,
    isEdit = false,
    id?: number | null,
  ) => {
    console.log("getting details", detail, isEdit);
    const formData = new FormData();
    formData.append("title", detail.title);
    formData.append("amount", detail.amount);
    formData.append("category_id", detail.category);
    if (detail.billRemoved) {
      formData.append("billRemoved", String(detail.billRemoved ?? false));
    }
    if (detail.note) {
      formData.append("note", detail.note);
    }
    if (detail.bill) {
      formData.append("bill", detail.bill);
    }
    Loading.standard(isEdit ? "Updating expense..." : "Adding expense...");
    try {
      let result;
      if (isEdit) {
        result = await apiService.patch<CreateExpenseResponse>(
          `/api/expenses/${id}`,
          formData,
        );
      } else {
        result = await apiService.post<CreateExpenseResponse>(
          "/api/expenses",
          formData,
        );
      }
      await getExpenses();
      toast.success(isEdit ? "Expense Updated" : "Expense Added");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong. Please try again",
      );
    } finally {
      setOpenModal(false);
      Loading.remove();
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
              setScanFormData(null);
              setEditExpenseData(null);
              setOpenScanBillModal(true);
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
      <div
        className="
          block
          md:hidden
        "
      >
        <ExpensesCard
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
      </div>
      <div className="hidden md:block">
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
      </div>
      <ScanBillModal
        openModal={openScanBillModal}
        onClose={() => setOpenScanBillModal(false)}
        onManualAdd={() => {
          setScanFormData(null);
          setOpenScanBillModal(false);
          setOpenModal(true);
        }}
        onScanBill={handleScanBill}
      />
      <ExpenseModal
        categoryOptions={categoryOptions || []}
        openModal={openModal}
        expenseDetail={editExpenseData}
        prefillData={scanFormData}
        hasSubmit={handleSubmit}
        onClose={() => {
          setScanFormData(null);
          setEditExpenseData(null);
          setOpenModal(false);
        }}
      />
    </>
  );
}
