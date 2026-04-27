import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  percentage: number;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <View className="h-2 w-full rounded-full bg-gray-200">
      <View
        className="h-full rounded-full bg-green-500"
        style={{ width: `${clampedPercentage}%` }}
      />
    </View>
  );
}
