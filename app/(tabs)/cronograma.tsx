import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CronogramaRoute() {
  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader title="Cronograma" />
        <PlanGuard>
          <TabScreenScrollView>
            <View className="px-4 pt-4">
              <Text>Cronograma</Text>
            </View>
          </TabScreenScrollView>
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
