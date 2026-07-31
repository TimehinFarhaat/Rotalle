import axios from "axios";

// Set VITE_API_URL in your .env — falls back to local dev API.
const baseURL = import.meta.env.VITE_API_URL ?? "https://localhost:44333/api";

export const apiClient = axios.create({ baseURL });

const TOKEN_KEY = "rotalle_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // Hard redirect keeps this simple — router isn't reachable from here.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Normalizes ASP.NET's ProblemDetails / ModelState error shapes into a
// single readable string for toasts and form-level errors. Also guards
// against the raw dev-exception page (HTML or a giant plain-text stack
// trace) ever reaching the UI verbatim — those get swapped for a generic
// message instead, with the real detail still logged to the console for
// debugging.
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Check your connection and try again.";
    }

    const status = error.response.status;
 
    const contentType = String(
  error.response.headers?.["content-type"] ?? ""
);
    const data = error.response.data;

    const looksLikeRawDump =
      contentType.includes("text/html") ||
      (typeof data === "string" && (data.length > 300 || data.includes("Exception")));

    if (looksLikeRawDump) {
      console.error(`API error ${status}:`, data);

     
      if (typeof data === "string") {
        const match = data.match(/System\.\w*Exception: (.+?)(?:\r?\n|$)/);
        if (match?.[1]) return match[1].trim();
      }

      if (status >= 500) return "Something went wrong on our end. Please try again.";
      return "That request couldn't be completed. Please try again.";
    }

    if (typeof data === "string") return data;
    if (data?.title) return data.title;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (Array.isArray(first)) return first[0] as string;
    }
    if (data?.message) return data.message;

    if (status === 401) return "Please log in again.";
    if (status === 403) return "You don't have permission to do that.";
    if (status === 404) return "That couldn't be found.";
    if (status >= 500) return "Something went wrong on our end. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
