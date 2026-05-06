import { ProgressBar } from "@/shared/components/ProgressBar";
import { Exam } from "@/types/exam.types";
import React, { useRef } from "react";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  exam: Exam;
  onPress: () => void;
  onMenuPress: (position: { x: number; y: number }) => void;
  width?: number;
};

export function ExamCard({ exam, onPress, onMenuPress, width = 177 }: Props) {
  const menuButtonRef = useRef<View>(null);
  const originLabel = exam.origin === "ORIGINAL" ? "ENEM" : "UFRGS";
  const isCompleted = exam.progress.percentage >= 100;

  const imageSource = exam.imageUrl
    ? { uri: exam.imageUrl }
    : originLabel === "ENEM"
      ? require("../../../assets/enem 2.png")
      : require("../../../assets/ufrgs_cor 1 1.png");

  const barColor =
    exam.status === "completed"
      ? "#63A941"
      : exam.status === "in_progress" && exam.progress.percentage < 50
        ? "#E05C3A"
        : exam.status === "in_progress" && exam.progress.percentage >= 50
          ? "#E0963A"
          : "#D1D5DB";

  function handleMenuPress() {
    menuButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      onMenuPress({
        x: pageX,
        y: pageY + height + 4,
      });
    });
  }

  return (
    <Pressable
      onPress={onPress}
      style={{ width }}
      className="h-[218px] rounded-xl border border-gray-200 bg-white p-3"
    >
      <View className="flex-row items-start justify-between">
        <Image source={imageSource} className="h-8 w-8" />
        <View ref={menuButtonRef}>
          <Pressable
            onPress={handleMenuPress}
            hitSlop={12}
            className="h-8 w-8 items-center justify-center rounded-full"
          >
            <Text className="text-[22px] font-bold text-gray-600">⋯</Text>
          </Pressable>
        </View>
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
        <ProgressBar percentage={exam.progress.percentage} color={barColor} />

        {isCompleted && (
          <View
            style={{
              marginTop: 6,
              alignSelf: "flex-start",
              backgroundColor: "#DCFCE7",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#166534" }}>Finalizado</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
