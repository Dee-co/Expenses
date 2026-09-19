"use client";
import Button from "@/components/Button";
import CustomSelect from "@/components/CustomSelect";
import FileUploader from "@/components/FileUploader";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Textarea from "@/components/TextArea";
import React, { useEffect, useMemo, useState } from "react";
import { CategoryOptions, Expenses, HandleDetailPayload } from "./types";
import { RotateCcw, Trash2 } from "lucide-react";
interface AddExpenseModalProps {
  openModal: boolean;
  onClose: () => void;
  expenseDetail?: null | Expenses;
  categoryOptions: CategoryOptions[] | null;
  hasSubmit: (detail: HandleDetailPayload) => void;
}
interface FooterProps {
  onClose: () => void;
  editBtnDisable?: boolean;
  expenseDetail?: Expenses | null;
  handleSubmit: () => void;
}
function Footer({
  onClose,
  handleSubmit,
  expenseDetail,
  editBtnDisable = false,
}: FooterProps) {
  return (
    <div
      className="
        flex flex-col-reverse
        w-full
        gap-2
        sm:flex-row sm:justify-center
      "
    >
      <Button
        onClick={onClose}
        variant="outline"
        size="sm"
        color="danger"
        className="
          w-full
          sm:w-auto
        "
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        variant="fill"
        disabled={Boolean(expenseDetail && editBtnDisable)}
        size="sm"
        className="
          w-full
          sm:w-auto
        "
      >
        {expenseDetail ? "Edit Expense" : "Add Expense"}
      </Button>
    </div>
  );
}

