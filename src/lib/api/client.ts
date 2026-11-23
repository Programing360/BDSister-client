import type { ApiResponse } from "@/types/api";

function getBaseUrl(path?: string): string {
  // Better-Auth internal session & Next.js local auth handlers must hit Next.js origin
  if (
    path &&
    (path.startsWith("/api/auth/get-session") ||
      path.startsWith("/api/auth/session") ||
      path.startsWith("/api/auth/sign-in") ||
      path.startsWith("/api/auth/sign-up") ||
      path.startsWith("/api/auth/sign-out"))
  ) {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    const appUrl = process.env["BETTER_AUTH_URL"];
    if (appUrl) {
      return appUrl.replace(/\/+$/, "").replace(/\/api$/, "");
    }
    return "http://localhost:3000";
  }

  // All other endpoints (Express backend: /api/cms/*, /api/users/*, /api/business/*, /api/forum/*, etc.)
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

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(code: string, message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (!params) return path;
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    return queryString ? `${path}?${queryString}` : path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBaseUrl(normalizedPath);
  const url = `${baseUrl}${normalizedPath}`;

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
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("auth_token");
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
        const redirectUrl = `${targetLogin}?expired=true&callbackUrl=${encodeURIComponent(pathname)}`;

        setTimeout(() => {
          if (window.location.pathname !== targetLogin) {
            window.location.href = redirectUrl;
          }
        }, 100);
      }
    }

    if (isJson) {
      const rawError = (await response.json()) as {
        message?: string;
        code?: string;
        error?: { code?: string; message?: string; details?: Record<string, string[]> };
      };
      throw new ApiError(
        rawError.error?.code ?? rawError.code ?? "UNAUTHORIZED",
        rawError.error?.message ??
          rawError.message ??
          "Your session has expired. Please sign in again.",
        401,
        rawError.error?.details,
      );
    }
    throw new ApiError("UNAUTHORIZED", "Your session has expired. Please sign in again.", 401);
  }

  if (!response.ok) {
    if (isJson) {
      const rawError = (await response.json()) as {
        message?: string;
        code?: string;
        errors?: Record<string, string[]>;
        error?: { code?: string; message?: string; details?: Record<string, string[]> };
      };
      throw new ApiError(
        rawError.error?.code ?? rawError.code ?? "HTTP_ERROR",
        rawError.error?.message ?? rawError.message ?? response.statusText,
        response.status,
        rawError.error?.details ?? rawError.errors,
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
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    ...authHeaders,
    ...(headers as Record<string, string>),
  };

  if (!isFormData) {
    if (!requestHeaders["Content-Type"] && !requestHeaders["content-type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }
  } else {
    // When sending FormData, let fetch/browser automatically generate the multipart/form-data boundary
    delete requestHeaders["Content-Type"];
    delete requestHeaders["content-type"];
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: requestHeaders,
    body: isFormData ? (body as BodyInit) : body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
    ...rest,
  });

  return handleResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
};
