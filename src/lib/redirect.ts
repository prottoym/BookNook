// Only allow redirects to pages inside our own site (stops "?redirect=https://evil.com")
export function safeRedirect(value: string | null, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}