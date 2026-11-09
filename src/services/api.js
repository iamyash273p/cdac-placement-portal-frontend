const hostname =
  typeof window !== "undefined" && window.location.hostname
    ? window.location.hostname
    : "localhost";

export const API_BASE =
  import.meta.env.VITE_API_BASE || `http://${hostname}:7500/api`;

export function getSession() {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    if (!token || !userStr) return null;
    const user = JSON.parse(userStr);
    return {
      token,
      user,
      role: role || user.role || "student"
    };
  } catch {
    return null;
  }
}

export function saveSession(token, user, role) {
  const resolvedRole = role || user?.role || "student";
  localStorage.setItem("token", token);
  localStorage.setItem("role", resolvedRole);
  localStorage.setItem("user", JSON.stringify({ ...user, role: resolvedRole }));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}
