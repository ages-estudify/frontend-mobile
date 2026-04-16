import { BackButton } from "@/components/BackButton";
import QuestionAlternatives from "@/components/QuestionAlternatives";
import QuestionCard from "@/components/QuestionCard";
import QuestionProgress from "@/components/QuestionProgress";
import { useExam } from "@/hooks/useExam";
import React, { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import SimpleArrow from "../assets/icons/simple-arrow.svg";

export default function ExamScreen() {
  const {
    loading,
    currentAttempt,
    progress,
    currentQuestion,
    selectedAlternative,
    setSelectedAlternative,
    nextQuestion,
    prevQuestion,
    pauseAttempt,
  } = useExam();

  const handleAttemptPause = async () => {
    if (currentAttempt) {
      await pauseAttempt({ attemptId: currentAttempt.attempt.id, timeSpentMinutes: 0 });
    }
  };

  const handlePrevQuestion = () => {
    prevQuestion(
      currentQuestion?.alternatives.find((alt) => alt.letter === selectedAlternative)?.id || null
    );
  };

  const handleNextQuestion = () => {
    nextQuestion(
      currentQuestion?.alternatives.find((alt) => alt.letter === selectedAlternative)?.id || null
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center bg-gray-50 p-4">
        <ActivityIndicator />
      </View>
    );
  }
  //backFunction={handleAttemptPause}
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <BackButton />
      <QuestionProgress progress={progress} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {currentQuestion && (
          <>
            <QuestionCard question={currentQuestion} progress={currentQuestion.number || 1} />
            <QuestionAlternatives
              alternatives={currentQuestion.alternatives}
              selected={selectedAlternative}
              setSelected={setSelectedAlternative}
            />
          </>
        )}
        <View className="mt-4 flex-row justify-between">
          {currentQuestion && currentQuestion.number && currentQuestion.number > 1 && (
            <Pressable
              onPress={handlePrevQuestion}
              className="flex flex-row items-center gap-1 px-4 py-2"
            >
              <SimpleArrow width={16} height={16} color="#646464" />
              <Text className="text-[#646464]">Anterior</Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleNextQuestion}
            className="flex flex-row items-center gap-1 px-4 py-2"
          >
            <Text className="text-[#5E4980]">Próxima</Text>
            <SimpleArrow width={16} height={16} color="#5E4980" className="rotate-180" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
