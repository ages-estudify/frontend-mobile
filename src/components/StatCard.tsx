import React, { ReactNode } from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View testID="stat-card" className="flex-1 flex-row items-center px-2">
      <View testID="stat-card-icon" className="mr-3 items-center justify-center">
        {icon}
      </View>

      <View className="flex-1">
        <Text className="font-inter text-[12px] text-primaryGray">{label}</Text>

        <Text className="font-poppins-bold text-[18px] text-purpleCalm">{value}</Text>
      </View>
    </View>
  );
}
