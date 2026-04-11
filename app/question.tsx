import { BackButton } from "@/components/BackButton";
import { QuestionAnalysisBottomSheet } from "@/components/QuestionAnalysisBottomSheet";
import QuestionCard from "@/components/QuestionCard";
import { useQuestionSession } from "@/hooks/useQuestionSession";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import BottomSheet from "@gorhom/bottom-sheet";

export default function QuestionScreen() {
  const { question, selected, setSelected, confirmAnswer, loading, progress } =
    useQuestionSession();

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const handleConfirm = () => {
    bottomSheetRef.current?.expand();
  };

  const handleNextQuestion = () => {
    bottomSheetRef.current?.close();
    confirmAnswer(() => {});
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
      <View className="flex-1 items-center justify-center">
        <Text>Todas as questões deste tipo foram respondidas neste tópico</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-normal bg-gray-50 p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <BackButton />
      </View>
      <View className="mb-1">
        <Text className="mt-1 text-right text-sm font-medium text-gray-400">
          {progress.current} / {progress.total}
        </Text>
        <View className="h-1.5 overflow-hidden rounded-full bg-gray-300">
          <View
            className="h-1.5 bg-greenGrid"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </View>
      </View>

      <QuestionCard question={question} />
      <View className="mt-6">
        {question.alternatives.map((alt) => {
          const isSelected = selected === alt.label;
          return (
            <TouchableOpacity
              key={alt.label}
              onPress={() => setSelected(alt.label)}
              className={`mb-3 rounded-xl border p-2 ${
                isSelected ? "border-purpleCalm bg-white" : "border-gray-300 bg-white"
              }`}
            >
              <View className="flex-row items-center space-x-3">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isSelected ? "bg-purpleCalm" : "bg-gray-400"
                  }`}
                >
                  <Text className={`font-bold ${isSelected ? "text-white" : "text-gray-700"}`}>
                    {alt.label}
                  </Text>
                </View>
                <Text className="flex-1 items-center justify-center text-black">{alt.text}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={handleConfirm}
        disabled={!selected}
        className={`mb-4 mt-auto rounded-xl p-4 ${selected ? "bg-purpleCalm" : "bg-gray-400"}`}
      >
        <Text className="text-center font-bold text-white">Enviar</Text>
      </TouchableOpacity>
      <QuestionAnalysisBottomSheet
        ref={bottomSheetRef}
        {...({
          questionId: question.id,
          selectedAnswer: selected,
          onNext: handleNextQuestion,
          onFinish: handleNextQuestion,
        } as any)}
      />
    </View>
  );
}
