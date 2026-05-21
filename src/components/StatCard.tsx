import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconBgColor?: string;
}

const DEFAULT_ICON_BG = "#5E4980";

export function StatCard({ icon, label, value, iconBgColor = DEFAULT_ICON_BG }: StatCardProps) {
  return (
    <View
      testID="stat-card"
      className="flex-1 flex-row items-center rounded-2xl bg-white px-4 py-3"
      style={styles.card}
    >
      <View
        testID="stat-card-icon-circle"
        className="mr-3 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <Text className="font-inter text-[12px] text-primaryGray">{label}</Text>

        <Text className="font-poppins-bold text-[18px] text-black">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
