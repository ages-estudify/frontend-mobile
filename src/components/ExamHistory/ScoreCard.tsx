import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  value: number | undefined;
};

function ScoreCard({ title, value }: Props) {
  return (
    <View className="flex-1 gap-2 rounded-2xl bg-white px-4 py-6">
      <Text className="font-medium text-[#646464]">{title}</Text>
      <Text className="text-[30px] font-bold text-[#3E2B5C]">{value}</Text>
    </View>
  );
}

export default ScoreCard;
