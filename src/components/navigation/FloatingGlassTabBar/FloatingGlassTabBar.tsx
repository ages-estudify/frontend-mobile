import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { cssInterop } from "nativewind";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabBarBottomOffset } from "@/constants/tabBarLayout";

const StyledBottomTabBar = cssInterop(BottomTabBar, {
  className: "style",
});

const StyledBlurView = cssInterop(BlurView, {
  className: "style",
});

const pillShadow =
  Platform.OS === "ios" ? "shadow-[0_8px_20px_rgba(0,0,0,0.12)]" : "elevation-[12]";

export function GlassTabBarBackground() {
  return (
    <View className="absolute inset-0" pointerEvents="none">
      <StyledBlurView
        intensity={Platform.OS === "ios" ? 85 : 55}
        tint="light"
        className="absolute inset-0"
        experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
        blurReductionFactor={Platform.OS === "android" ? 3 : undefined}
      />
      <View className="bg-white/38 absolute inset-0" pointerEvents="none" />
    </View>
  );
}

export function FloatingGlassTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = tabBarBottomOffset(insets.bottom);

  return (
    <View
      className={`absolute left-[10px] right-[10px] h-[62px] overflow-hidden rounded-full border border-white/75 ${pillShadow}`}
      style={{ bottom }}
    >
      <StyledBottomTabBar
        {...props}
        insets={{ top: 0, right: 0, bottom: 0, left: 0 }}
        className="elevation-0 flex-1 border-t-0 bg-transparent"
      />
    </View>
  );
}
