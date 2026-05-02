import type { LoginResponseData, UserSession } from "@/types/auth.types";
import { hasGatedContentAccess, normalizeUserRole } from "@/utils/subscription-access";

export function mapLoginPayloadToSession(data: LoginResponseData): UserSession {
  const planActive =
    data.planActive !== undefined
      ? data.planActive
      : hasGatedContentAccess(data.role, data.planExpirationDate);

  return {
    token: data.token,
    role: normalizeUserRole(data.role),
    planActive: Boolean(planActive),
  };
}
