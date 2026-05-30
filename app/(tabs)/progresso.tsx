import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { SequenceBadgeContainer } from "@/components/SequenceBadgeContainer";
import { StarBadgeContainer } from "@/components/StarBadgeContainer";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressoRoute() {
  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader title="Progresso" />
        <PlanGuard>
          <TabScreenScrollView>
            <View className="items-center px-[16px] pt-[12px]">
              <View className="gap-[10px] self-center rounded-2xl bg-white px-[16px] py-[14px]">
                <Text className="font-inter-semi text-[15px]">Minhas Métricas</Text>
                <StarBadgeContainer variant="progresso" />
                <SequenceBadgeContainer variant="progresso" />
              </View>
            </View>
          </TabScreenScrollView>
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
