import { ExamCard } from "@/components/ExamCard/ExamCard";
import { ExamCardMenu } from "@/components/ExamCardMenu/ExamCardMenu";
import { ExamDaysBottomSheet } from "@/components/ExamDaysBottomSheet/ExamDaysBottomSheet";
import { LanguageBottomSheet } from "@/components/LanguageBottomSheet/LanguageBottomSheet";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { RetryConfirmModal } from "@/components/RetryConfirmModal/RetryConfirmModal";
import { tabBarScrollContentPaddingBottom } from "@/constants/tabBarLayout";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/exam.types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExamsScreen() {
  const router = useRouter();
  const { exams, loading, error, retryExam, refresh } = useExams();
  const { width } = useWindowDimensions();

  const GAP = 12;
  const PADDING = 19 * 2;
  const cardWidth = Math.floor((width - PADDING - GAP) / 2);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const selectedExamRef = useRef<Exam | null>(null);

  const [showDaysSheet, setShowDaysSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const [menuExam, setMenuExam] = useState<Exam | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const [showRetryModal, setShowRetryModal] = useState(false);
  const [pendingRetryExam, setPendingRetryExam] = useState<Exam | null>(null);

  const insets = useSafeAreaInsets();

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

  function handleMenuPress(exam: Exam, position: { x: number; y: number }) {
    setMenuExam(exam);
    setMenuPosition(position);
    setShowMenu(true);
  }

  function handleHistory() {
    if (!menuExam) return;
    console.log("Ver histórico:", menuExam.id);
    router.push("/(tabs)/progresso");
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

  if (loading)
    return (
      <PlanGuard>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </PlanGuard>
    );
  if (error)
    return (
      <PlanGuard>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>{error}</Text>
        </View>
      </PlanGuard>
    );
  if (exams.length === 0)
    return (
      <PlanGuard>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Nenhum simulado disponível</Text>
        </View>
      </PlanGuard>
    );

  return (
    <PlanGuard>
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <View className="relative">
          <Text className="absolute left-[19px] top-[114px] h-[51px] w-[185px] text-[34px] font-semibold leading-[40px] text-gray-900">
            Simulados
          </Text>
          <Pressable
            className="absolute right-4 top-[114px]"
            onPress={() => router.push("/(tabs)/treinar")}
          >
            <Image source={{ uri: "URL_DO_AVATAR" }} className="h-10 w-10 rounded-full" />
          </Pressable>
        </View>

        <View className="mt-[167px] flex-1 px-[19px]">
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
        </View>

        <ExamCardMenu
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onHistory={handleHistory}
          onRetry={handleRetry}
          anchorPosition={menuPosition}
        />

        <RetryConfirmModal
          visible={showRetryModal}
          onConfirm={handleConfirmRetry}
          onCancel={() => {
            setShowRetryModal(false);
            setPendingRetryExam(null);
          }}
        />

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
    </PlanGuard>
  );
}
