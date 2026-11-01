import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-[#f6f3e6] px-4 py-14">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#e3dfca] bg-white shadow-lg">
        {/* book-spine top edge */}
        <div className="flex h-2">
          {["#2f7fc1", "#c9a227", "#8b3a3a", "#4f7a5a", "#6b4f8a", "#b5651d"].map((c) => (
            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="px-7 py-9 sm:px-10">
          <h1 className="text-center font-serif text-3xl font-bold text-[#3b3a2f]">{title}</h1>
          <p className="mt-2 text-center text-sm text-[#7a786a]">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}