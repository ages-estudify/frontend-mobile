import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SimuladosRoute() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <PlanGuard>
      <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
        <TabScreenScrollView>
          <View className="px-4 pt-4">
            <Text>Simulado</Text>
            <Button
              title="Feedback"
              onPress={() => {
                router.push({
                  pathname: "/examFeedback",
                  params: {
                    //This is just for testing the feedback while it's not yet integrated into the rest.
                    attemptDayId: "33572023-feed-40d1-8159-7000d4ebed27",
                    type: "simulado",
                  },
                });
              }}
            />
            <Button title="Sair" onPress={() => void logout()} />
          </View>
        </TabScreenScrollView>
      </SafeAreaView>
    </PlanGuard>
  );
}
