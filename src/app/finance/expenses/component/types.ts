export interface Expenses {
  id: number;
  bill_url: string | null;
  created_at: string;
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
  totalAmount:number;
  pagination: Pagination;
  onEdit:(data:Expenses)=>void;
  onDelete:(data:Expenses)=>void;
  onPageChange: (page: number) => void;
}
export interface ExpensesResponse {
  expenses: Expenses[];
  pagination: Pagination;
  totalAmount:number
}
export interface CategoryData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface CategoryOptions {
  label: string;
  value: string;
}
export interface CategoryResponse {
  categories: CategoryData[];
}
export interface FilterUpdate{
  selectedCategory:string | null;
  title:string | null
}
export interface FilterProps {
  categoryOption: CategoryOptions[] | null;
  filterUpdate:(filters:FilterUpdate)=>void;
  onRefresh:()=>void
}
export interface HandleDetailPayload {
  title: string;
  amount: string;
  category: string;
  bill?: File | null;
  note?: string;
  billRemoved?:boolean
}
export interface CreateExpenseResponse {
  message: string;
  expense: Expenses;
}

export interface ScanBillProps {
  openModal: boolean;
  onClose: () => void;
  onManualAdd: () => void;
  onScanBill: (file: File) => void;
}

export interface ScanFormData {
  title: string;
  amount: string;
  category: string;
  note: string;
  bill: File | null;
}
