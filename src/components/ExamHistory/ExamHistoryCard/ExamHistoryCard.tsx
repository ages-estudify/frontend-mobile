import { history } from "@/types/exam-history.types";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  examHistory: history | undefined;
};

function ExamHistoryCard({ examHistory }: Props) {
  const router = useRouter();

  if (!examHistory) return null;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const pad = (num: number) => num.toString().padStart(2, "0");

    return `${hours}:${pad(minutes)}`;
  };

  const calculePercentage = () => {
    return Math.round((examHistory.answeredQuestions / examHistory.totalQuestions) * 100);
  };

  const colorPercentage = () => {
    const percentage = calculePercentage();
    if (percentage >= 70) return "#519B2F";
    if (percentage >= 40) return "#E0963A";
    return "#D43B3B";
  };

  return (
    <Pressable
      onPress={() =>
        router.push(`/examFeedback?attemptDayId=${examHistory.attemptDayId}&type=simulado`)
      }
    >
      <View className="flex flex-row justify-between rounded-xl bg-white p-4">
        <View className="">
          <Text className="text-xl font-semibold">Dia {examHistory.day}</Text>
          <Text style={{ color: "rgba(62, 43, 92, 0.5)" }} className="text-base">
            {examHistory.totalQuestions} questões
          </Text>
        </View>
        <View className="flex flex-row items-center gap-4">
          <View>
            <Text className="text-xl font-semibold">
              {examHistory.correctAnswers}/{examHistory.totalQuestions}
            </Text>
            <Text style={{ color: "rgba(62, 43, 92, 0.5)" }} className="text-base">
              Corretas
            </Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">
              {formatTime(examHistory.timeSpentSeconds)}
            </Text>
            <Text style={{ color: "rgba(62, 43, 92, 0.5)" }} className="text-base">
              Tempo
            </Text>
          </View>
          <View>
            <Text style={{ color: colorPercentage() }} className="text-xl font-semibold">
              {calculePercentage()}%
            </Text>
            <Text style={{ color: "rgba(62, 43, 92, 0.5)" }} className="text-base">
              Realizado
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default ExamHistoryCard;
