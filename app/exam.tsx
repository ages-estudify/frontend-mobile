import { BackButton } from "@/components/BackButton";
import { FinishExamModal } from "@/components/FinishExamModal";
import QuestionAlternatives from "@/components/QuestionAlternatives";
import QuestionCard from "@/components/QuestionCard";
import { QuestionGridModal } from "@/components/QuestionGridModal";
import QuestionProgress from "@/components/QuestionProgress";
import TimerExam from "@/components/TimerExam";
import { useExam } from "@/hooks/useExam";
import { Alternative } from "@/types/questions.types";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionsGridIcon from "../assets/icons/questions-grid.svg";
import SimpleArrow from "../assets/icons/simple-arrow.svg";

export default function ExamScreen() {
  const router = useRouter();
  const [openGrid, setOpenGrid] = React.useState(false);
  const [showFinishModal, setShowFinishModal] = React.useState(false);
  const [finishLoading, setFinishLoading] = React.useState(false);
  const {
    loading,
    currentAttempt,
    progress,
    currentQuestion,
    selectedAlternative,
    time,
    seconds,
    currentQuestionIndex,
    error,
    setSelectedAlternative,
    nextQuestion,
    prevQuestion,
    submitAnswer,
    goToQuestion,
    finishAttempt,
  } = useExam();

  const submitCurrentAnswer = (currentAlt: Alternative | null) => {
    if (!currentAlt?.letter || !currentAttempt || !currentQuestion) return;

    submitAnswer({
      attemptId: currentAttempt.attempt.id,
      questionId: currentQuestion.id,
      selectedAnswer: selectedAlternative || null,
      timeSpentSeconds: seconds,
    });
  };

  const handlePrevQuestion = () => {
    const currentAlt =
      currentQuestion?.alternatives.find((alt) => alt.letter === selectedAlternative) || null;
    submitCurrentAnswer(currentAlt);
    prevQuestion(currentAlt?.id || null);
  };

  const handleNextQuestion = () => {
    const currentAlt =
      currentQuestion?.alternatives.find((alt) => alt.letter === selectedAlternative) || null;
    submitCurrentAnswer(currentAlt);
    nextQuestion(currentAlt?.id || null);
  };

  const handleGoToQuestion = (index: number) => {
    const currentAlt =
      currentQuestion?.alternatives.find((alt) => alt.letter === selectedAlternative) || null;
    submitCurrentAnswer(currentAlt);
    goToQuestion(index, currentAlt?.id || null);
    setOpenGrid(false);
  };

  const handleBackPress = () => {
    const currentAlt =
      currentQuestion?.alternatives.find((alt) => alt.letter === selectedAlternative) || null;
    submitCurrentAnswer(currentAlt);
  };

  const handleFinishExam = () => {
    setShowFinishModal(true);
  };

  const handleConfirmFinish = async () => {
    if (!currentAttempt) return;

    setFinishLoading(true);
    try {
      const response = await finishAttempt({
        attemptId: currentAttempt.attempt.id,
        timeSpentSeconds: seconds,
      });

      setShowFinishModal(false);

      const attemptDayId = response?.data?.attemptDayId;
      if (attemptDayId) {
        router.replace(`/examFeedback?attemptDayId=${attemptDayId}&type=simulado` as any);
      } else {
        router.replace("/(tabs)/simulado" as any);
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao finalizar simulado");
    } finally {
      setFinishLoading(false);
    }
  };

  const handleCancelFinish = () => {
    setShowFinishModal(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center bg-gray-50 p-4">
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="mb-4 text-center text-lg font-semibold text-red-600">{error}</Text>
        <Pressable onPress={() => router.back()} className="rounded-lg bg-[#3E2B5C] px-6 py-3">
          <Text className="font-semibold text-white">Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const hasPrevQuestion = currentQuestionIndex > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
      <View className="flex-1 p-4">
        <View className="flex flex-row items-center justify-between">
          <BackButton onPress={handleBackPress} />
          <View className="mt-2 flex flex-row items-center gap-2">
            <TimerExam time={time} />
            <Pressable
              onPress={() => setOpenGrid(true)}
              className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white"
            >
              <QuestionsGridIcon width={24} height={21} />
            </Pressable>
          </View>
        </View>
        <QuestionProgress progress={progress} />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {currentQuestion && (
            <>
              <QuestionCard
                question={currentQuestion}
                progress={currentQuestion.number || 1}
                isSimulated={true}
              />
              <QuestionAlternatives
                alternatives={currentQuestion.alternatives}
                selected={selectedAlternative}
                setSelected={setSelectedAlternative}
              />
            </>
          )}
          <View className={`mt-4 flex-row ${hasPrevQuestion ? "justify-between" : "justify-end"}`}>
            {hasPrevQuestion && (
              <Pressable
                onPress={handlePrevQuestion}
                className="flex flex-row items-center gap-1 px-4 py-2"
              >
                <SimpleArrow width={16} height={16} color="#646464" />
                <Text className="text-[#646464]">Anterior</Text>
              </Pressable>
            )}

            <Pressable
              onPress={
                currentAttempt && currentQuestionIndex < currentAttempt.questions.length - 1
                  ? handleNextQuestion
                  : () => {
                      handleNextQuestion();
                      handleFinishExam();
                    }
              }
              className="flex flex-row items-center gap-1 px-4 py-2"
            >
              <Text className="text-[#5E4980]">
                {currentAttempt && currentQuestionIndex < currentAttempt.questions.length - 1
                  ? "Próxima"
                  : "Finalizar"}
              </Text>
              <SimpleArrow
                width={16}
                height={16}
                color="#5E4980"
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </Pressable>
          </View>
        </ScrollView>
        {currentAttempt && (
          <>
            <QuestionGridModal
              visible={openGrid}
              onClose={() => setOpenGrid(false)}
              questions={currentAttempt.questions}
              currentQuestionIndex={currentAttempt.questions.findIndex(
                (q) => q.id === currentQuestion?.id
              )}
              onGoToQuestion={handleGoToQuestion}
              onFinishExam={handleFinishExam}
            />
            <FinishExamModal
              visible={showFinishModal}
              blankAnswers={currentAttempt.questions.filter((q) => !q.selectedAlternativeId).length}
              onConfirm={handleConfirmFinish}
              onCancel={handleCancelFinish}
              loading={finishLoading}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
