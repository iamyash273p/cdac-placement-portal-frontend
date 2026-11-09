const hostname = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
export const API_BASE = import.meta.env.VITE_API_BASE || `http://${hostname}:7500/api`;
