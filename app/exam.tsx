import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { ExamCard } from "@/components/ExamCard/ExamCard";
import { ExamDaysBottomSheet } from "@/components/ExamDaysBottomSheet/ExamDaysBottomSheet";
import { LanguageBottomSheet } from "@/components/LanguageBottomSheet/LanguageBottomSheet";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/exam.types";

export default function ExamsScreen() {
  // 🔹 DATA
  const { exams, loading, error } = useExams();

  // 🔹 UI STATE
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const [showDaysSheet, setShowDaysSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  // =============================
  // HANDLERS
  // =============================

  function handleOpenExam(exam: Exam) {
    setSelectedExam(exam);
    setShowDaysSheet(true);
  }

  function handleCloseDaysSheet() {
    setShowDaysSheet(false);
    setSelectedExam(null);
  }

  function handleContinueDay(examDayId: string) {
    console.log("➡️ Continuar dia:", examDayId);

    // futuramente:
    // router.push(`/exam/${examDayId}`)
    handleCloseDaysSheet();
  }

  function handleStartDay(examDayId: string) {
    console.log("🆕 Iniciar dia:", examDayId);

    // futuramente:
    // criar attempt + navegar
    handleCloseDaysSheet();
  }

  function handleOpenLanguage(examDayId: string) {
    setSelectedDayId(examDayId);
    setShowDaysSheet(false);
    setShowLanguageSheet(true);
  }

  function handleConfirmLanguage(language: "ENGLISH" | "SPANISH") {
    if (!selectedDayId) return;

    console.log("🌍 Iniciar com idioma:", language, "dia:", selectedDayId);

    // futuramente:
    // POST /attempts com language

    setShowLanguageSheet(false);
    setSelectedDayId(null);
    setSelectedExam(null);
  }

  function handleCancelLanguage() {
    setShowLanguageSheet(false);
    setSelectedDayId(null);
  }

  // =============================
  // STATES
  // =============================

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

  // =============================
  // RENDER
  // =============================

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ExamCard
            exam={item}
            onPress={() => handleOpenExam(item)}
            onMenuPress={() => console.log("📊 Menu do simulado finalizado")}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* 🔽 Bottom Sheet - Dias */}
      {showDaysSheet && selectedExam && (
        <ExamDaysBottomSheet
          exam={selectedExam}
          onContinueDay={handleContinueDay}
          onStartDay={handleStartDay}
          onOpenLanguage={handleOpenLanguage}
        />
      )}

      {/* 🔽 Bottom Sheet - Idioma */}
      {showLanguageSheet && (
        <LanguageBottomSheet onConfirm={handleConfirmLanguage} onCancel={handleCancelLanguage} />
      )}
    </View>
  );
}
