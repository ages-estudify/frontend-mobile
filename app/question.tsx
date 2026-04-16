import { BackButton } from "@/components/BackButton";
import { QuestionAnalysisBottomSheet } from "@/components/QuestionAnalysisBottomSheet";
import QuestionCard from "@/components/QuestionCard";
import { useQuestionSession } from "@/hooks/useQuestionSession";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import QuestionAlternatives from "@/components/QuestionAlternatives";
import QuestionProgress from "@/components/QuestionProgress";
import BottomSheet from "@gorhom/bottom-sheet";

export default function QuestionScreen() {
  const {
    question,
    selected,
    setSelected,
    confirmAnswer,
    nextQuestion,
    feedback,
    loading,
    progress,
  } = useQuestionSession();

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleConfirm = async () => {
    const result = await confirmAnswer();
    if (result) {
      bottomSheetRef.current?.expand();
    }
  };

  const handleNextQuestion = () => {
    bottomSheetRef.current?.close();
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
      <View className="flex-1 justify-normal bg-gray-50 p-4">
        <BackButton />
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-center">
            Todas as questões deste tipo foram respondidas neste tópico
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-normal bg-gray-50 p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <BackButton />
      </View>
      <QuestionProgress progress={progress} />
      <QuestionCard question={question} progress={progress.current + 1} />
      <QuestionAlternatives
        alternatives={question.alternatives}
        selected={selected}
        setSelected={setSelected}
      />
      <TouchableOpacity
        onPress={handleConfirm}
        disabled={!selected}
        className={`mb-4 mt-auto rounded-xl p-4 ${selected ? "bg-purpleCalm" : "bg-gray-400"}`}
      >
        <Text className="text-center font-bold text-white">Enviar</Text>
      </TouchableOpacity>
      <QuestionAnalysisBottomSheet
        ref={bottomSheetRef}
        isCorrect={feedback?.data.isCorrect ?? false}
        comment={feedback?.data.explanation ?? ""}
        correctAlternative={{
          letter: feedback?.data.correctAnswer ?? "",
          text:
            question.alternatives.find((a) => a.label === feedback?.data.correctAnswer)?.text ?? "",
        }}
        markedAlternative={{
          letter: selected ?? "",
          text: question.alternatives.find((a) => a.label === selected)?.text ?? "",
        }}
        onNext={handleNextQuestion}
        onFinish={handleNextQuestion}
      />
    </View>
  );
}
