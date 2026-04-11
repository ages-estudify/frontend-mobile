import IntroSlider from "@/components/IntroSlider";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function IntroScreen() {
  const router = useRouter();
  const { completeIntro } = useFirstLaunch();

  const handleFinishIntro = async () => {
    await completeIntro();
    router.replace("/login");
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <IntroSlider onFinish={handleFinishIntro} />
    </View>
  );
}
