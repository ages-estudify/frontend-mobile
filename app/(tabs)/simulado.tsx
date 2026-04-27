import { PlanGuard } from "@/components/navigation/PlanGuard";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SimuladosRoute() {
  const router = useRouter();

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
                    totalQuestions: 10,
                    correctAnswers: 5,
                    wrongAnswers: 3,
                    blankAnswers: 2,
                    stars: 3,
                    timeSpentMinutes: 90,
                  },
                });
              }}
            />
          </View>
        </TabScreenScrollView>
      </SafeAreaView>
    </PlanGuard>
  );
}
