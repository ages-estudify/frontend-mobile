import GraphCard from "@/components/graphCard";
import QuestionFeedbackButton from "@/components/QuestionFeedbackButton";
import SegmentedControl, { SegmentedControlValue } from "@/components/SegmentedControl";
import { getExamResultGrid } from "@/services/examFeedback/examFeedback.service";
import {
  ResultGridFeedback,
  ResultGridQuestion,
  ResultGridStatus,
} from "@/types/exam-feedback.types";
import { useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

type GridQuestion = ResultGridQuestion;

function toNumber(value: string | string[] | undefined): number {
  if (Array.isArray(value)) {
    return Number(value[0] ?? 0);
  }

  return Number(value ?? 0);
}

function mapStatusToFeedback(status: ResultGridStatus): ResultGridFeedback {
  if (status === "CORRECT") {
    return "Correct";
  }

  if (status === "WRONG") {
    return "Incorrect";
  }

  return "Blank";
}

export default function ExamFeedback() {
  const params = useLocalSearchParams<{
    totalQuestions?: string;
    correctAnswers?: string;
    wrongAnswers?: string;
    blankAnswers?: string;
    stars?: string;
    timeSpentMinutes?: string;
    attemptId?: string;
  }>();

  const [questions, setQuestions] = useState<GridQuestion[]>([]);
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<SegmentedControlValue>("ALL");

  const totalQuestions = toNumber(params.totalQuestions);
  const correctAnswers = toNumber(params.correctAnswers);
  const wrongAnswers = toNumber(params.wrongAnswers);
  const blankAnswers = toNumber(params.blankAnswers);
  const stars = toNumber(params.stars);
  const timeSpentMinutes = toNumber(params.timeSpentMinutes);
  const attemptId = Array.isArray(params.attemptId) ? params.attemptId[0] : params.attemptId;

  useEffect(() => {
    if (!attemptId) return;

    let isMounted = true;

    const statusFilter = selectedStatusFilter === "ALL" ? undefined : selectedStatusFilter;

    const loadResultGrid = async () => {
      setIsLoadingGrid(true);

      try {
        const response = await getExamResultGrid(attemptId, statusFilter);

        if (!isMounted) return;

        const gridQuestions: GridQuestion[] = (response.data.grid ?? []).map((item) => ({
          questionId: item.questionId,
          number: item.number,
          feedback: mapStatusToFeedback(item.status),
        }));

        setQuestions(gridQuestions);
      } catch (error) {
        if (!isMounted) return;

        setQuestions([]);
      } finally {
        if (isMounted) {
          setIsLoadingGrid(false);
        }
      }
    };

    loadResultGrid();

    return () => {
      isMounted = false;
    };
  }, [attemptId, selectedStatusFilter]);

  const rows = useMemo(() => {
    const gridRows: GridQuestion[][] = [];

    for (let i = 0; i < questions.length; i += 4) {
      const row: GridQuestion[] = questions.slice(i, i + 4);

      while (row.length < 4) {
        row.push({
          number: 0,
          feedback: "Blank",
          ghost: true,
        });
      }

      gridRows.push(row);
    }

    return gridRows;
  }, [questions]);

  const formatMinutesToHHMM = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  let messageTitle = "";

  if (blankAnswers >= totalQuestions / 2) {
    messageTitle = "Próxima meta: menos questões em branco";
  } else if (correctAnswers >= totalQuestions * 0.5 && correctAnswers < totalQuestions * 0.7) {
    messageTitle = "Ótimo resultado!";
  } else if (correctAnswers >= totalQuestions * 0.7) {
    messageTitle = "Excelente desempenho!";
  } else if (wrongAnswers > totalQuestions * 0.5) {
    messageTitle = "Continue tentando!";
  }

  return (
    <SafeAreaView className="flex-1 bg-whitebg">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-12">
          <View className="flex flex-row items-center justify-between">
            <Text className="justify-start pt-8 text-2xl font-semibold">Resultados Simulado</Text>

            <Pressable onPress={() => console.log("fechar")}>
              <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#3E2B5C]">
                <X size={24} color="#FFFFFF" />
              </View>
            </Pressable>
          </View>

          <View className="flex items-center justify-center gap-[18px]">
            <Image source={require("../assets/celebratingFox.png")} />
            <Text className="text-2xl font-semibold">{messageTitle}</Text>

            <View className="flex flex-row items-center justify-center gap-4">
              {/* <View className="flex items-center justify-center">
                <View className="flex flex-row items-center justify-center">
                  <Image
                    source={require("../assets/purpleStarCoin.png")}
                    className="h-[19px] w-[19px]"
                  />
                  <Text className="text-purple50">+{stars}</Text>
                </View>

                <Text className="text-purple50">Estrelas</Text>
              </View> */}

              {/* <View className="h-8 w-[1px] bg-purple50" /> */}

              <View className="flex items-center justify-center">
                <Text className="text-purple50">{formatMinutesToHHMM(timeSpentMinutes)}</Text>
                <Text className="text-purple50">Horas Totais</Text>
              </View>
            </View>
          </View>

          <View className="h-[143px]">
            <GraphCard
              totalQuestions={totalQuestions}
              correct={correctAnswers}
              incorrect={wrongAnswers}
              blank={blankAnswers}
            />
          </View>

          <View className="gap-4">
            <Text className="text-[16px] font-semibold">Gabarito Detalhado</Text>
            <SegmentedControl selected={selectedStatusFilter} onChange={setSelectedStatusFilter} />
            <View className="gap-5">
              {isLoadingGrid ? (
                <Text className="text-primaryGray">Carregando gabarito...</Text>
              ) : null}

              {rows.map((row, index) => (
                <View key={index} className="flex flex-row justify-between">
                  {row.map((question, questionIndex) => (
                    <QuestionFeedbackButton
                      key={question.questionId ?? `${index}-${questionIndex}-${question.number}`}
                      number={question.number}
                      feedback={question.feedback}
                      ghost={question.ghost}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
