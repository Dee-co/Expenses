"use client";

import React from "react";
import {
  Edit2,
  Trash2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { ExpensesTableProps, Expenses } from "./types";
import Button from "@/components/Button";

const skeletonRecords: Expenses[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: index + 1,
    title: "",
    category: null,
    amount: 0,
    created_at: "",
    bill_url: null,
    note: "",
  }),
);

function SkeletonLine({
  width = "70%",
}: {
  width?: string;
}) {
  return (
    <div
      style={{ width }}
      className="h-3 animate-pulse rounded-md bg-border"
    />
  );
}

function SkeletonBox() {
  return (
    <div className="h-9 w-9 animate-pulse rounded-lg bg-border" />
  );
}

function NoExpensesIcon() {
  return (
    <ReceiptText
      size={34}
      strokeWidth={1.5}
      className="text-text-muted"
    />
  );
}

export default function ExpensesCard({
  data,
  pagination,
  loader,
  totalAmount,
  onPageChange,
  onEdit,
  onDelete,
}: ExpensesTableProps) {
  const records = loader ? skeletonRecords : data;

  const isEmpty = !loader && data.length === 0;

  if (isEmpty) {
    return (
      <div
        className="
          flex min-h-75 flex-col items-center justify-center
          rounded-2xl border border-border bg-surface
          px-6 py-12 text-center shadow-sm
        "
      >
        <div
          className="
            mb-3 flex h-12 w-12 items-center justify-center
            rounded-full bg-primary/5
          "
        >
          <NoExpensesIcon />
        </div>

        <p className="text-sm font-semibold text-text">
          No expenses found
        </p>

        <p className="mt-1 text-xs text-text-muted">
          Your expenses will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        flex flex-col overflow-hidden
        rounded-2xl border border-border
        bg-surface shadow-sm
      "
    >
      {/* Cards */}
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        {records.map((expense) => {
          const date = expense.created_at
            ? new Date(expense.created_at)
            : null;

          return (
            <div
              key={expense.id}
              className="
                group rounded-2xl border border-border
                bg-background/30 p-4
                transition-all duration-200
                hover:border-primary/40 hover:shadow-sm
              "
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="
                      flex h-11 w-11 shrink-0 items-center
                      justify-center rounded-xl
                      bg-primary/10 text-primary
                    "
                  >
                    {loader ? (
                      <div className="h-5 w-5 animate-pulse rounded bg-border" />
                    ) : (
                      <Wallet size={20} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {loader ? (
                      <div className="flex flex-col gap-2">
                        <SkeletonLine width="140px" />
                        <SkeletonLine width="190px" />
                      </div>
                    ) : (
                      <>
                        <h3
                          title={expense.title}
                          className="
                            truncate text-sm font-semibold
                            capitalize text-text
                          "
                        >
                          {expense.title}
                        </h3>

                        <p
                          title={expense.note || "No notes added"}
                          className="
                            mt-1 line-clamp-2 text-xs
                            leading-relaxed text-text-muted
                          "
                        >
                          {expense.note || "No notes added"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="shrink-0 text-right">
                  {loader ? (
                    <SkeletonLine width="85px" />
                  ) : (
                    <>
                      <p className="text-base font-bold text-primary">
                        ₹
                        {Number(expense.amount).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>

                      <p className="mt-1 text-[10px] text-text-muted">
                        Amount
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Details */}
              <div
                className="
                  mt-4 flex flex-wrap items-center
                  justify-between gap-3
                  border-t border-border pt-3
                "
              >
                {/* Category */}
                {loader ? (
                  <div className="h-7 w-20 animate-pulse rounded-full bg-border" />
                ) : (
                  <span
                    className="
                      inline-flex whitespace-nowrap
                      rounded-full bg-primary/10
                      px-3 py-1.5 text-xs font-medium
                      text-primary
                    "
                  >
                    {expense.category?.name || "Other"}
                  </span>
                )}

                {/* Date */}
                {loader ? (
                  <div className="flex flex-col gap-2">
                    <SkeletonLine width="105px" />
                    <SkeletonLine width="75px" />
                  </div>
                ) : !date ? (
                  <span className="text-xs text-text-muted">
                    -
                  </span>
                ) : (
                  <div className="flex items-start gap-2">
                    <CalendarDays
                      size={15}
                      className="mt-0.5 text-text-muted"
                    />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-text">
                        {date.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <span className="text-[11px] text-text-muted">
                        {date.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div
                className="
                  mt-3 flex items-center justify-between
                  border-t border-border pt-3
                "
              >
                {/* Bill */}
                {loader ? (
                  <SkeletonBox />
                ) : expense.bill_url ? (
                  <a
                    href={expense.bill_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View bill"
                    className="
                      group/bill relative flex h-10 w-10
                      overflow-hidden rounded-lg
                      border border-border
                    "
                  >
                    <img
                      src={expense.bill_url}
                      alt="Expense bill"
                      className="
                        h-full w-full object-cover
                        transition-transform duration-200
                        group-hover/bill:scale-110
                      "
                    />

                    <span
                      className="
                        absolute inset-0 flex items-center
                        justify-center bg-black/40
                        text-white opacity-0
                        transition-opacity
                        group-hover/bill:opacity-100
                      "
                    >
                      <ExternalLink size={14} />
                    </span>
                  </a>
                ) : (
                  <span className="text-xs text-text-muted">
                    No Bill
                  </span>
                )}

                {/* Actions */}
                {loader ? (
                  <div className="flex gap-2">
                    <SkeletonBox />
                    <SkeletonBox />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onEdit(expense)}
                      variant="outline"
                      buttonType="icon"
                      className="px-2 py-2"
                      leftIcon={
                        <Edit2 size={14} strokeWidth={1.8} />
                      }
                    />

                    <Button
                      onClick={() => onDelete(expense)}
                      variant="outline"
                      buttonType="icon"
                      color="danger"
                      className="px-2 py-2"
                      leftIcon={
                        <Trash2 size={14} strokeWidth={1.8} />
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {!loader && pagination.totalPages > 0 && (
        <div
          className="
            flex flex-col gap-4
            border-t border-border
            bg-background/40 px-4 py-4
            sm:flex-row sm:items-center
            sm:justify-between
          "
        >
          {/* Showing */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">
              Showing
            </span>

            <span className="font-semibold text-text">
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) *
                    pagination.limit +
                  1}
              –
              {Math.min(
                pagination.page * pagination.limit,
                pagination.total,
              )}
            </span>

            <span className="text-text-muted">
              of {pagination.total}
            </span>
          </div>

          {/* Total */}
          <div
            className="
              flex items-center justify-between
              rounded-lg border border-border
              bg-surface px-3 py-2
              sm:justify-center
            "
          >
            <span className="mr-2 text-xs text-text-muted">
              Total:
            </span>

            <span className="text-sm font-bold text-primary">
              ₹
              {Number(totalAmount ?? 0).toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </span>
          </div>

          {/* Navigation
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() =>
                onPageChange(pagination.page - 1)
              }
              leftIcon={<ArrowLeft size={16} />}
              type="button"
              className="px-2 py-2"
              disabled={pagination.page === 1}
              buttonType="icon"
              variant="outline"
            />

            <span
              className="
                flex h-9 min-w-9 items-center
                justify-center rounded-lg
                bg-primary px-3 text-sm
                font-semibold text-white
              "
            >
              {pagination.page}
            </span>

            <Button
              onClick={() =>
                onPageChange(pagination.page + 1)
              }
              leftIcon={<ArrowRight size={16} />}
              type="button"
              className="px-2 py-2"
              disabled={
                pagination.page === pagination.totalPages
              }
              buttonType="icon"
              variant="outline"
            />
          </div> */}
        </div>
      )}
    </div>
  );
}