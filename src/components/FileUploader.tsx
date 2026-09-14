"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { FileText, Image as ImageIcon, UploadCloud, X } from "lucide-react";

interface FileUploaderProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  className?: string;
}

export default function FileUploader({
  value = null,
  onChange,
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  },
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  error,
  label = "Upload Bill",
  helperText = "PNG, JPG or WEBP • Max 5MB",
  className = "",
}: FileUploaderProps) {
  const [rejectionError, setRejectionError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejectionError("");

      if (fileRejections.length > 0) {
        const message =
          fileRejections[0].errors[0]?.message || "Invalid file";

        setRejectionError(message);
        return;
      }

      const file = acceptedFiles[0];

      if (file) {
        onChange(file);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  const removeFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onChange(null);
    setRejectionError("");
  };

  const displayError = error || rejectionError;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={`
          relative
          flex
          min-h-40
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-xl
          border-2
          border-dashed
          px-5
          py-6
          text-center
          transition
          
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : displayError
                ? "border-danger bg-danger/5"
                : "border-border bg-background hover:border-primary hover:bg-primary/5"
          }

          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="w-full">
            <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {value.type.startsWith("image/") ? (
                  <ImageIcon size={22} />
                ) : (
                  <FileText size={22} />
                )}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-text">
                  {value.name}
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-text-muted
                  transition
                  hover:bg-danger/10
                  hover:text-danger
                "
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-xs text-text-muted">
              Click to replace the file
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud size={24} />
            </div>

            <p className="text-sm font-medium text-text">
              {isDragActive
                ? "Drop your bill here"
                : "Drag & drop your bill here"}
            </p>

            <p className="mt-1 text-sm text-text-muted">
              or{" "}
              <span className="font-medium text-primary">
                browse files
              </span>
            </p>

            <p className="mt-3 text-xs text-text-muted">
              {helperText}
            </p>
          </>
        )}
      </div>

      {displayError && (
        <p className="mt-1.5 text-sm text-danger">
          {displayError}
        </p>
      )}
    </div>
  );
}