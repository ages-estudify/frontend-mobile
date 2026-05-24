import { BackButton } from "@/components/BackButton";
import ExamHistoryCard from "@/components/ExamHistory/ExamHistoryCard";
import ScoreCard from "@/components/ExamHistory/ScoreCard";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { useExamHistory } from "@/hooks/useExamHistory";
import { ExamHistory } from "@/types/exam-history.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ExamHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    examId: string;
  }>();
  const [ExamData, setExamData] = useState<ExamHistory>();
  const { getExamHistory, error, loading } = useExamHistory();

  useEffect(() => {
    if (!params.examId) return;

    const getHistory = async () => {
      try {
        const response = await getExamHistory(params.examId);
        setExamData(response);
      } catch (err: any) {
        console.error("Erro ao buscar histórico:", err);
      }
    };

    getHistory();
  }, [params.examId]);

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

  const sortedHistory = ExamData?.data.history
    ? [...ExamData.data.history].sort((a, b) => {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      })
    : [];

  const groupedHistory = sortedHistory.reduce(
    (acc, curr) => {
      const dateKey = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
        new Date(curr.completedAt)
      );

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(curr);
      return acc;
    },
    {} as Record<string, typeof sortedHistory>
  );

  const sections = Object.entries(groupedHistory);

  return (
    <PlanGuard>
      <View className="flex-1 bg-[#F6F6F6] p-4">
        <View className="relative mb-6 mt-16 flex w-full flex-row items-center justify-center rounded-b-xl">
          <View className="absolute left-0">
            <BackButton />
          </View>
          <Text className="text-2xl font-semibold">Histórico</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex items-center">
            <Text className="text-xl">{ExamData?.data.exam.origin}</Text>
            <Text className="text-xl">{ExamData?.data.exam.name}</Text>
          </View>

          <View className="flex w-full flex-row gap-2 pt-16">
            <ScoreCard title="MÉDIA GERAL" value={ExamData?.data.summary.averageScore} />
            <ScoreCard title="TOTAL TENTATIVAS" value={ExamData?.data.summary.totalCompleted} />
          </View>
          <View className="flex gap-6 pt-16">
            {ExamData && ExamData?.data.history.length > 0 ? (
              sections.map(([date, items]) => (
                <View key={date} className="flex gap-3">
                  <Text className="px-1 text-sm font-medium text-gray-500">{date}</Text>

                  <View className="flex gap-4">
                    {items.map((history) => (
                      <ExamHistoryCard key={history.attemptDayId} examHistory={history} />
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View>
                <Text className="text-center text-gray-500">
                  Nenhuma tentativa concluída para este simulado
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </PlanGuard>
  );
}
