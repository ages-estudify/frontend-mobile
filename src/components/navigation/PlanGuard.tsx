import { LockedFeature } from "@/components/LockedFeature";
import { useAuth } from "@/hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";

type PlanGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

let cachedPlanActive = false;

export function PlanGuard({ children, fallback }: PlanGuardProps) {
  const { isPlanActive } = useAuth();

  const [planActive, setPlanActive] = useState(cachedPlanActive);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const checkPlan = async () => {
        const active = await isPlanActive();

        if (!mounted) return;

        if (cachedPlanActive !== active) {
          cachedPlanActive = active;
          setPlanActive(active);
        }
      };

      checkPlan();

      return () => {
        mounted = false;
      };
    }, [isPlanActive]),
  );

  if (!planActive) {
    return <>{fallback ?? <LockedFeature />}</>;
  }

  return <>{children}</>;
}