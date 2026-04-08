import { Redirect } from "expo-router";
import type { ReactNode } from "react";

import { useAuth } from "@/providers/AuthProvider";

type PlanGuardProps = {
  children: ReactNode;
};

/**
 * Impede renderização de módulos pagos quando o plano está inativo
 * (deep link ou estado restaurado).
 */
export function PlanGuard({ children }: PlanGuardProps) {
  const { session } = useAuth();

  if (!session?.planActive) {
    return <Redirect href="/planos" />;
  }

  return <>{children}</>;
}
