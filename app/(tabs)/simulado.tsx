import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from "react-native";

import { ExamCard } from "@/components/ExamCard/ExamCard";
import { ExamDaysBottomSheet } from "@/components/ExamDaysBottomSheet/ExamDaysBottomSheet";
import { LanguageBottomSheet } from "@/components/LanguageBottomSheet/LanguageBottomSheet";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/exam.types";

export default function ExamsScreen() {
  const router = useRouter();
  const { exams, loading, error } = useExams();

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const [showDaysSheet, setShowDaysSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  function handleOpenExam(exam: Exam) {
    setSelectedExam(exam);
    setShowDaysSheet(true);
  }

  function handleCloseDaysSheet() {
    setShowDaysSheet(false);
    setSelectedExam(null);
  }

  function handleContinueDay(examDayId: string) {
    console.log("Continuar dia:", examDayId);

    handleCloseDaysSheet();
  }

  function handleStartDay(examDayId: string) {
    console.log("Iniciar dia:", examDayId);

    handleCloseDaysSheet();
  }

  function handleOpenLanguage(examDayId: string) {
    setSelectedDayId(examDayId);
    setShowDaysSheet(false);
    setShowLanguageSheet(true);
  }

  function handleConfirmLanguage(language: "ENGLISH" | "SPANISH") {
    if (!selectedDayId) return;

    console.log("Iniciar com idioma:", language, "dia:", selectedDayId);

    setShowLanguageSheet(false);
    setSelectedDayId(null);
    setSelectedExam(null);
  }

  function handleCancelLanguage() {
    setShowLanguageSheet(false);
    setSelectedDayId(null);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (exams.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Nenhum simulado disponível no momento</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
      <View className="relative">
        <Text className="absolute left-[19px] top-[114px] h-[51px] w-[185px] text-[34px] font-semibold leading-[40px] text-gray-900">
          Simulados
        </Text>

        <Pressable className="absolute right-4 top-[114px]" onPress={() => router.push("/profile")}>
          <Image source={{ uri: "URL_DO_AVATAR" }} className="h-10 w-10 rounded-full" />
        </Pressable>
      </View>

      <View className="mt-[167px] flex-1 px-[19px]">
        <FlatList
          data={exams}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <ExamCard exam={item} onPress={() => handleOpenExam(item)} onMenuPress={() => {}} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {showDaysSheet && selectedExam && (
        <ExamDaysBottomSheet
          exam={selectedExam}
          onContinueDay={handleContinueDay}
          onStartDay={handleStartDay}
          onOpenLanguage={handleOpenLanguage}
          onClose={handleCloseDaysSheet}
        />
      )}

      {showLanguageSheet && (
        <LanguageBottomSheet onConfirm={handleConfirmLanguage} onCancel={handleCancelLanguage} />
      )}
    </View>
  );
}
