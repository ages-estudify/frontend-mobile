import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressoRoute() {
  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <View className="shrink-0 px-4 pt-4">
          <Text className="font-poppins-semi text-[34px]">Progresso</Text>
        </View>
        <PlanGuard>
          <TabScreenScrollView>
            <View className="px-4 pt-4">
              <Text>Progresso</Text>
            </View>
          </TabScreenScrollView>
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
