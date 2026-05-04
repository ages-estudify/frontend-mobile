import type { UserRole } from "@/utils/subscription-access";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
}

/** Corpo comum de login/register retornado pela API. */
export type LoginResponseData = {
  token: string;
  refreshToken: string;
  role: string;
  planExpirationDate: string | null;
  /** Só usado em testes / overrides explícitos de mapLoginPayloadToSession. */
  planActive?: boolean;
};

export interface RegisterResponse {
  sucess: boolean;
  data: {
    userId: string;
    token: string;
    refreshToken: string;
    role: string;
    planExpirationDate: string | null;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = {
  success: boolean;
  data: LoginResponseData;
};

/** Sessão persistida após login (JWT + metadados usados na UI). */
export interface UserSession {
  token: string;
  role: UserRole;
  planActive: boolean;
}
