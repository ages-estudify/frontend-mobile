import { useRouter } from "expo-router";
import { useMemo } from "react";

import { useAuth } from "@/providers/AuthProvider";

import { createPlanGateTabListeners } from "./tab-plan-gate";

export function useTabsPlanGateListeners() {
  const router = useRouter();
  const { session } = useAuth();
  const planActive = session?.planActive ?? false;

  return useMemo(
    () =>
      createPlanGateTabListeners(planActive, () => {
        router.push("/planos");
      }),
    [planActive, router]
  );
}
