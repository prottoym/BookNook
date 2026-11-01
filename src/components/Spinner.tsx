export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-24">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#e0dcc8] border-t-[#2f7fc1]" />
      <p className="font-serif text-[#7a786a]">{label}</p>
    </div>
  );
}