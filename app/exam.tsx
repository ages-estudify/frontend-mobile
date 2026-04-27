import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { ExamCard } from "@/components/ExamCard/ExamCard";
import { ExamDaysBottomSheet } from "@/components/ExamDaysBottomSheet/ExamDaysBottomSheet";
import { LanguageBottomSheet } from "@/components/LanguageBottomSheet/LanguageBottomSheet";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/exam.types";

export default function ExamsScreen() {
  const { exams, loading, error } = useExams();

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showDaysSheet, setShowDaysSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  // ===== ações =====

  function handleOpenExam(exam: Exam) {
    setSelectedExam(exam);
    setShowDaysSheet(true);
  }

  function handleContinueDay(examDayId: string) {
    // continuar tentativa existente
    console.log("Continuar dia:", examDayId);
  }

  function handleStartDay(examDayId: string) {
    // iniciar tentativa sem idioma
    console.log("Iniciar dia:", examDayId);
  }

  function handleOpenLanguage(examDayId: string) {
    setSelectedDayId(examDayId);
    setShowLanguageSheet(true);
  }

  function handleConfirmLanguage(language: "ENGLISH" | "SPANISH") {
    if (!selectedDayId) return;

    console.log("Iniciar com idioma:", language, selectedDayId);

    setShowLanguageSheet(false);
    setSelectedDayId(null);
  }

  // ===== estados =====

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

  // ===== render =====

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ExamCard
            exam={item}
            onPress={() => handleOpenExam(item)}
            onMenuPress={() => console.log("Menu do simulado finalizado")}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Sheet — Dias */}
      {showDaysSheet && selectedExam && (
        <ExamDaysBottomSheet
          exam={selectedExam}
          onContinueDay={handleContinueDay}
          onStartDay={handleStartDay}
          onOpenLanguage={handleOpenLanguage}
        />
      )}

      {/* Bottom Sheet — Idioma */}
      {showLanguageSheet && <LanguageBottomSheet onConfirm={handleConfirmLanguage} />}
    </View>
  );
}
