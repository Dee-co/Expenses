"use client";

import React, { useEffect, useRef } from "react";
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

const skeletonRecords: Expenses[] = Array.from({ length: 6 }, (_, index) => ({
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
        h-3
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
    <ReceiptText
      size={34}
      strokeWidth={1.5}
      className="
        text-text-muted
      "
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
  const cardRef = useRef<HTMLDivElement>(null);
  const requestedPageRef = useRef<number | null>(null);
  useEffect(() => {
    if (!loader) {
      requestedPageRef.current = null;
    }
  }, [loader]);
  useEffect(() => {
  if (pagination.page === 1 && !loader) {
    cardRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }
}, [pagination.page, loader]);
  useEffect(() => {
    if (pagination.page === 1) {
      requestedPageRef.current = null;
    } else {
      requestedPageRef.current = pagination.page;
    }
  }, [pagination.page]);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleScroll = () => {
      if (loader) return;
      const { clientHeight, scrollHeight, scrollTop } = card;
      const isNearBottom = scrollTop + clientHeight + 120 >= scrollHeight;
      const hasNextPage = pagination.page < pagination.totalPages;
      const nextPage = pagination.page + 1;
      if (!isNearBottom || !hasNextPage) return;
      if (requestedPageRef.current === nextPage) return;
      requestedPageRef.current = nextPage;
      onPageChange(nextPage);
    };
    card.addEventListener("scroll", handleScroll);
    return () => {
      card.removeEventListener("scroll", handleScroll);
    };
  }, [loader, pagination.page, pagination.totalPages, onPageChange]);
  if (isEmpty) {
    return (
      <div
        className="
          flex flex-col
          min-h-75
          px-6 py-12
          text-center
          bg-surface
          rounded-2xl border border-border
          shadow-sm
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
    );
  }

  return (
    <div
      className="
        flex flex-col
        h-[calc(100vh-250px)]
        bg-surface
        rounded-2xl border border-border
        shadow-sm
      "
    >
      <div
        ref={cardRef}
        className="
          flex flex-1 flex-col overflow-auto
          min-h-0
          p-3
          gap-3
          sm:p-4
        "
      >
        {records.map((expense) => {
          const date = expense.created_at ? new Date(expense.created_at) : null;

          return (
            <div
              key={expense.id}
              className="
                p-4
                bg-background/30
                rounded-2xl border border-border
                transition-all
                group duration-200 hover:border-primary/40 hover:shadow-sm
              "
            >
              {/* Header */}
              <div
                className="
                  flex
                  items-start justify-between gap-3
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-start gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-11 w-11
                      text-primary
                      bg-primary/10
                      rounded-xl
                      shrink-0 items-center justify-center
                    "
                  >
                    {loader ? (
                      <div
                        className="
                          h-5 w-5
                          bg-border
                          animate-pulse
                          rounded
                        "
                      />
                    ) : (
                      <Wallet size={20} />
                    )}
                  </div>

                  <div
                    className="
                      flex-1
                      min-w-0
                    "
                  >
                    {loader ? (
                      <div
                        className="
                          flex flex-col
                          gap-2
                        "
                      >
                        <SkeletonLine width="140px" />
                        <SkeletonLine width="190px" />
                      </div>
                    ) : (
                      <>
                        <h3
                          title={expense.title}
                          className="
                            text-sm font-semibold text-text
                            truncate capitalize
                          "
                        >
                          {expense.title}
                        </h3>

                        <p
                          title={expense.note || "No notes added"}
                          className="
                            mt-1
                            text-xs leading-relaxed text-text-muted
                            line-clamp-2
                          "
                        >
                          {expense.note || "No notes added"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div
                  className="
                    text-right
                    shrink-0
                  "
                >
                  {loader ? (
                    <SkeletonLine width="85px" />
                  ) : (
                    <>
                      <p
                        className="
                          text-base font-bold text-primary
                        "
                      >
                        ₹
                        {Number(expense.amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px] text-text-muted
                        "
                      >
                        Amount
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Details */}
              <div
                className="
                  flex flex-wrap
                  mt-4 pt-3
                  border-t border-border
                  items-center justify-between gap-3
                "
              >
                {/* Category */}
                {loader ? (
                  <div
                    className="
                      h-7 w-20
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
                    {expense.category?.name || "Other"}
                  </span>
                )}

                {/* Date */}
                {loader ? (
                  <div
                    className="
                      flex flex-col
                      gap-2
                    "
                  >
                    <SkeletonLine width="105px" />
                    <SkeletonLine width="75px" />
                  </div>
                ) : !date ? (
                  <span
                    className="
                      text-xs text-text-muted
                    "
                  >
                    -
                  </span>
                ) : (
                  <div
                    className="
                      flex
                      items-start gap-2
                    "
                  >
                    <CalendarDays
                      size={15}
                      className="
                        mt-0.5
                        text-text-muted
                      "
                    />

                    <div
                      className="
                        flex flex-col
                        gap-0.5
                      "
                    >
                      <span
                        className="
                          text-xs font-medium text-text
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
                          text-[11px] text-text-muted
                        "
                      >
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
                  flex
                  mt-3 pt-3
                  border-t border-border
                  items-center justify-between
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
                      flex overflow-hidden
                      h-10 w-10
                      rounded-lg border border-border
                      group/bill relative
                    "
                  >
                    <img
                      src={expense.bill_url}
                      alt="Expense bill"
                      className="
                        object-cover
                        h-full w-full
                        transition-transform
                        duration-200 group-hover/bill:scale-110
                      "
                    />

                    <span
                      className="
                        flex
                        text-white
                        bg-black/40
                        opacity-0 transition-opacity
                        absolute inset-0 items-center justify-center group-hover/bill:opacity-100
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
                )}

                {/* Actions */}
                {loader ? (
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
                      onClick={() => onEdit(expense)}
                      variant="outline"
                      buttonType="icon"
                      leftIcon={<Edit2 size={14} strokeWidth={1.8} />}
                      className="
                        px-2 py-2
                      "
                    />

                    <Button
                      onClick={() => onDelete(expense)}
                      variant="outline"
                      buttonType="icon"
                      color="danger"
                      leftIcon={<Trash2 size={14} strokeWidth={1.8} />}
                      className="
                        px-2 py-2
                      "
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
