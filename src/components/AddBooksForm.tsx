"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/books";
import { MAX_IMAGE_MB, checkImage, uploadToImgbb } from "@/lib/imgbb";

const inputClass =
  "w-full rounded-md border border-[#cfcab0] bg-white px-4 py-3 text-[15px] text-[#3b3a2f] outline-none transition focus:border-[#2f7fc1] focus:ring-2 focus:ring-[#2f7fc1]/20";
const readOnlyClass = `${inputClass} cursor-not-allowed bg-[#f6f3e6] text-[#7a786a]`;
const labelClass = "mb-1.5 block text-sm font-medium text-[#3b3a2f]";

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");

  // small preview of the chosen picture
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

    if (!user) {
      toast.error("Please log in first.");
      return;
    }
    if (!file) {
      toast.error("Please choose a book image.");
      return;
    }

    const payload = {
      title: String(form.get("title") || "").trim(),
      author: String(form.get("author") || "").trim(),
      category: String(form.get("category") || ""),
      description: String(form.get("description") || "").trim(),
      totalCopies: Number(form.get("totalCopies")),
    };

    try {
      setStatus("uploading");
      const image = await uploadToImgbb(file);

      setStatus("saving");
      // The server saves the date added and takes your name and email from your login
      await apiFetch("/books", {
        method: "POST",
        body: JSON.stringify({ ...payload, image }),
      });

      toast.success("Book added! Thank you for sharing.");
      router.push("/my-books");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the book.");
      setStatus("idle");
    }
  }

  const busy = status !== "idle";

  return (
    <section className="bg-[#f6f3e6] px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            Share your shelf
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">Add a Book</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-[#e3dfca] bg-white p-6 shadow-sm sm:p-10"
        >
          {/* Image upload */}
          <div>
            <span className={labelClass}>Book image</span>
            <label
              htmlFor="image"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#cfcab0] bg-[#faf8f0] p-6 text-center transition hover:border-[#2f7fc1]"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Chosen book cover" className="h-56 w-auto rounded-md object-cover shadow-md" />
              ) : (
                <span className="text-sm text-[#7a786a]">
                  Click to choose a cover picture
                  <br />
                  <span className="text-xs">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB</span>
                </span>
              )}
              {preview && <span className="text-sm font-medium text-[#0b6bcb]">Click to change the picture</span>}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              disabled={busy}
              className="sr-only"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className={labelClass}>
                Book title
              </label>
              <input id="title" name="title" type="text" required placeholder="e.g. The Great Gatsby" className={inputClass} />
            </div>
            <div>
              <label htmlFor="author" className={labelClass}>
                Author name
              </label>
              <input id="author" name="author" type="text" required placeholder="e.g. F. Scott Fitzgerald" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={labelClass}>
                Category
              </label>
              <select id="category" name="category" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Choose a category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="totalCopies" className={labelClass}>
                Total copies
              </label>
              <input
                id="totalCopies"
                name="totalCopies"
                type="number"
                required
                min={1}
                max={100}
                step={1}
                defaultValue={1}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Short description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={500}
              placeholder="What is this book about? (up to 500 characters)"
              className={inputClass}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="userName" className={labelClass}>
                Your name
              </label>
              <input id="userName" value={user?.name ?? ""} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label htmlFor="userEmail" className={labelClass}>
                Your email
              </label>
              <input id="userEmail" value={user?.email ?? ""} readOnly className={readOnlyClass} />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy || !user}
            className="w-full rounded-md bg-[#0b6bcb] px-6 py-3.5 text-base font-semibold text-white shadow transition hover:bg-[#0958a8] disabled:opacity-60"
          >
            {status === "uploading" ? "Uploading image..." : status === "saving" ? "Adding book..." : "Add Book"}
          </button>
        </form>
      </div>
    </section>
  );
}