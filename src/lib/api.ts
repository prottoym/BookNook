import { authClient } from "@/lib/auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Calls the Express server and adds the logged in user's JWT.
 * Throws an Error with the server's message, so it can go straight into toast.error().
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const { data } = await authClient.token();

  const headers = new Headers(options.headers);
  if (data?.token) headers.set("Authorization", `Bearer ${data.token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(body.message || "Something went wrong. Please try again.");
  return body;
}