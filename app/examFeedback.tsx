import GraphCard from "@/components/graphCard";
import QuestionFeedbackButton from "@/components/QuestionFeedbackButton";
import SegmentedControl, { SegmentedControlValue } from "@/components/SegmentedControl";
import {
  getAttemptDayResult,
  getExamResultGrid,
} from "@/services/examFeedback/examFeedback.service";
import {
  AttemptDayResultData,
  ExamFeedbackType,
  ResultGridFeedback,
  ResultGridQuestion,
  ResultGridStatus,
} from "@/types/exam-feedback.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GridQuestion = ResultGridQuestion;

function mapStatusToFeedback(status: ResultGridStatus): ResultGridFeedback {
  if (status === "CORRECT") {
    return "Correct";
  }

  if (status === "WRONG") {
    return "Incorrect";
  }

  return "Blank";
}

function getParamValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default function ExamFeedback() {
  const params = useLocalSearchParams<{
    attemptDayId?: string;
    type?: ExamFeedbackType;
  }>();

  const router = useRouter();

  const attemptDayId = getParamValue(params.attemptDayId);
  const feedbackType = getParamValue(params.type) as ExamFeedbackType | undefined;
  const isSimulado = feedbackType === "simulado";

  const [resultData, setResultData] = useState<AttemptDayResultData | null>(null);
  const [questions, setQuestions] = useState<GridQuestion[]>([]);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<SegmentedControlValue>("ALL");

  useEffect(() => {
    if (!attemptDayId) return;

    let isMounted = true;

    const loadAttemptDayResult = async () => {
      setIsLoadingResult(true);

      try {
        const response = await getAttemptDayResult(attemptDayId);

        if (!isMounted) return;

        setResultData(response.data);
      } catch (error) {
        if (!isMounted) return;

        setResultData(null);
      } finally {
        if (isMounted) {
          setIsLoadingResult(false);
        }
      }
    };

    loadAttemptDayResult();

    return () => {
      isMounted = false;
    };
  }, [attemptDayId]);

  useEffect(() => {
    const attemptId = resultData?.attemptId;

    if (!attemptId) return;

    let isMounted = true;

    const loadResultGrid = async () => {
      setIsLoadingGrid(true);

      try {
        const response = await getExamResultGrid(attemptId, selectedStatusFilter);

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
  }, [resultData?.attemptId, selectedStatusFilter]);

  const totalQuestions = resultData?.totalQuestions ?? 0;
  const correctAnswers = resultData?.correctAnswers ?? 0;
  const wrongAnswers = resultData?.wrongAnswers ?? 0;
  const blankAnswers = resultData?.blankAnswers ?? 0;
  const timeSpentMinutes = resultData?.timeSpentMinutes ?? 0;

  const stars = correctAnswers;

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
  let foxImage = require("../assets/celebratingFox.png");

  if (blankAnswers >= totalQuestions / 2) {
    messageTitle = "Você consegue preencher mais!";
    foxImage = require("../assets/sad-fox.png");
  } else if (correctAnswers >= totalQuestions * 0.5 && correctAnswers < totalQuestions * 0.7) {
    messageTitle = "Ótimo resultado!";
    foxImage = require("../assets/celebratingFox.png");
  } else if (correctAnswers >= totalQuestions * 0.7) {
    messageTitle = "Excelente desempenho!";
    foxImage = require("../assets/celebratingFox.png");
  } else if (wrongAnswers > totalQuestions * 0.5) {
    messageTitle = "Continue tentando!";
    foxImage = require("../assets/suport-fox.png");
  }

  return (
    <SafeAreaView className="flex-1 bg-whitebg">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-12">
          <View className="flex-row items-center justify-between pt-8">
            <Text className="text-2xl font-semibold">
              {isSimulado ? "Resultados Simulado" : "Resultados Treino"}
            </Text>

            <Pressable
              onPress={() => router.back()}
              className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#3E2B5C]"
            >
              <X size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <View className="flex items-center justify-center gap-[18px]">
            <Image source={foxImage} />

            {isLoadingResult ? (
              <Text className="text-2xl font-semibold">Carregando resultado...</Text>
            ) : (
              <Text className="text-2xl font-semibold">{messageTitle}</Text>
            )}

            <View className="flex flex-row items-center justify-center gap-4">
              {!isSimulado ? (
                <>
                  <View className="flex items-center justify-center">
                    <View className="flex flex-row items-center justify-center">
                      <Image
                        source={require("../assets/purpleStarCoin.png")}
                        className="h-[19px] w-[19px]"
                      />
                      <Text className="text-purple50">+{stars}</Text>
                    </View>

                    <Text className="text-purple50">Estrelas</Text>
                  </View>

                  <View className="h-8 w-[1px] bg-purple50" />
                </>
              ) : null}

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
