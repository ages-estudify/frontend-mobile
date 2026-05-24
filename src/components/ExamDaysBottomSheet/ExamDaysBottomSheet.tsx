import { TAB_BAR_HEIGHT, tabBarBottomOffset } from "@/constants/tabBarLayout";
import { Exam, ExamDay } from "@/types/exam.types";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  exam: Exam;
  onContinueDay: (examDayId: string) => void;
  onStartDay: (examDayId: string) => void;
  onOpenLanguage: (examDayId: string) => void;
  onClose: () => void;
};

export function ExamDaysBottomSheet({
  exam,
  onContinueDay,
  onStartDay,
  onOpenLanguage,
  onClose,
}: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const bottomInset = tabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 8;

  function handleDayPress(day: ExamDay) {
    if (day.status === "completed") {
      if (!day.attemptDayId) return;
      router.push("/(tabs)/progresso" as const);
      return;
    }

    if (day.status === "in_progress") {
      onContinueDay(day.examDayId);
      return;
    }

    if (day.hasLanguageChoice) {
      onOpenLanguage(day.examDayId);
    } else {
      onStartDay(day.examDayId);
    }

    if (exam.hasLanguageChoice && day.day === 1) {
      onOpenLanguage(day.examDayId);
    } else {
      onStartDay(day.examDayId);
    }
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["45%"]}
      enablePanDownToClose
      onClose={onClose}
      bottomInset={bottomInset}
      detached={true}
      style={{ marginHorizontal: 0 }}
      handleIndicatorStyle={{ backgroundColor: "#D0D0D0", width: 36 }}
      backgroundStyle={{ borderRadius: 20 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} opacity={0.2} appearsOnIndex={0} disappearsOnIndex={-1} />
      )}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 4, gap: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginBottom: 2 }}>
          Escolha o dia da prova
        </Text>
        <Text style={{ fontSize: 13, color: "#888888", lineHeight: 18, marginBottom: 4 }}>
          {exam.description ?? "Simulado inéditas com questões elaboradas pela equipe Estudify"}
        </Text>

        {exam.days.map((day: ExamDay, index) => (
          <Pressable
            key={index}
            onPress={() => handleDayPress(day)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 12,
              borderWidth: 0.5,
              borderColor: "#E0E0E0",
              backgroundColor: pressed ? "#F9F9F9" : "#FFFFFF",
              padding: 16,
            })}
          >
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#1a1a1a" }}>
                Dia {day.day}
              </Text>
              <Text style={{ fontSize: 12, color: "#888888", marginTop: 3 }}>
                {day.totalQuestions} Questões
              </Text>
            </View>

            {day.isCompleted && (
              <View
                style={{
                  backgroundColor: "#DCFCE7",
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#166534" }}>
                  Finalizado
                </Text>
              </View>
            )}

            {day.status === "in_progress" && !day.isCompleted && (
              <View
                style={{
                  backgroundColor: "#FEF9C3",
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#854D0E" }}>
                  Em andamento
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
}
