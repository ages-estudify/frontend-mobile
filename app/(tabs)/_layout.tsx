import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { MAIN_TAB_DEFINITIONS } from "@/components/navigation/main-tabs";
import { useTabsPlanGateListeners } from "@/components/navigation/use-tabs-plan-gate";

export default function TabsLayout() {
  const blockedListeners = useTabsPlanGateListeners();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      {MAIN_TAB_DEFINITIONS.map((def) => (
        <Tabs.Screen
          key={def.name}
          name={def.name}
          options={{
            title: def.title,
            tabBarAccessibilityLabel: def.tabBarAccessibilityLabel,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={def.icon} size={size} color={color} />
            ),
          }}
          listeners={def.planGated ? blockedListeners : undefined}
        />
      ))}
    </Tabs>
  );
}
