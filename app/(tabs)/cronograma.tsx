import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { ProfileAvatarButton } from "@/components/navigation/ProfileAvatarButton";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { ScheduleScreen } from "@/components/schedule/ScheduleScreen";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CronogramaRoute() {
  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader title="Cronograma" trailing={<ProfileAvatarButton />} />
        <PlanGuard>
          <TabScreenScrollView>
            <ScheduleScreen />
          </TabScreenScrollView>
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
