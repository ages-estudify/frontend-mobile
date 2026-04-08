import type { LoginResponseData, UserSession } from "@/types/auth.types";

export function mapLoginPayloadToSession(data: LoginResponseData): UserSession {
  const planActive =
    data.planActive ??
    (data.planExpirationDate != null &&
      !Number.isNaN(Date.parse(data.planExpirationDate)) &&
      new Date(data.planExpirationDate) > new Date());

  return {
    token: data.token,
    role: data.role,
    planActive: Boolean(planActive),
  };
}
