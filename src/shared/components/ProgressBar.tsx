import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  percentage: number;
  color?: string;
}

export function ProgressBar({ percentage, color = "#22C55E" }: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  return (
    <View className="h-2 w-full rounded-full bg-gray-200">
      <View
        className="h-full rounded-full"
        style={{ width: `${clampedPercentage}%`, backgroundColor: color }}
      />
    </View>
  );
}
