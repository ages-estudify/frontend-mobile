import { BackButton } from "@/components/BackButton";
import { QuestionAnalysisBottomSheet } from "@/components/QuestionAnalysisBottomSheet";
import QuestionCard from "@/components/QuestionCard";
import { useQuestionSession } from "@/hooks/useQuestionSession";
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuestionAlternatives from "@/components/QuestionAlternatives";
import QuestionProgress from "@/components/QuestionProgress";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";

export default function QuestionScreen() {
  const router = useRouter();
  const {
    question,
    selected,
    setSelected,
    confirmAnswer,
    nextQuestion,
    feedback,
    loading,
    progress,
    isSubmitting,
    submissionError,
    isLastQuestion,
    answeredQuestionIds,
    sessionCoins,
    latestStreak,
  } = useQuestionSession();

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const navigateToTrainingResult = () => {
    if (answeredQuestionIds.length === 0) return;

    bottomSheetRef.current?.close();
    router.replace({
      pathname: "/trainingResult",
      params: {
        questionIds: JSON.stringify(answeredQuestionIds),
        sessionCoins: String(sessionCoins),
        streakDays: latestStreak ? String(latestStreak.streakDays) : "",
        streakActive: latestStreak ? String(latestStreak.streakActive) : "",
      },
    } as never);
  };

  const handleConfirm = async () => {
    const result = await confirmAnswer();
    if (result) {
      bottomSheetRef.current?.expand();
    }
  };

  const handleNextQuestion = () => {
    bottomSheetRef.current?.close();

    if (isLastQuestion) {
      navigateToTrainingResult();
      return;
    }

    nextQuestion();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!question) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
        <View className="flex-1 justify-normal p-4">
          <BackButton />
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center">
              Todas as questões deste tipo foram respondidas neste tópico
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
      <View className="flex-1 justify-normal p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <BackButton />
        </View>
        <QuestionProgress progress={progress} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <QuestionCard question={question} progress={progress.current + 1} />
          <QuestionAlternatives
            alternatives={question.alternatives}
            selected={selected}
            setSelected={setSelected}
          />
        </ScrollView>

        {submissionError ? (
          <Text className="mb-2 text-center text-sm text-red100">{submissionError}</Text>
        ) : null}

        <View className="pb-4">
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selected || isSubmitting}
            className={`rounded-xl p-4 ${
              selected && !isSubmitting ? "bg-purpleCalm" : "bg-gray-400"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-bold text-white">Enviar</Text>
            )}
          </TouchableOpacity>
        </View>

        <QuestionAnalysisBottomSheet
          ref={bottomSheetRef}
          isCorrect={feedback?.data.isCorrect ?? false}
          comment={feedback?.data.explanation ?? ""}
          correctAlternative={{
            letter: feedback?.data.correctAnswer ?? "",
            text:
              question.alternatives.find((a) => a.label === feedback?.data.correctAnswer)?.text ??
              "",
          }}
          markedAlternative={{
            letter: selected ?? "",
            text: question.alternatives.find((a) => a.label === selected)?.text ?? "",
          }}
          onNext={handleNextQuestion}
          onFinish={navigateToTrainingResult}
        />
      </View>
    </SafeAreaView>
  );
}
