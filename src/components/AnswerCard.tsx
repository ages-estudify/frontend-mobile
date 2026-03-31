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
      className={`rounded-2xl w-full px-[16px] py-[16px] gap-[8px] ${isCorrect ? "bg-green12" : "bg-red12"}`}
    >
      <Text
        className={`font-semibold text-[14px] ${isCorrect ? "text-greenGrid" : "text-red100"}`}
      >
        {" "}
        {isCorrect ? "Resosta correta:" : "Você marcou:"}{" "}
      </Text>
      <View className="flex-row gap-[16px] justify-* items-*">
        <Text
          className={`font-bold text-[16px] ${isCorrect ? "text-black" : "text-red100"}`}
        >
          {alternative.letter}
        </Text>
        <Text
          className={`text-[16px] ${isCorrect ? "text-greenPrimary" : "text-red100"}`}
        >
          {alternative.text}
        </Text>
      </View>
    </View>
  );
}
