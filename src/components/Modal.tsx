"use client";

import { useEffect, type ReactNode } from "react";

// A simple modal: dark backdrop, closes with Escape or a click outside
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // stop the page behind the modal from scrolling
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="w-full max-w-lg rounded-xl bg-white p-7 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-serif text-2xl font-bold text-[#3b3a2f]">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}