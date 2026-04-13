import { TAB_ITEM_HIGHLIGHT_RADIUS } from "@/constants/tabBarLayout";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import React from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * Substitui o botão padrão da tab: o uikit inferior usa `borderRadius: 0` no pressable,
 * o que deixa o fundo ativo quadrado. Estica na largura do slot (cápsula horizontal).
 */
export function RoundedTabBarButton({
  children,
  style,
  android_ripple: androidRipple,
  ...rest
}: BottomTabBarButtonProps) {
  const pillStyle: StyleProp<ViewStyle> = {
    alignSelf: "stretch",
    width: "100%",
    flex: 1,
    borderRadius: TAB_ITEM_HIGHLIGHT_RADIUS,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 1,
  };

  return (
    <PlatformPressable
      {...rest}
      android_ripple={{
        ...(typeof androidRipple === "object" && androidRipple !== null ? androidRipple : {}),
        borderless: false,
      }}
      style={[style, pillStyle]}
    >
      {children}
    </PlatformPressable>
  );
}
