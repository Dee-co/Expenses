"use client";

import { useEffect } from "react";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
export default function NotiflixProvider() {
  useEffect(() => {
    Confirm.init({
      width: "400px",
      borderRadius: "16px",
      backgroundColor: "var(--app-surface)",
      titleColor: "var(--app-text)",
      messageColor: "var(--app-text-muted)",
      okButtonBackground: "var(--app-primary)",
      okButtonColor: "#082f49",
      cancelButtonBackground: "var(--app-border)",
      cancelButtonColor: "var(--app-text)",
    });
    Loading.init({
      svgColor: "var(--app-primary)",
      messageColor: "var(--app-text)",
      backgroundColor: "rgba(15, 23, 42, 0.85)",
      clickToClose: false,
      svgSize: "80px",
      messageFontSize: "15px",
      messageMaxLength: 50,
    });
    Notify.init({
      position: "right-top",
      borderRadius: "12px",
      timeout: 3000,
      success: {
        background: "var(--app-primary)",
        textColor: "#082f49",
      },
      failure: {
        background: "var(--app-danger)",
        textColor: "#ffffff",
      },
      warning: {
        background: "var(--app-warning)",
        textColor: "#0f172a",
      },
      info: {
        background: "var(--app-secondary)",
        textColor: "#ffffff",
      },
    });
  }, []);

  return null;
}
