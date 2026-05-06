import { ExamCard } from "@/components/ExamCard/ExamCard";
import { ExamCardMenu } from "@/components/ExamCardMenu/ExamCardMenu";
import { ExamDaysBottomSheet } from "@/components/ExamDaysBottomSheet/ExamDaysBottomSheet";
import { LanguageBottomSheet } from "@/components/LanguageBottomSheet/LanguageBottomSheet";
import { RetryConfirmModal } from "@/components/RetryConfirmModal/RetryConfirmModal";
import { tabBarScrollContentPaddingBottom } from "@/constants/tabBarLayout";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/exam.types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

  const CARD_WIDTH = 177;
  const GAP = 12;
  const PADDING = 19 * 2;

  const canUseTwoColumns = width >= CARD_WIDTH * 2 + GAP + PADDING;

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const [showDaysSheet, setShowDaysSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const [menuExam, setMenuExam] = useState<Exam | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const [showRetryModal, setShowRetryModal] = useState(false);
  const [pendingRetryExam, setPendingRetryExam] = useState<Exam | null>(null);

  const insets = useSafeAreaInsets();

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
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  if (exams.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Nenhum simulado disponível</Text>
      </View>
    );

  return (
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
          key={canUseTwoColumns ? "two-columns" : "one-column"}
          keyExtractor={(item) => item.id}
          numColumns={canUseTwoColumns ? 2 : 1}
          columnWrapperStyle={canUseTwoColumns ? { gap: 12 } : undefined}
          contentContainerStyle={{
            paddingBottom: tabBarScrollContentPaddingBottom(insets.bottom),
            gap: 12,
          }}
          renderItem={({ item }) => (
            <ExamCard
              exam={item}
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
  );
}
