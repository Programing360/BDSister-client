import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  district?: string;
  state?: string;
  country?: string;
  nidOrPassportUrl?: string;
  referralCode?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const authService = {
  register: (
    payload: RegisterPayload
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiClient.post(API_ENDPOINTS.auth.register, payload);
  },

  login: (
    payload: LoginPayload
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiClient.post(API_ENDPOINTS.auth.login, {
      email: payload.email,
      password: payload.password,
    });
  },

  logout: (): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post(API_ENDPOINTS.auth.logout);
  },

  forgotPassword: (
    payload: ForgotPasswordPayload
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post(API_ENDPOINTS.auth.forgotPassword, payload);
  },

  resetPassword: (
    payload: ResetPasswordPayload
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post(API_ENDPOINTS.auth.resetPassword, {
      token: payload.token,
      password: payload.password,
    });
  },

  getCurrentUser: (): Promise<ApiResponse<Record<string, unknown>>> => {
    return apiClient.get(API_ENDPOINTS.auth.me);
  },
};

export default authService;