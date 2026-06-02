import { SubscriptionPaywallInline } from "@/components/subscription/SubscriptionPaywallInline";
import { useAuthSession } from "@/contexts/AuthContext";
import { hasGatedContentAccess } from "@/utils/subscription-access";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type PlanGuardProps = {
  children: React.ReactNode;
};

export function PlanGuard({ children }: PlanGuardProps) {
  const { hydrated, role, planExpirationDate } = useAuthSession();
  const [focusTick, setFocusTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusTick((n) => n + 1);
    }, [])
  );

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