export default function ExpenseModal({
  openModal,
  onClose,
  expenseDetail = null,
  categoryOptions,
  hasSubmit,
}: AddExpenseModalProps) {
  const [formState, setFormState] = useState({
    title: "",
    category: "",
    amount: "",
    note: "",
    bill: null as File | null,
  });
  const [initialFormState, setInitialFormState] = useState({
    title: "",
    category: "",
    amount: "",
    note: "",
  });

  const [billRemoved, setBillRemoved] = useState(false);
  const [errorForm, setErrorForm] = useState({
    title: "",
    amount: "",
    category: "",
  });
  const validateForm = (): boolean => {
    let hasError = false;
    if (!formState.title) {
      setErrorForm((prev) => ({
        ...prev,
        title: "Please enter expense title",
      }));
      hasError = true;
    }
    if (!formState.amount) {
      setErrorForm((prev) => ({
        ...prev,
        amount: "Please enter expense amount",
      }));
      hasError = true;
    }
    if (!formState.category) {
      setErrorForm((prev) => ({
        ...prev,
        category: "Please select expense category",
      }));
      hasError = true;
    }
    return hasError;
  };
  const submitDetail = async () => {
    if (validateForm()) return;
    hasSubmit(formState);
  };

  const sortObject = (obj: Record<string, unknown>) => {
    return Object.keys(obj)
      .sort()
      .reduce(
        (result, key) => {
          result[key] = obj[key];
          return result;
        },
        {} as Record<string, unknown>,
      );
  };
  const isFormChanged = useMemo(() => {
    if (!expenseDetail) return true;
    const currentData = {
      title: formState.title,
      category: formState.category,
      amount: formState.amount,
      note: formState.note,
    };
    const initialData = {
      title: initialFormState.title,
      category: initialFormState.category,
      amount: initialFormState.amount,
      note: initialFormState.note,
    };
    const formChanged =
      JSON.stringify(sortObject(currentData)) !==
      JSON.stringify(sortObject(initialData));
    const billChanged = Boolean(formState.bill) || billRemoved;
    return formChanged || billChanged;
  }, [formState, initialFormState, billRemoved, expenseDetail]);
  useEffect(() => {
    if (!openModal) return;
    const initialData = expenseDetail
      ? {
          title: expenseDetail.title || "",
          category: expenseDetail.category?.id || "",
          amount: String(expenseDetail.amount || ""),
          note: expenseDetail.note || "",
        }
      : {
          title: "",
          category: "",
          amount: "",
          note: "",
        };
    setFormState({
      ...initialData,
      bill: null,
    });
    setInitialFormState(initialData);
    setBillRemoved(false);
    setErrorForm({
      title: "",
      amount: "",
      category: "",
    });
  }, [openModal, expenseDetail]);
  return (
    <Modal
      open={openModal}
      onClose={onClose}
      title={expenseDetail ? "Edit Expense" : "Add Expense"}
      subTitle="Expense details"
      persist
      size="lg"
      footer={
        <Footer
          onClose={onClose}
          expenseDetail={expenseDetail || null}
          handleSubmit={submitDetail}
          editBtnDisable={!isFormChanged}
        />
      }
      footerClassName="justify-center"
    >
      <div
        className="
          space-y-5 my-3
        "
      >
        <div>
          <div
            className="
              grid grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >
            <Input
              name="title"
              required
              value={formState.title}
              label="Title"
              error={errorForm.title}
              placeholder="e.g. Grocery shopping"
              maxLength={200}
              onChange={(e) => {
                setErrorForm((prev) => ({ ...prev, title: "" }));
                setFormState((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
            />

            <CustomSelect
              label="Category"
              options={categoryOptions ? categoryOptions : []}
              required
              clearable
              error={errorForm.category}
              value={formState.category}
              placeholder="Select category"
              onChange={(value) => {
                setErrorForm((prev) => ({ ...prev, category: "" }));
                if (typeof value === "string") {
                  setFormState((prev) => ({
                    ...prev,
                    category: value,
                  }));
                }
              }}
            />
            <div>
              <Input
                name="amount"
                required
                amount
                value={formState.amount}
                error={errorForm.amount}
                label="Amount"
                placeholder="e.g. 499.00"
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !isNaN(Number(value))) {
                    setErrorForm((prev) => ({ ...prev, amount: "" }));
                  }
                  setFormState((prev) => ({
                    ...prev,
                    amount: value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <h3
            className="
              mb-3
              text-sm font-semibold text-text
            "
          >
            Additional Information
          </h3>
          <Textarea
            label="Note"
            name="note"
            value={formState.note}
            placeholder="Add a note about this expense..."
            rows={3}
            maxLength={250}
            clearable
            onChange={(e) => {
              setFormState((prev) => ({
                ...prev,
                note: e.target.value,
              }));
            }}
          />
        </div>
        <div>
          <h3
            className="
              mb-3
              text-sm font-semibold text-text
            "
          >
            Bill / Receipt
          </h3>
          {expenseDetail?.bill_url && !billRemoved && (
            <div
              className="
                overflow-hidden
                h-48 w-48
                mb-4
                rounded-xl border border-border
                relative
              "
            >
              <img
                src={expenseDetail.bill_url}
                alt="Expense bill"
                className="
                  object-cover
                  h-full w-full
                "
              />

              {/* Delete Button - Top Right */}
              <button
                type="button"
                onClick={() => {
                  setBillRemoved(true);

                  setFormState((prev) => ({
                    ...prev,
                    bill: null,
                  }));
                }}
                aria-label="Remove bill"
                className="
                  flex
                  h-8 w-8
                  text-white
                  bg-danger
                  rounded-full
                  shadow-md
                  absolute right-2 top-2 items-center justify-center transition hover:opacity-80
                "
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
          {expenseDetail?.bill_url && billRemoved && (
            <Button
              size="sm"
              variant="outline"
              buttonType="icon-text"
              leftIcon={<RotateCcw size={15} />}
              onClick={() => {
                setBillRemoved(false);

                setFormState((prev) => ({
                  ...prev,
                  bill: null,
                }));
              }}
              className="
                mb-4
              "
            >
              Restore Original Bill
            </Button>
          )}
          {(!expenseDetail?.bill_url || billRemoved || formState.bill) && (
            <FileUploader
              label=""
              value={formState.bill}
              onChange={(file) => {
                setFormState((prev) => ({
                  ...prev,
                  bill: file,
                }));
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
