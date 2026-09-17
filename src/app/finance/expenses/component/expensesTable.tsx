"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ExpensesTableProps, Expenses } from "./types";
const skeletonRecords: Expenses[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index + 1,
    title: "",
    category: null,
    amount: 0,
    created_at: "",
    bill_url: null,
    note: "",
  })
);

function SkeletonLine({
  width = "70%",
}: {
  width?: string;
}) {
  return (
    <div
      className="h-4 animate-pulse rounded-md bg-border"
      style={{ width }}
    />
  );
}

function SkeletonBox() {
  return (
    <div className="h-10 w-10 animate-pulse rounded-lg bg-border" />
  );
}

function NoExpensesIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h4" />
      <path d="M7 16h6" />
      <path d="M16 12l3 3" />
      <path d="M19 12l-3 3" />
    </svg>
  );
}

function SortIcon({
  direction,
}: {
  direction: false | "asc" | "desc";
}) {
  if (direction === "asc") {
    return (
      <span className="text-primary">
        ↑
      </span>
    );
  }

  if (direction === "desc") {
    return (
      <span className="text-primary">
        ↓
      </span>
    );
  }

  return (
    <span className="text-text-muted">
      ↕
    </span>
  );
}

export default function ExpensesTable({
  data,
  pagination,
  loader,
  onPageChange,
}: ExpensesTableProps) {
  const columns: ColumnDef<Expenses>[] = [
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,

      cell: ({ row }) =>
        loader ? (
          <SkeletonLine width="70%" />
        ) : (
          <span className="font-semibold capitalize text-text">
            {row.original.title}
          </span>
        ),
    },

    {
      accessorKey: "category",
      header: "Category",
      enableSorting: true,

      sortingFn: (rowA, rowB) => {
        const categoryA =
          rowA.original.category?.name || "Other";

        const categoryB =
          rowB.original.category?.name || "Other";

        return categoryA.localeCompare(categoryB);
      },

      cell: ({ row }) =>
        loader ? (
          <div className="h-6 w-20 animate-pulse rounded-full bg-border" />
        ) : (
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {row.original.category?.name || "Other"}
          </span>
        ),
    },

    {
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,

      sortingFn: (rowA, rowB) => {
        return (
          Number(rowA.original.amount) -
          Number(rowB.original.amount)
        );
      },

      cell: ({ row }) =>
        loader ? (
          <SkeletonLine width="80px" />
        ) : (
          <span className="font-semibold text-primary">
            ₹
            {Number(row.original.amount).toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </span>
        ),
    },

    {
      accessorKey: "expense_date",
      header: "Date",
      enableSorting: true,

      sortingFn: (rowA, rowB) => {
        return (
          new Date(
            rowA.original.created_at
          ).getTime() -
          new Date(
            rowB.original.created_at
          ).getTime()
        );
      },

      cell: ({ row }) =>
        loader ? (
          <SkeletonLine width="100px" />
        ) : (
          <span className="text-text-muted">
            {row.original.created_at
              ? new Date(
                  row.original.created_at
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour:"2-digit",
                  minute:"2-digit",
                  hour12:true
                })
              : "-"}
          </span>
        ),
    },

    {
      accessorKey: "bill_url",
      header: "Bill",
      enableSorting: false,

      cell: ({ row }) =>
        loader ? (
          <SkeletonBox />
        ) : row.original.bill_url ? (
          <button
            type="button"
            title="View bill"
            className="group cursor-pointer"
          >
            <img
              src={row.original.bill_url}
              alt="Bill"
              className="h-10 w-10 rounded-lg border border-border object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ) : (
          <span className="text-xs text-text-muted">
            No Bill
          </span>
        ),
    },
  ];

  const table = useReactTable({
    data: loader ? skeletonRecords : data,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = !loader && data.length === 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      {isEmpty ? (
        <div className="flex min-h-55 flex-col items-center justify-center px-6 py-12">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
            <NoExpensesIcon />
          </div>

          <p className="text-sm font-semibold text-text">
            No expenses found
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Your expenses will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-border"
                  >
                    {headerGroup.headers.map((header) => {
                      const canSort =
                        header.column.getCanSort();

                      const sortDirection =
                        header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-text-muted ${
                            canSort
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                        >
                          <div
                            className={`flex items-center gap-2 ${
                              canSort
                                ? "transition-colors hover:text-primary"
                                : ""
                            }`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            {canSort && (
                              <SortIcon
                                direction={sortDirection}
                              />
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border last:border-b-0 ${
                      !loader
                        ? "transition-colors hover:bg-primary/5"
                        : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loader && pagination.totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-sm text-text-muted">
                {Math.min(
                  (pagination.page - 1) *
                    pagination.limit +
                    1,
                  pagination.total
                )}
                –
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                of{" "}
                <span className="font-medium text-text">
                  {pagination.total}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    onPageChange(pagination.page - 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-white">
                  {pagination.page}
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.page ===
                    pagination.totalPages
                  }
                  onClick={() =>
                    onPageChange(pagination.page + 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}