import {
  FloatingGlassTabBar,
  GlassTabBarBackground,
} from "@/components/navigation/FloatingGlassTabBar";
import { MAIN_TAB_DEFINITIONS } from "@/components/navigation/main-tabs";
import { RoundedTabBarButton } from "@/components/navigation/RoundedTabBarButton";
import { TAB_BAR_HEIGHT, TAB_ITEM_VERTICAL_MARGIN } from "@/constants/tabBarLayout";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

const TAB_R = TAB_BAR_HEIGHT / 2;

const tabScreenOptions = {
  headerShown: false as const,
  tabBarButton: RoundedTabBarButton,
  tabBarBackground: () => <GlassTabBarBackground />,
  tabBarActiveTintColor: "#9500FF",
  tabBarInactiveTintColor: "#000000",
  tabBarShowLabel: true,
  tabBarLabelPosition: "below-icon" as const,
  tabBarAllowFontScaling: false,
  tabBarIconStyle: { marginBottom: 2 },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: "600" as const,
    textAlign: "center" as const,
    marginTop: 2,
    lineHeight: 12,
  },
  tabBarItemStyle: {
    flex: 1,
    borderRadius: TAB_R,
    overflow: "hidden" as const,
    marginHorizontal: 3,
    marginVertical: TAB_ITEM_VERTICAL_MARGIN,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    minWidth: 0,
  },
  tabBarStyle: {
    height: TAB_BAR_HEIGHT,
    borderTopWidth: 0,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
    elevation: 0,
  },
};

function getHeaderConfig(pathname: string) {
  if (pathname.includes("cronograma")) {
    return {
      title: "Cronograma",
      subtitle: "Seu plano de estudos personalizado!",
    };
  }

  if (pathname.includes("progresso")) {
    return {
      title: "Meu Progresso",
      subtitle: "Sua evolução nos estudos",
    };
  }

  if (pathname.includes("simulado")) {
    return {
      title: "Simulados",
      subtitle: undefined,
    };
  }

  return {
    title: "Treinar",
    subtitle: undefined,
  };
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingGlassTabBar {...props} />} screenOptions={tabScreenOptions}>
      {MAIN_TAB_DEFINITIONS.map((aux) => (
        <Tabs.Screen
          key={aux.name}
          name={aux.name}
          options={{
            title: aux.title,
            tabBarAccessibilityLabel: aux.tabBarAccessibilityLabel,
            tabBarIcon: ({ focused }) => (
              <Image
                source={aux.tabBarImage}
                style={{ width: 24, height: 24, tintColor: focused ? undefined : "#9CA3AF" }}
                resizeMode="contain"
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
