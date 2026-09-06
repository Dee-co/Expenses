"use client";

import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import { ExpensesResponse } from "./component/types";
import ExpensesTable from "./component/expensesTable";

export default function Expense() {
    const [loading,setLoading] = useState<Boolean>(false)
  const [expenses, setExpenses] = useState<ExpensesResponse | null>(null);
  const getExpenses = async () => {
    setLoading(true)
    try {
      const response = await apiService.get<ExpensesResponse>(`/api/expenses`);
      console.log("getting response", response);
      setExpenses(response);
    } catch (error) {
      console.log("getting error", error);
    }finally{
        setLoading(false)
    }
  };
  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <>
      <div
        className="
          mb-2
        "
      >
        Expense
      </div>
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
    </>
  );
}
