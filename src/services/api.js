const hostname =
  typeof window !== "undefined" && window.location.hostname
    ? window.location.hostname
    : "localhost";

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  `http://${hostname}:7500/api`;

export function apiFetch(path, options = {}) {
  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.startsWith("//")
  ) {
    throw new Error("API path must start with a single slash.");
  }

  const headers = new Headers(options.headers);
  const token = localStorage.getItem("token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE.replace(/\/$/, "")}${path}`, {
    ...options,
    headers
  });
}