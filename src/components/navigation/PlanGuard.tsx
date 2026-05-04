import { SubscriptionPaywallInline } from "@/components/subscription/SubscriptionPaywallInline";
import { useAuthSession } from "@/contexts/AuthContext";
import { hasGatedContentAccess } from "@/utils/subscription-access";
import { useFocusEffect } from "@react-navigation/native";
import type { ReactNode } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type PlanGuardProps = {
  children: ReactNode;
};

/**
 * Bloqueia o miolo das rotas gated com paywall inline quando o plano está inativo
 * (regra alinhada ao backend + role ADM).
 */
export function PlanGuard({ children }: PlanGuardProps) {
  const { hydrated, role, planExpirationDate } = useAuthSession();
  const [focusTick, setFocusTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusTick((n) => n + 1);
    }, [])
  );

  // `focusTick` não entra no corpo: só invalida o memo ao focar a rota (plano pode expirar na sessão).
  const hasAccess = useMemo(
    () => hasGatedContentAccess(role, planExpirationDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focusTick é gatilho de foco
    [role, planExpirationDate, focusTick]
  );

  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!hasAccess) {
    return (
      <View className="flex-1">
        <SubscriptionPaywallInline />
      </View>
    );
  }

  return <View className="flex-1">{children}</View>;
}
