import GraphCard from "@/components/graphCard";
import QuestionFeedbackButton, { Feedback } from "@/components/QuestionFeedbackButton";
import SegmentedControl from "@/components/SegmentedControl";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Image, Text, SafeAreaView, ScrollView } from "react-native";

const questions: { number: number; feedback: Feedback; ghost?: boolean }[] = [
  {
    number: 1,
    feedback: "Correct",
  },
  {
    number: 2,
    feedback: "Incorrect",
  },
  {
    number: 3,
    feedback: "Blank",
  },
  {
    number: 4,
    feedback: "Correct",
  },
  {
    number: 5,
    feedback: "Blank",
  },
  {
    number: 6,
    feedback: "Blank",
  },
  {
    number: 7,
    feedback: "Blank",
  },
  {
    number: 8,
    feedback: "Blank",
  },
  {
    number: 9,
    feedback: "Blank",
  },
  {
    number: 10,
    feedback: "Blank",
  },
];

export default function ExamFeedback() {
  const params = useLocalSearchParams();

  const totalQuestions = Number(params.totalQuestions);
  const correctAnswers = Number(params.correctAnswers);
  const wrongAnswers = Number(params.wrongAnswers);
  const blankAnswers = Number(params.blankAnswers);
  const stars = Number(params.stars);
  const timeSpentMinutes = Number(params.timeSpentMinutes);

  let messageTitle = "";

  const rows = [];

  for (let i = 0; i < questions.length; i += 4) {
    const row = questions.slice(i, i + 4);

    while (row.length < 4) {
      row.push({
        number: 0,
        feedback: "Blank",
        ghost: true,
      });
    }

    rows.push(row);
  }

  const formatMinutesToHHMM = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

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
          <Text className="justify-start pt-8 text-2xl font-semibold">Resultados Simulado</Text>

          <View className="flex items-center justify-center gap-[18px]">
            <Image source={require("../assets/celebratingFox.png")} />
            <Text className="text-2xl font-semibold">{messageTitle}</Text>

            <View className="flex flex-row items-center justify-center gap-4">
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
            <SegmentedControl />

            <View className="gap-5">
              {rows.map((row, index) => (
                <View
                  key={index}
                  className={`flex flex-row ${row.length != 4 ? "justify-start" : "justify-between"}`}
                >
                  {row.map((question, index) => (
                    <QuestionFeedbackButton
                      key={index}
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
