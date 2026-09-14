export interface Expenses {
  id: number;
  bill_url: string | null;
  expense_date: string;
  amount: number;
  note: string;
  title: string;
  category: Category | null;
}
export interface Category {
  id: string;
  name: string;
}
export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
export interface ExpensesTableProps {
  data: Expenses[];
  loader: Boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}
export interface ExpensesResponse {
  expenses: Expenses[];
  pagination: Pagination;
}
export interface CategoryData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface CategoryOptions{
  label:string;
  value:string;
}
export interface CategoryResponse{
categories:CategoryData[]
}
export interface FilterProps{
  categoryOption:CategoryOptions[] | null
}
export interface HandleDetailPayload{
  title:string;
  amount:string;
  category:string;
  bill?:File | null;
  note?:string
}