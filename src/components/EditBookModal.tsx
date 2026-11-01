"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { apiFetch } from "@/lib/api";
import { CATEGORIES, type Book } from "@/lib/books";
import { MAX_IMAGE_MB, checkImage, uploadToImgbb } from "@/lib/imgbb";

const inputClass =
  "w-full rounded-md border border-[#cfcab0] bg-white px-4 py-3 text-[15px] text-[#3b3a2f] outline-none transition focus:border-[#2f7fc1] focus:ring-2 focus:ring-[#2f7fc1]/20";
const labelClass = "mb-1.5 block text-sm font-medium text-[#3b3a2f]";

export default function EditBookModal({
  book,
  onClose,
  onSaved,
}: {
  book: Book;
  onClose: () => void;
  onSaved: (updated: Book) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const busy = status !== "idle";

  // copies that are out on loan can't be removed from the total
  const borrowedNow = book.totalCopies - book.availableCopies;
  const minCopies = Math.max(1, borrowedNow);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) {
      setFile(null);
      return;
    }
    const problem = checkImage(picked);
    if (problem) {
      toast.error(problem);
      e.target.value = "";
      return;
    }
    setFile(picked);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {
      title: String(form.get("title") || "").trim(),
      author: String(form.get("author") || "").trim(),
      category: String(form.get("category") || ""),
      description: String(form.get("description") || "").trim(),
      totalCopies: Number(form.get("totalCopies")),
    };

    try {
      // only upload when the user picked a new picture
      if (file) {
        setStatus("uploading");
        payload.image = await uploadToImgbb(file);
      }

      setStatus("saving");
      const result = await apiFetch(`/books/${book._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success("Book updated.");
      onSaved(result.book as Book);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the book.");
      setStatus("idle");
    }
  }

  const shownImage = preview || book.image;

  return (
    <Modal title="Edit book" onClose={() => !busy && onClose()}>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Picture */}
        <div className="flex items-center gap-4">
          {shownImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownImage} alt={book.title} className="h-24 w-20 shrink-0 rounded-md object-cover shadow" />
          ) : (
            <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-md bg-[#e0dcc8] text-xs text-[#7a786a]">
              No image
            </div>
          )}
          <div className="min-w-0">
            <label htmlFor="edit-image" className="cursor-pointer text-sm font-semibold text-[#0b6bcb] hover:underline">
              Change picture
            </label>
            <p className="text-xs text-[#7a786a]">Optional. JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB.</p>
            <input
              id="edit-image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              disabled={busy}
              className="sr-only"
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-title" className={labelClass}>
            Book title
          </label>
          <input id="edit-title" name="title" type="text" required defaultValue={book.title} className={inputClass} />
        </div>

        <div>
          <label htmlFor="edit-author" className={labelClass}>
            Author name
          </label>
          <input id="edit-author" name="author" type="text" required defaultValue={book.author} className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-category" className={labelClass}>
              Category
            </label>
            <select id="edit-category" name="category" required defaultValue={book.category} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-copies" className={labelClass}>
              Total copies
            </label>
            <input
              id="edit-copies"
              name="totalCopies"
              type="number"
              required
              min={minCopies}
              max={100}
              step={1}
              defaultValue={book.totalCopies}
              className={inputClass}
            />
            {borrowedNow > 0 && (
              <p className="mt-1 text-xs text-[#7a786a]">{borrowedNow} on loan right now, so the minimum is {minCopies}.</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="edit-description" className={labelClass}>
            Short description
          </label>
          <textarea
            id="edit-description"
            name="description"
            required
            rows={4}
            maxLength={500}
            defaultValue={book.description}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-md border border-[#cfcab0] px-4 py-3 text-[15px] font-semibold text-[#3b3a2f] hover:bg-[#f6f3e6] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded-md bg-[#0b6bcb] px-4 py-3 text-[15px] font-semibold text-white hover:bg-[#0958a8] disabled:opacity-60"
          >
            {status === "uploading" ? "Uploading image..." : status === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}