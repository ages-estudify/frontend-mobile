import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type props = {
  correct: number;
  incorrect: number;
  blank: number;
  totalQuestions: number;
};

export default function GraphCard({ correct, incorrect, blank, totalQuestions }: props) {
  const correctPercent = Math.round((correct / totalQuestions) * 100);
  const wrongPercent = Math.round((incorrect / totalQuestions) * 100);
  const blankPercent = Math.round((blank / totalQuestions) * 100);

  const data = [
    {
      value: correct,
      color: "#7ED957",
    },
    {
      value: incorrect,
      color: "#D93B3B",
    },
    {
      value: blank,
      color: "#666666",
    },
  ];

  return (
    <View className="h-full w-full rounded-2xl bg-white">
      <View className="flex-1 flex-row items-center justify-between p-4">
        <View className="items-start justify-center">
          <PieChart
            data={data}
            donut
            radius={55}
            innerRadius={34}
            strokeWidth={5}
            strokeColor="#FFFFFF"
            showText={false}
          />
        </View>

        <View className="gap-2">
          <View className="flex w-[170px] flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <View className="h-4 w-4 rounded-xl bg-[#7ED957]" />
              <Text className="text-[14px] font-medium">Corretas</Text>
            </View>
            <Text className="text-[16px] font-semibold">{correctPercent}%</Text>
          </View>

          <View className="flex w-[170px] flex-row justify-between">
            <View className="flex flex-row items-center gap-4">
              <View className="h-4 w-4 rounded-xl bg-[#D93B3B]" />
              <Text className="text-[14px] font-medium">Incorretas</Text>
            </View>
            <Text className="text-[16px] font-semibold">{wrongPercent}%</Text>
          </View>

          <View className="flex w-[170px] flex-row justify-between">
            <View className="flex flex-row items-start gap-4">
              <View className="h-4 w-4 rounded-xl bg-[#666666]" />
              <Text className="text-[14px] font-medium">Não{"\n"}Respondidas</Text>
            </View>
            <Text className="text-[16px] font-semibold">{blankPercent}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
