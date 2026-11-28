import type { ApiResponse } from "@/types/api";

function getBaseUrl(): string {
  // On the browser, use Same-Origin ("") so Next.js rewrites (/api/* -> Express backend)
  // automatically forward the HttpOnly cookie without cross-domain blocking!
  if (typeof window !== "undefined") {
    return "";
  }

  // On Server Components / SSR, call backend directly
  const envUrl =
    process.env["BACKEND_INTERNAL_URL"] ??
    process.env["NEXT_PUBLIC_API_URL"] ??
    process.env["NEXT_PUBLIC_APP_URL"];
  if (envUrl) {
    return envUrl.replace(/\/+$/, "").replace(/\/api$/, "");
  }
  return "http://localhost:5000";
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: Record<string, string[]>,
  ) {
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
  const baseUrl = getBaseUrl();
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

async function handleResponse<T>(response: Response, requestPath?: string): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  // Intercept 401 Unauthorized session expiry
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const normalizedPath = (requestPath || "").toLowerCase();
      const currentUrl = (response.url || "").toLowerCase();

      // Check both requestPath and response.url against all auth endpoints
      const isAuthRequest =
        normalizedPath.includes("/auth/me") ||
        normalizedPath.includes("/auth/login") ||
        normalizedPath.includes("/auth/register") ||
        normalizedPath.includes("/auth/verify-email") ||
        normalizedPath.includes("/auth/resend-verification") ||
        normalizedPath.includes("/auth/forgot-password") ||
        normalizedPath.includes("/auth/reset-password") ||
        currentUrl.includes("/auth/me") ||
        currentUrl.includes("/auth/login") ||
        currentUrl.includes("/auth/register") ||
        currentUrl.includes("/auth/verify-email") ||
        currentUrl.includes("/auth/resend-verification") ||
        currentUrl.includes("/auth/forgot-password") ||
        currentUrl.includes("/auth/reset-password");

      // Strictly redirect ONLY when on protected dashboard routes:
      // (must start with /member or /admin, and not be /admin/login or public auth pages)
      const isProtectedDashboardRoute =
        (pathname.startsWith("/member") || pathname.startsWith("/admin")) &&
        pathname !== "/admin/login" &&
        !pathname.startsWith("/member/login");

      const isPublicOrAuthPage =
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/verify-email" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/admin/login" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/events") ||
        pathname.startsWith("/directory") ||
        pathname.startsWith("/marketplace") ||
        pathname.startsWith("/forum") ||
        pathname.startsWith("/about") ||
        pathname.startsWith("/contact");

      if (!isAuthRequest && isProtectedDashboardRoute && !isPublicOrAuthPage) {
        const targetLogin = pathname.startsWith("/admin")
          ? "/admin/login"
          : "/login";
        const redirectUrl = `${targetLogin}?expired=true&callbackUrl=${encodeURIComponent(pathname)}`;

        setTimeout(() => {
          if (window.location.pathname !== targetLogin && !window.location.pathname.startsWith("/login")) {
            window.location.href = redirectUrl;
          }
        }, 100);
      }
    }

    if (isJson) {
      const rawError = (await response.json()) as {
        message?: string;
        code?: string;
        error?: {
          code?: string;
          message?: string;
          details?: Record<string, string[]>;
        };
      };
      throw new ApiError(
        rawError.error?.code ?? rawError.code ?? "UNAUTHORIZED",
        rawError.error?.message ??
        rawError.message ??
        "Unauthorized",
        401,
        rawError.error?.details,
      );
    }
    throw new ApiError(
      "UNAUTHORIZED",
      "Unauthorized",
      401,
    );
  }

  if (!response.ok) {
    if (isJson) {
      const rawError = (await response.json()) as {
        message?: string;
        code?: string;
        errors?: Record<string, string[]>;
        error?: {
          code?: string;
          message?: string;
          details?: Record<string, string[]>;
        };
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
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Attach Bearer token from localStorage if present and not already set
  if (typeof window !== "undefined") {
    try {
      const storedToken =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("access_token");
      if (storedToken && !requestHeaders["Authorization"] && !requestHeaders["authorization"]) {
        requestHeaders["Authorization"] = `Bearer ${storedToken}`;
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }

  if (!isFormData) {
    if (!requestHeaders["Content-Type"] && !requestHeaders["content-type"]) {
      requestHeaders["Content-Type"] = "application/json";
    }
  } else {
    delete requestHeaders["Content-Type"];
    delete requestHeaders["content-type"];
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: requestHeaders,
    body: isFormData
      ? (body as BodyInit)
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
    credentials: "include",
    ...rest,
  });

  return handleResponse<T>(response, path);
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