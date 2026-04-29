import { ProgressBar } from "@/shared/components/ProgressBar";
import { Exam } from "@/types/exam.types";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  exam: Exam;
  onPress: () => void;
  onMenuPress: () => void;
};

export function ExamCard({ exam, onPress, onMenuPress }: Props) {
  const originLabel = exam.origin === "ORIGINAL" ? "ENEM" : "UFRGS";

  const imageSource =
    originLabel === "ENEM"
      ? require("../../../assets/enem 2.png")
      : require("../../../assets/ufrgs_cor 1 1.png");

  return (
    <Pressable
      onPress={onPress}
      className="h-[218px] w-[177px] rounded-xl border border-gray-200 bg-white p-3"
    >
      <View className="flex-row items-start justify-between">
        <Image source={imageSource} className="h-8 w-8" />

        <Pressable
          onPress={onMenuPress}
          hitSlop={12}
          className="h-8 w-8 items-center justify-center rounded-full"
        >
          <Text className="text-[22px] font-bold text-gray-600">⋯</Text>
        </Pressable>
      </View>

      <View className="mt-2">
        <Text className="text-xs font-medium text-gray-500">{originLabel}</Text>

        <Text className="mt-1 text-sm font-semibold text-gray-900">{exam.name}</Text>

        {exam.description && (
          <Text
            className="mt-1 text-[11px] font-medium leading-[15px] text-gray-600"
            numberOfLines={5}
          >
            {exam.description}
          </Text>
        )}
      </View>

      <View className="mt-auto">
        <Text className="mb-1 text-xs text-gray-500">{exam.totalQuestions} questões</Text>

        <ProgressBar percentage={exam.progress.percentage} />
      </View>
    </Pressable>
  );
}
