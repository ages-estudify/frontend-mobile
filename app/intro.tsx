import React from "react";
import { View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";
import IntroSlider from "@/components/IntroSlider";

export default function IntroScreen() {
  const router = useRouter();
  const { completeIntro } = useFirstLaunch();

  const handleFinishIntro = async () => {
    await completeIntro();
    // router.replace('/login');
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <IntroSlider onFinish={handleFinishIntro} />
    </View>
  );
}
