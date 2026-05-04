/** Valores de role alinhados ao enum Prisma do backend. */
export type UserRole = "USER" | "ADM";

const ADM_ROLE: UserRole = "ADM";

/**
 * Acesso às rotas gated no front: ADM sempre; USER só com planExpirationDate futura (estrita >).
 * Alinhado a SubscriptionGuard (plan_end_date > now).
 */
export function hasGatedContentAccess(
  role: string | null | undefined,
  planExpirationDate: string | null | undefined
): boolean {
  if (role === ADM_ROLE) return true;
  if (planExpirationDate == null || planExpirationDate === "") return false;
  if (Number.isNaN(Date.parse(planExpirationDate))) return false;
  return new Date(planExpirationDate) > new Date();
}

export function normalizeUserRole(stored: string | null | undefined): UserRole {
  if (stored === "ADM") return "ADM";
  return "USER";
}
