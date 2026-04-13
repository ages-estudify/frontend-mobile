import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MAIN_TAB_DEFINITIONS } from "@/components/navigation/main-tabs";
import { RoundedTabBarButton } from "@/components/navigation/RoundedTabBarButton";
import { useTabsPlanGateListeners } from "@/components/navigation/use-tabs-plan-gate";
import {
  TAB_BAR_HEIGHT,
  TAB_BAR_HORIZONTAL_INSET,
  TAB_ITEM_VERTICAL_MARGIN,
  tabBarBottomOffset,
} from "@/constants/tabBarLayout";

const TAB_BAR_BORDER_RADIUS = TAB_BAR_HEIGHT / 2;
const TAB_ITEM_ACTIVE_BG = "#EBEBEB";

export default function TabsLayout() {
  const blockedListeners = useTabsPlanGateListeners();
  const insets = useSafeAreaInsets();

  const screenOptions = useMemo(() => {
    const bottomOffset = tabBarBottomOffset(insets.bottom);

    return {
      headerShown: false as const,
      tabBarButton: RoundedTabBarButton,
      tabBarActiveTintColor: "#9500FF",
      tabBarInactiveTintColor: "#000000",
      tabBarActiveBackgroundColor: TAB_ITEM_ACTIVE_BG,
      tabBarInactiveBackgroundColor: "transparent",
      tabBarShowLabel: true,
      tabBarLabelPosition: "below-icon" as const,
      tabBarAllowFontScaling: false,
      tabBarIconStyle: {
        marginBottom: -2,
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: "600" as const,
        textAlign: "center" as const,
        marginTop: 2,
        paddingHorizontal: 1,
        lineHeight: 12,
        flexShrink: 1,
      },
      tabBarItemStyle: {
        flex: 1,
        borderRadius: TAB_BAR_BORDER_RADIUS,
        overflow: "hidden" as const,
        marginHorizontal: 0,
        marginVertical: TAB_ITEM_VERTICAL_MARGIN,
        justifyContent: "center" as const,
        alignItems: "stretch" as const,
      },
      tabBarStyle: {
        position: "absolute" as const,
        left: TAB_BAR_HORIZONTAL_INSET,
        right: TAB_BAR_HORIZONTAL_INSET,
        bottom: bottomOffset,
        height: TAB_BAR_HEIGHT,
        borderRadius: TAB_BAR_BORDER_RADIUS,
        backgroundColor: "#ffffff",
        borderTopWidth: 0,
        paddingHorizontal: 2,
        ...Platform.select({
          ios: {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
          },
          android: {
            elevation: 14,
          },
          default: {},
        }),
      },
    };
  }, [insets.bottom]);

  return (
    <Tabs screenOptions={screenOptions}>
      {MAIN_TAB_DEFINITIONS.map((def) => (
        <Tabs.Screen
          key={def.name}
          name={def.name}
          options={{
            title: def.title,
            tabBarAccessibilityLabel: def.tabBarAccessibilityLabel,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={def.icon} size={Math.min(size + 2, 28)} color={color} />
            ),
          }}
          listeners={def.planGated ? blockedListeners : undefined}
        />
      ))}
    </Tabs>
  );
}
