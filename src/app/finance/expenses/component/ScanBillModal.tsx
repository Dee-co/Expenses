"use client";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import React, { useEffect, useRef, useState } from "react";
import { ScanBillProps } from "./types";
import Webcam from "react-webcam";
import {
  ArrowLeft,
  Camera,
  Check,
  FileImage,
  ImagePlus,
  RotateCcw,
  ScanLine,
  SwitchCamera,
  Upload,
  X,
} from "lucide-react";
type CameraMode = "user" | "environment";
export default function ScanBillModal({
  openModal,
  onClose,
  onManualAdd,
  onScanBill,
}: ScanBillProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [cameraMode, setCameraMode] = useState<CameraMode>("environment");

  const resetState = () => {
    setCameraStarted(false);
    setCapturedImage(null);
    setSelectedFile(null);
    setCameraError(false);
    setIsDragging(false);
    setCameraMode("environment");
  };

  const backToOptions = () => {
    setCameraStarted(false);
    setCapturedImage(null);
    setSelectedFile(null);
    setCameraError(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setCapturedImage(imageUrl);
    setCameraStarted(false);
    setCameraError(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  const startCamera = () => {
    setCameraError(false);
    setCameraStarted(true);
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) return;

    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const file = new File([blob], `captured-bill-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    setSelectedFile(file);
    setCapturedImage(imageSrc);
    setCameraStarted(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setSelectedFile(null);
    setCameraError(false);
    setCameraStarted(true);
  };

  const switchCamera = () => {
    setCameraError(false);

    setCameraMode((previousMode) =>
      previousMode === "user" ? "environment" : "user",
    );
  };

  const handleUsePhoto = () => {
    if (!selectedFile) return;
    onScanBill(selectedFile);
  };
  const handleManualAdd = () => {
    resetState();
    onManualAdd();
  };
  const handleClose = () => {
    resetState();
    onClose();
  };
  useEffect(() => {
    resetState();
  }, [openModal]);
  return (
    <Modal
      title={cameraStarted ? "Take Photo" : "Add Receipt"}
      subTitle={
        cameraStarted
          ? "Capture a clear image of your bill"
          : "Take a photo or upload your bill"
      }
      persist
      open={openModal}
      onClose={handleClose}
    >
      <div
        className="
          flex flex-col
          w-full
          gap-5
          my-5
        "
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="
            hidden
          "
        />
        {cameraStarted && !capturedImage && (
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={backToOptions}
              className="
                px-3!
              "
            >
              Back to options
            </Button>
          </div>
        )}
        {capturedImage ? (
          <div
            className="
              space-y-4
            "
          >
            <div
              className="
                overflow-hidden
                bg-slate-950
                rounded-2xl border border-border
                relative
              "
            >
              <div
                className="
                  flex
                  min-h-70
                  relative items-center justify-center
                "
              >
                <img
                  src={capturedImage}
                  alt="Selected bill"
                  className="
                    object-contain
                    max-h-[min(55dvh,480px)] min-h-70 w-full
                  "
                />

                <div
                  className="
                    flex
                    px-3 py-1.5
                    text-xs font-medium text-white
                    bg-emerald-500/90
                    rounded-full
                    shadow-lg
                    absolute left-3 top-3 items-center gap-2
                  "
                >
                  <Check size={14} />
                  Image ready
                </div>
              </div>
            </div>
            <div
              className="
                grid grid-cols-2
                gap-3
              "
            >
              <Button
                type="button"
                variant="outline"
                onClick={retakePhoto}
                leftIcon={<RotateCcw size={17} />}
                className="
                  w-full
                "
              >
                Retake
              </Button>

              <Button
                type="button"
                variant="fill"
                onClick={handleUsePhoto}
                disabled={!selectedFile}
                leftIcon={<Check size={17} />}
                className="
                  w-full
                "
              >
                Use Photo
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={backToOptions}
              leftIcon={<ArrowLeft size={16} />}
              className="
                w-full
              "
            >
              Choose another option
            </Button>
          </div>
        ) : cameraStarted ? (
          /* Camera View */
          <div
            className="
              space-y-4
            "
          >
            <div
              className="
                overflow-hidden
                bg-slate-950
                rounded-2xl border border-border
                relative
              "
            >
              {cameraError ? (
                <div
                  className="
                    flex flex-col
                    min-h-70
                    px-5 py-8
                    text-center
                    items-center justify-center gap-3
                  "
                >
                  <Camera
                    size={30}
                    className="
                      text-danger
                    "
                  />

                  <p
                    className="
                      text-sm font-medium text-text
                    "
                  >
                    Camera access unavailable
                  </p>

                  <p
                    className="
                      text-xs text-text-muted
                    "
                  >
                    Please upload your bill from gallery.
                  </p>

                  <Button
                    type="button"
                    variant="fill"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload size={16} />}
                  >
                    Upload Image
                  </Button>
                </div>
              ) : (
                <div
                  className="
                    overflow-hidden
                    h-[min(50dvh,400px)] min-h-70 w-full
                    bg-slate-950
                    relative
                  "
                >
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.92}
                    videoConstraints={{
                      facingMode: cameraMode,
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                    }}
                    onUserMediaError={() => setCameraError(true)}
                    className="
                      object-cover
                      h-full w-full
                    "
                  />
                  <div
                    className="
                      flex
                      px-5
                      pointer-events-none
                      absolute inset-0 items-center justify-center
                    "
                  >
                    <div
                      className="
                        h-[58%] w-full max-w-md
                        rounded-xl border-2 border-dashed border-cyan-300/90
                        shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]
                        relative
                      "
                    >
                      <span
                        className="
                          whitespace-nowrap text-[10px] text-cyan-200
                          absolute -top-6 left-1/2 -translate-x-1/2
                          sm:text-xs
                        "
                      >
                        Align bill inside the frame
                      </span>
                    </div>
                  </div>
                  <div
                    className="
                      absolute right-3 top-3
                    "
                  >
                    <button
                      type="button"
                      onClick={switchCamera}
                      aria-label="Switch camera"
                      className="
                        flex
                        h-11 w-11
                        text-white
                        bg-black/60
                        rounded-full border border-white/20
                        items-center justify-center backdrop-blur-md transition hover:bg-black/80
                      "
                    >
                      <SwitchCamera size={19} />
                    </button>
                  </div>
                  <div
                    className="
                      px-3 py-1.5
                      text-xs text-white
                      bg-black/60
                      rounded-full
                      absolute bottom-3 left-3 backdrop-blur-md
                    "
                  >
                    Camera active
                  </div>
                  <div
                    className="
                      absolute bottom-4 left-1/2 -translate-x-1/2
                    "
                  >
                    <button
                      type="button"
                      onClick={capturePhoto}
                      aria-label="Capture photo"
                      className="
                        flex
                        h-19 w-19
                        bg-white/20
                        rounded-full border-4 border-white/90
                        shadow-xl
                        items-center justify-center backdrop-blur-md transition hover:scale-105 active:scale-95
                      "
                    >
                      <span
                        className="
                          h-14.5 w-14.5
                          bg-white
                          rounded-full
                        "
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Capture Alternative */}
            {!cameraError && (
              <p
                className="
                  text-center text-xs text-text-muted
                "
              >
                Position your bill inside the frame and tap the capture button.
              </p>
            )}
          </div>
        ) : (
          <div
            className="
              space-y-4
            "
          >
            <div
              className="
                grid grid-cols-2
                gap-3
              "
            >
              <button
                type="button"
                onClick={startCamera}
                className="
                  flex flex-col
                  min-h-38.75
                  p-5
                  text-text
                  bg-surface
                  rounded-2xl border border-border
                  items-center justify-center gap-3 transition hover:border-primary hover:bg-primary/10
                "
              >
                <span
                  className="
                    p-4
                    text-primary
                    bg-primary/15
                    rounded-full
                  "
                >
                  <Camera size={28} />
                </span>

                <span
                  className="
                    text-sm font-semibold
                  "
                >
                  Take Photo
                </span>

                <span
                  className="
                    text-center text-xs text-text-muted
                  "
                >
                  Use camera
                </span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  flex flex-col
                  min-h-38.75
                  p-5
                  text-text
                  bg-surface
                  rounded-2xl border border-border
                  items-center justify-center gap-3 transition hover:border-primary hover:bg-primary/10
                "
              >
                <span
                  className="
                    p-4
                    text-secondary
                    bg-secondary/15
                    rounded-full
                  "
                >
                  <ImagePlus size={28} />
                </span>

                <span
                  className="
                    text-sm font-semibold
                  "
                >
                  Gallery
                </span>

                <span
                  className="
                    text-center text-xs text-text-muted
                  "
                >
                  Choose image
                </span>
              </button>
            </div>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                flex flex-col
                min-h-37.5
                p-6
                text-center
                rounded-2xl border-2 border-dashed
                cursor-pointer
                items-center justify-center gap-2 transition
                ${
                isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-surface hover:border-primary"
                }
              `}
            >
              <span
                className="
                  p-3
                  text-primary
                  bg-primary/10
                  rounded-full
                "
              >
                <Upload size={24} />
              </span>

              <p
                className="
                  text-sm font-semibold text-text
                "
              >
                Drag & drop your bill
              </p>

              <p
                className="
                  text-xs text-text-muted
                "
              >
                or click to browse files
              </p>

              <p
                className="
                  text-[11px] text-text-muted
                "
              >
                JPG, PNG or other image formats
              </p>
            </div>
          </div>
        )}
        <div
          className="
            flex
            p-4
            bg-surface
            rounded-xl border border-border
            items-start gap-3
          "
        >
          <ScanLine
            size={18}
            className="
              mt-0.5
              text-primary
              shrink-0
            "
          />

          <div>
            <p
              className="
                text-sm font-medium text-text
              "
            >
              Upload or scan your receipt
            </p>

            <p
              className="
                mt-1
                text-xs leading-relaxed text-text-muted
              "
            >
              Use a clear and well-lit image for better AI extraction.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          className="
            grid grid-cols-2
            pt-4
            border-t border-border
            gap-3
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleManualAdd}
            leftIcon={<FileImage size={17} />}
            className="
              w-full
            "
          >
            Manual Add
          </Button>

          <Button
            type="button"
            variant="outline"
            color="danger"
            onClick={handleClose}
            leftIcon={<X size={17} />}
            className="
              w-full
            "
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
