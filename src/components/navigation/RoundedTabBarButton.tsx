import { TAB_ITEM_HIGHLIGHT_RADIUS } from "@/constants/tabBarLayout";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

const ACTIVE_BG = "#EBEBEB";

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
  const isSelected = rest.accessibilityState?.selected === true;

  const pressableStyle: StyleProp<ViewStyle> = {
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

  const innerPillStyle: StyleProp<ViewStyle> = {
    flex: 1,
    width: "100%",
    borderRadius: TAB_ITEM_HIGHLIGHT_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isSelected ? ACTIVE_BG : "transparent",
  };

  return (
    <PlatformPressable
      {...rest}
      android_ripple={{
        ...(typeof androidRipple === "object" && androidRipple !== null ? androidRipple : {}),
        borderless: false,
      }}
      style={[style, pressableStyle]}
    >
      <View pointerEvents="none" style={innerPillStyle}>
        {children}
      </View>
    </PlatformPressable>
  );
}
