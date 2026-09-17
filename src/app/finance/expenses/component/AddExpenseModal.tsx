"use client";

import Button from "@/components/Button";
import CustomSelect from "@/components/CustomSelect";
import FileUploader from "@/components/FileUploader";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Textarea from "@/components/TextArea";
import React, { useState } from "react";
import { CategoryOptions, HandleDetailPayload } from "./types";
interface AddExpenseModalProps {
  openModal: boolean;
  onClose: () => void;
  categoryOptions: CategoryOptions[] | null;
  hasSubmit: (detail:HandleDetailPayload)=>void
}
interface FooterProps {
  onClose: () => void;
  handleSubmit: () => void;
}
function Footer({ onClose, handleSubmit }: FooterProps) {
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
        size="sm"
        className="
          w-full
          sm:w-auto
        "
      >
        Add Expense
      </Button>
    </div>
  );
}

export default function AddExpenseModal({
  openModal,
  onClose,
  categoryOptions,
  hasSubmit
}: AddExpenseModalProps) {
  const [formState, setFormState] = useState({
    title: "",
    category: "",
    amount: "",
    note: "",
    bill: null as File | null,
  });
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
    hasSubmit(formState)
  };
  return (
    <Modal
      open={openModal}
      onClose={onClose}
      title="Add Expense"
      subTitle="Expense details"
      persist
      size="lg"
      footer={<Footer onClose={onClose} handleSubmit={submitDetail} />}
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
        </div>
      </div>
    </Modal>
  );
}
