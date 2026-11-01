"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: { background: "#3b3a2f", color: "#f6f3e6" },
        success: { iconTheme: { primary: "#6fb1e8", secondary: "#3b3a2f" } },
      }}
    />
  );
}