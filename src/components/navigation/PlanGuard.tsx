import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type PlanGuardProps = {
  children: ReactNode;
};

/**
 * Impede renderização de módulos pagos quando o plano está inativo
 * (deep link ou estado restaurado).
 */
export function PlanGuard({ children }: PlanGuardProps) {
  const { isPlanActive } = useAuth();
  const [planIsActive, setPlanIsActive] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPlan = async () => {
      const isActive = await isPlanActive();
      setPlanIsActive(isActive);
    };
    checkPlan();
  }, [isPlanActive]);

  if (planIsActive === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!planIsActive) {
    return <Redirect href="/paywall" />;
  }

  return <>{children}</>;
}
