import { ExamCard } from "@/components/ExamCard/ExamCard";
import { ExamCardMenu } from "@/components/ExamCardMenu/ExamCardMenu";
import type { MenuAnchorRect } from "@/components/ExamCardMenu/ExamCardMenu";
import { ExamDaysBottomSheet } from "@/components/ExamDaysBottomSheet/ExamDaysBottomSheet";
import { LanguageBottomSheet } from "@/components/LanguageBottomSheet/LanguageBottomSheet";
import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { ProfileAvatarButton } from "@/components/navigation/ProfileAvatarButton";
import { RetryConfirmModal } from "@/components/RetryConfirmModal/RetryConfirmModal";
import { tabBarScrollContentPaddingBottom } from "@/constants/tabBarLayout";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/exam.types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const HORIZONTAL_PADDING = 16;
const GAP = 12;

export default function ExamsScreen() {
  const router = useRouter();
  const { exams, loading, error, retryExam, refresh } = useExams();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cardWidth = Math.floor((width - HORIZONTAL_PADDING * 2 - GAP) / 2);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const selectedExamRef = useRef<Exam | null>(null);

  const [showDaysSheet, setShowDaysSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const [menuExam, setMenuExam] = useState<Exam | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchorRect | undefined>(undefined);
  const [showMenu, setShowMenu] = useState(false);

  const [showRetryModal, setShowRetryModal] = useState(false);
  const [pendingRetryExam, setPendingRetryExam] = useState<Exam | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  function handleOpenExam(exam: Exam) {
    selectedExamRef.current = exam;
    setSelectedExam(exam);
    setShowDaysSheet(true);
  }

  function handleCloseDaysSheet() {
    setShowDaysSheet(false);
    setSelectedExam(null);
  }

  function buildExamUrl(examDayId: string, language?: "ENGLISH" | "SPANISH") {
    const exam = selectedExam ?? selectedExamRef.current;
    if (!exam) return null;
    const dayNumber = exam.days.find((d) => d.examDayId === examDayId)?.day;
    const params = new URLSearchParams({ examId: exam.id, examDayId });
    if (dayNumber !== undefined) params.set("day", String(dayNumber));
    if (language) params.set("language", language);
    return `/exam?${params.toString()}`;
  }

  function handleContinueDay(examDayId: string) {
    const url = buildExamUrl(examDayId);
    if (!url) return;
    handleCloseDaysSheet();
    selectedExamRef.current = null;
    router.navigate(url as any);
  }

  function handleStartDay(examDayId: string) {
    const url = buildExamUrl(examDayId, "ENGLISH");
    if (!url) return;
    handleCloseDaysSheet();
    selectedExamRef.current = null;
    router.navigate(url as any);
  }

  function handleOpenLanguage(examDayId: string) {
    setSelectedDayId(examDayId);
    setShowDaysSheet(false);
    setShowLanguageSheet(true);
  }

  function handleConfirmLanguage(language: "ENGLISH" | "SPANISH") {
    if (!selectedDayId) return;
    const url = buildExamUrl(selectedDayId, language);
    setShowLanguageSheet(false);
    setSelectedDayId(null);
    setSelectedExam(null);
    selectedExamRef.current = null;
    if (url) router.navigate(url as any);
  }

  function handleCancelLanguage() {
    setShowLanguageSheet(false);
    setSelectedDayId(null);
    selectedExamRef.current = null;
  }

  function handleMenuPress(exam: Exam, anchor: MenuAnchorRect) {
    setMenuExam(exam);
    setMenuAnchor(anchor);
    setShowMenu(true);
  }

  function handleHistory() {
    if (!menuExam) return;
    router.push(`/examHistory?examId=${menuExam.id}`);
  }

  function handleRetry() {
    if (!menuExam) return;

    const hasInProgress = menuExam.days.some((d) => d.status === "in_progress");

    if (hasInProgress) {
      setPendingRetryExam(menuExam);
      setShowRetryModal(true);
    } else {
      startRetry(menuExam);
    }
  }

  async function handleConfirmRetry() {
    setShowRetryModal(false);
    if (!pendingRetryExam) return;

    try {
      // await criarNovaTentativa(pendingRetryExam.id); // descomentar quando endpoint existir
      // refresh();                                      // descomentar junto
      retryExam(pendingRetryExam.id); // remover quando descomentar as linhas acima
    } catch (err) {
      console.error("Erro ao criar nova tentativa:", err);
    } finally {
      startRetry(pendingRetryExam);
      setPendingRetryExam(null);
    }
  }

  function startRetry(exam: Exam) {
    retryExam(exam.id);

    const resetted: Exam = {
      ...exam,
      status: "available",
      answeredQuestions: 0,
      progress: {
        answered: 0,
        total: exam.totalQuestions,
        percentage: 0,
      },
      days: exam.days.map((day) => ({
        ...day,
        answeredQuestions: 0,
        status: "available",
        isCompleted: false,
        attemptDayId: undefined,
      })),
    };

    setSelectedExam(resetted);
    setShowDaysSheet(true);
    setShowMenu(false);
  }

  function renderBody() {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center font-inter-medium text-[14px] text-primaryGray">
            {error}
          </Text>
        </View>
      );
    }

    if (exams.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="font-inter-medium text-[14px] text-primaryGray">
            Nenhum simulado disponível
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          paddingBottom: tabBarScrollContentPaddingBottom(insets.bottom),
          gap: GAP,
        }}
        renderItem={({ item }) => (
          <ExamCard
            exam={item}
            width={cardWidth}
            onPress={() => handleOpenExam(item)}
            onMenuPress={(position) => handleMenuPress(item, position)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader title="Simulados" trailing={<ProfileAvatarButton />} />

        <PlanGuard>
          <View className="flex-1 px-4">{renderBody()}</View>

          <ExamCardMenu
            visible={showMenu}
            onClose={() => setShowMenu(false)}
            onHistory={handleHistory}
            onRetry={handleRetry}
            anchorRect={menuAnchor}
          />

          <RetryConfirmModal
            visible={showRetryModal}
            onConfirm={handleConfirmRetry}
            onCancel={() => {
              setShowRetryModal(false);
              setPendingRetryExam(null);
            }}
          />

          {selectedExam && (
            <ExamDaysBottomSheet
              visible={showDaysSheet}
              exam={selectedExam}
              onContinueDay={handleContinueDay}
              onStartDay={handleStartDay}
              onOpenLanguage={handleOpenLanguage}
              onClose={handleCloseDaysSheet}
            />
          )}

          <LanguageBottomSheet
            visible={showLanguageSheet}
            onConfirm={handleConfirmLanguage}
            onCancel={handleCancelLanguage}
          />
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
