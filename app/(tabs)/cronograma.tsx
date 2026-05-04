import { LockedFeature } from "@/components/LockedFeature";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import React from "react";
import { Text, View } from "react-native";

export default function CronogramaRoute() {
  return (
    <PlanGuard fallback={<LockedFeature />}>
      <View className="flex-1 bg-whitebg px-4 pt-4">
        <Text>Cronograma</Text>
      </View>
    </PlanGuard>
  );
}