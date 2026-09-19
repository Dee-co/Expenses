"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Edit2,
  Trash2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { ExpensesTableProps, Expenses } from "./types";
import Button from "@/components/Button";
const skeletonRecords: Expenses[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: "",
  category: null,
  amount: 0,
  created_at: "",
  bill_url: null,
  note: "",
}));
function SkeletonLine({ width = "70%" }: { width?: string }) {
  return (
    <div
      style={{ width }}
      className="
        h-4
        bg-border
        rounded-md
        animate-pulse
      "
    />
  );
}
function SkeletonBox() {
  return (
    <div
      className="
        h-9 w-9
        bg-border
        rounded-lg
        animate-pulse
      "
    />
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
      className="
        text-text-muted
      "
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
function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") {
    return (
      <span
        className="
          text-primary
        "
      >
        ↑
      </span>
    );
  }

  if (direction === "desc") {
    return (
      <span
        className="
          text-primary
        "
      >
        ↓
      </span>
    );
  }

  return (
    <span
      className="
        text-text-muted
      "
    >
      ↕
    </span>
  );
}
export default function ExpensesTable({
  data,
  pagination,
  loader,
  totalAmount,
  onPageChange,
  onEdit,
  onDelete
}: ExpensesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns: ColumnDef<Expenses>[] = [
    {
      accessorKey: "title",
      header: "Expense",
      enableSorting: true,

      cell: ({ row }) =>
        loader ? (
          <div
            className="
              flex flex-col
              gap-2
            "
          >
            <SkeletonLine width="150px" />
            <SkeletonLine width="200px" />
          </div>
        ) : (
          <div
            className="
              flex flex-col
              min-w-47.5 max-w-70
              gap-1
            "
          >
            <span
              title={row.original.title}
              className="
                text-sm font-semibold text-text
                truncate capitalize
              "
            >
              {row.original.title}
            </span>

            <span
              title={row.original.note || "No notes added"}
              className="
                text-xs leading-relaxed text-text-muted
                line-clamp-2
              "
            >
              {row.original.note || "No notes added"}
            </span>
          </div>
        ),
    },
    {
      accessorKey: "category",
      header: "Category",
      enableSorting: true,

      sortingFn: (rowA, rowB) => {
        const categoryA = rowA.original.category?.name || "Other";

        const categoryB = rowB.original.category?.name || "Other";

        return categoryA.localeCompare(categoryB);
      },

      cell: ({ row }) =>
        loader ? (
          <div
            className="
              h-6 w-20
              bg-border
              rounded-full
              animate-pulse
            "
          />
        ) : (
          <span
            className="
              inline-flex
              px-3 py-1.5
              whitespace-nowrap text-xs font-medium text-primary
              bg-primary/10
              rounded-full
            "
          >
            {row.original.category?.name || "Other"}
          </span>
        ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,

      sortingFn: (rowA, rowB) => {
        return Number(rowA.original.amount) - Number(rowB.original.amount);
      },

      cell: ({ row }) =>
        loader ? (
          <SkeletonLine width="90px" />
        ) : (
          <span
            className="
              whitespace-nowrap text-sm font-bold text-primary
            "
          >
            ₹
            {Number(row.original.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      enableSorting: true,

      sortingFn: (rowA, rowB) => {
        return (
          new Date(rowA.original.created_at).getTime() -
          new Date(rowB.original.created_at).getTime()
        );
      },

      cell: ({ row }) => {
        if (loader) {
          return (
            <div
              className="
                flex flex-col
                gap-2
              "
            >
              <SkeletonLine width="105px" />
              <SkeletonLine width="75px" />
            </div>
          );
        }

        if (!row.original.created_at) {
          return (
            <span
              className="
                text-sm text-text-muted
              "
            >
              -
            </span>
          );
        }

        const date = new Date(row.original.created_at);

        return (
          <div
            className="
              flex flex-col
              min-w-31.25
              gap-1
            "
          >
            <span
              className="
                text-sm font-medium text-text
              "
            >
              {date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            <span
              className="
                text-xs text-text-muted
              "
            >
              {date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        );
      },
    },

    // Bill
    {
      accessorKey: "bill_url",
      header: "Bill",
      enableSorting: false,

      cell: ({ row }) =>
        loader ? (
          <SkeletonBox />
        ) : row.original.bill_url ? (
          <a
            href={row.original.bill_url}
            target="_blank"
            rel="noopener noreferrer"
            title="View bill"
            className="
              block overflow-hidden
              h-11 w-11
              rounded-lg border border-border
              group relative
            "
          >
            <img
              src={row.original.bill_url}
              alt="Expense bill"
              className="
                object-cover
                h-full w-full
                transition-transform
                duration-200 group-hover:scale-110
              "
            />

            <span
              className="
                flex
                text-white
                bg-black/40
                opacity-0 transition-opacity
                absolute inset-0 items-center justify-center group-hover:opacity-100
              "
            >
              <ExternalLink size={14} />
            </span>
          </a>
        ) : (
          <span
            className="
              text-xs text-text-muted
            "
          >
            No Bill
          </span>
        ),
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,

      cell: ({ row }) =>
        loader ? (
          <div
            className="
              flex
              gap-2
            "
          >
            <SkeletonBox />
            <SkeletonBox />
          </div>
        ) : (
          <div
            className="
              flex
              items-center gap-2
            "
          >
            <Button
              onClick={() => {onEdit(row.original)}}
              variant="outline"
              buttonType="icon"
              className="px-1.5 py-1.5"
              leftIcon={<Edit2 size={12} strokeWidth={1.8} />}
            />
            <Button
              onClick={() => {onDelete(row.original)}}
              variant="outline"
              buttonType="icon"
              color="danger"
              className="px-1.5 py-1.5"
              leftIcon={<Trash2 size={12} strokeWidth={1.8} />}
            />
          </div>
        ),
    },
  ];
  const table = useReactTable({
    data: loader ? skeletonRecords : data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });
  const isEmpty = !loader && data.length === 0;
  return (
    <div
      className="
        flex flex-col overflow-hidden
        h-[calc(100vh-250px)]
        bg-surface
        rounded-xl border border-border
        shadow-sm
      "
    >
      {isEmpty ? (
        <div
          className="
            flex flex-col
            h-full min-h-75
            px-6 py-12
            text-center
            items-center justify-center
          "
        >
          <div
            className="
              flex
              h-12 w-12
              mb-3
              bg-primary/5
              rounded-full
              items-center justify-center
            "
          >
            <NoExpensesIcon />
          </div>

          <p
            className="
              text-sm font-semibold text-text
            "
          >
            No expenses found
          </p>

          <p
            className="
              mt-1
              text-xs text-text-muted
            "
          >
            Your expenses will appear here.
          </p>
        </div>
      ) : (
        <>
          <div
            className="
              flex-1 overflow-x-auto
              min-h-0 w-full
            "
          >
            <table
              className="
                w-full min-w-250
                border-collapse
              "
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="
                      bg-background/60
                      border-b border-border
                    "
                  >
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sortDirection = header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          className={`
                            px-5 py-4
                            text-left text-[11px] font-semibold tracking-wider text-text-muted
                            uppercase
                            ${canSort ? "cursor-pointer select-none" : ""}
                          `}
                        >
                          <div
                            className={`
                              flex
                              items-center gap-2
                              ${
                              canSort
                              ? "transition-colors hover:text-primary"
                              : ""
                              }
                            `}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                            {canSort && <SortIcon direction={sortDirection} />}
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
                    className={`
                      border-b border-border
                      last:border-b-0
                      ${!loader ? "transition-colors hover:bg-primary/3" : ""}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="
                          px-5 py-4
                          align-middle text-sm
                        "
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loader && pagination.totalPages > 0 && (
            <div
              className="
                flex flex-col
                px-5 py-4
                bg-background/40
                border-t border-border
                shrink-0 gap-4
                sm:flex-row sm:items-center sm:justify-between
              "
            >
              <div
                className="
                  flex
                  text-sm
                  items-center gap-2
                "
              >
                <span
                  className="
                    text-text-muted
                  "
                >
                  Showing
                </span>

                <span
                  className="
                    font-semibold text-text
                  "
                >
                  {pagination.total === 0
                    ? 0
                    : (pagination.page - 1) * pagination.limit + 1}
                  –
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>

                <span
                  className="
                    text-text-muted
                  "
                >
                  of {pagination.total}
                </span>
              </div>
              <div
                className="
                  flex
                  px-4 py-2
                  bg-surface
                  rounded-lg border border-border
                  items-center gap-2
                "
              >
                <span
                  className="
                    text-sm text-text-muted
                  "
                >
                  Total:
                </span>
                <span
                  className="
                    text-base font-bold text-primary
                  "
                >
                  ₹
                  {Number(totalAmount ?? 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div
                className="
                  flex
                  items-center gap-2
                "
              >
                <Button
                  onClick={() => onPageChange(pagination.page - 1)}
                  leftIcon={<ArrowLeft size={16} />}
                  type="button"
                  className="px-2 py-2"
                  disabled={pagination.page === 1}
                  buttonType="icon"
                  variant="outline"
                ></Button>
                <span
                  className="
                    flex
                    h-9 min-w-9
                    px-3
                    text-sm font-semibold text-white
                    bg-primary
                    rounded-lg
                    items-center justify-center
                  "
                >
                  {pagination.page}
                </span>
                <Button
                  onClick={() => onPageChange(pagination.page + 1)}
                  leftIcon={<ArrowRight size={16} strokeWidth={1.8}/>}
                  type="button"
                  className="px-2 py-2"
                  disabled={pagination.page === pagination.totalPages}
                  buttonType="icon"
                  variant="outline"
                ></Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
