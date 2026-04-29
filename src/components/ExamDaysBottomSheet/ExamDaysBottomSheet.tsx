import React, { useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Exam, ExamDay } from "@/types/exam.types";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  exam: Exam;
  onContinueDay: (examDayId: string) => void;
  onStartDay: (examDayId: string) => void;
  onOpenLanguage: (examDayId: string) => void;
  onClose: () => void;
};

export function ExamDaysBottomSheet({ exam, onContinueDay, onStartDay, onOpenLanguage }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  function handleDayPress(day: ExamDay) {
    if (day.status === "completed") {
      if (!day.attemptDayId) return;

      router.push("/progress" as const);
      return;
    }

    if (day.status === "in_progress") {
      onContinueDay(day.examDayId);
      return;
    }

    // available
    if (exam.hasLanguageChoice) {
      onOpenLanguage(day.examDayId);
    } else {
      onStartDay(day.examDayId);
    }
  }

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={["40%"]} enablePanDownToClose onClose={onClose}>
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        {exam.days.map((day) => (
          <Pressable
            key={day.examDayId}
            onPress={() => handleDayPress(day)}
            className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <View>
              <Text className="text-base font-semibold text-gray-800">Dia {day.day}</Text>
              <Text className="text-sm text-gray-600">
                {day.answeredQuestions}/{day.totalQuestions}
              </Text>
            </View>

            {day.isCompleted && (
              <View className="rounded-full bg-green-100 px-3 py-1">
                <Text className="text-xs font-medium text-green-600">Finalizado</Text>
              </View>
            )}
          </Pressable>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
}
