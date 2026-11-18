import type { ApiResponse } from "@/types/api";

function getBaseUrl(): string {
  const envUrl = process.env["NEXT_PUBLIC_API_URL"] ?? process.env["NEXT_PUBLIC_APP_URL"];
  if (envUrl) {
    // Strip trailing slash and trailing "/api" because all endpoint paths explicitly start with "/api/..."
    return envUrl.replace(/\/+$/, "").replace(/\/api$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

const BASE_URL = getBaseUrl();

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | null | undefined>): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${BASE_URL}${normalizedPath}`;

  if (!params) return url;
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("access_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Ignore storage access errors in restricted contexts
    }
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  // Intercept 401 Unauthorized session expiry
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isAuthPage =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/admin/login" ||
        pathname.startsWith("/auth");

      if (!isAuthPage) {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
        } catch {
          // Ignore
        }

        const targetLogin = pathname.startsWith("/admin") ? "/admin/login" : "/login";
        const redirectUrl = `${targetLogin}?callbackUrl=${encodeURIComponent(pathname)}&error=session_expired`;

        setTimeout(() => {
          if (window.location.pathname !== targetLogin) {
            window.location.href = redirectUrl;
          }
        }, 100);
      }
    }

    if (isJson) {
      const errorData = (await response.json()) as ApiResponse<T>;
      throw new ApiError(
        errorData.error?.code ?? "UNAUTHORIZED",
        errorData.error?.message ?? "Your session has expired. Please sign in again.",
        401,
        errorData.error?.details,
      );
    }
    throw new ApiError("UNAUTHORIZED", "Your session has expired. Please sign in again.", 401);
  }

  if (!response.ok) {
    if (isJson) {
      const errorData = (await response.json()) as ApiResponse<T>;
      throw new ApiError(
        errorData.error?.code ?? "HTTP_ERROR",
        errorData.error?.message ?? response.statusText,
        response.status,
        errorData.error?.details,
      );
    }
    throw new ApiError("HTTP_ERROR", response.statusText, response.status);
  }

  if (!isJson) {
    return { success: true };
  }

  return (await response.json()) as ApiResponse<T>;
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, params, headers = {}, ...rest } = options;
  const authHeaders = getAuthHeaders();

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    ...rest,
  });

  return handleResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options),
};
