import React from "react";
import { View, Text } from "react-native";

interface AnswerCardProps {
  isCorrect: boolean;
  alternative: {
    letter: string;
    text: string;
  };
}

export function AnswerCard({ isCorrect, alternative }: AnswerCardProps) {
  return (
    <View
      className={`w-full gap-[8px] rounded-2xl px-[16px] py-[16px] ${isCorrect ? "bg-green12" : "bg-red12"}`}
    >
      <Text className={`text-[14px] font-semibold ${isCorrect ? "text-greenGrid" : "text-red100"}`}>
        {" "}
        {isCorrect ? "Resosta correta:" : "Você marcou:"}{" "}
      </Text>
      <View className="justify-* items-* flex-row gap-[16px]">
        <Text className={`text-[16px] font-bold ${isCorrect ? "text-black" : "text-red100"}`}>
          {alternative.letter}
        </Text>
        <Text className={`text-[16px] ${isCorrect ? "text-greenPrimary" : "text-red100"}`}>
          {alternative.text}
        </Text>
      </View>
    </View>
  );
}
