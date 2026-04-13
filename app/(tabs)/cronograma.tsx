import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CronogramaRoute() {
  return (
    <PlanGuard>
      <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
        <TabScreenScrollView>
          <View className="px-4 pt-4">
            <Text>Cronograma</Text>
          </View>
        </TabScreenScrollView>
      </SafeAreaView>
    </PlanGuard>
  );
}
