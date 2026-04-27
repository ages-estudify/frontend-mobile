import { ProgressBar } from "@/shared/components/ProgressBar";
import { Exam } from "@/types/exam.types";
import React from "react";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

type Props = {
  exam: Exam;
  onPress: () => void;
  onMenuPress: () => void;
};

export function ExamCard({ exam, onPress, onMenuPress }: Props) {
  const originLabel = exam.origin === "ORIGINAL" ? "ENEM" : "UFRGS";

  const imageSource: ImageSourcePropType =
    originLabel === "ENEM"
      ? require("../../../assets/enem 2.png")
      : require("../../../assets/ufrgs_cor 1 1.png");

  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      <Image source={imageSource} className="h-32 w-full rounded-lg" />

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-500">{originLabel}</Text>

        {exam.status === "completed" && (
          <Pressable onPress={onMenuPress}>
            <Text className="text-xl text-gray-400">⋯</Text>
          </Pressable>
        )}
      </View>

      <Text className="mt-1 text-base font-semibold text-gray-800">{exam.name}</Text>

      <Text className="text-sm text-gray-600">{exam.totalQuestions} questões</Text>

      <ProgressBar percentage={exam.progress.percentage} />
    </Pressable>
  );
}
