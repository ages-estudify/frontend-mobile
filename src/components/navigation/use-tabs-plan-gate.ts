import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { createPlanGateTabListeners } from "./tab-plan-gate";

export function useTabsPlanGateListeners() {
  const router = useRouter();
  const { isPlanActive } = useAuth();
  const [planActive, setPlanActive] = useState(true);

  useEffect(() => {
    const checkPlan = async () => {
      const isActive = await isPlanActive();
      setPlanActive(isActive);
    };
    checkPlan();
  }, [isPlanActive]);

  return useMemo(
    () =>
      createPlanGateTabListeners(planActive, () => {
        router.push("/planos");
      }),
    [planActive, router]
  );
}
