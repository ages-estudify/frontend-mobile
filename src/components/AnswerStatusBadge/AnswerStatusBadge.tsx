import React from "react";
import { View, Text } from "react-native";

interface AnswerStatusBadgeProps {
  isCorrect: boolean;
}

export function AnswerStatusBadge({ isCorrect }: AnswerStatusBadgeProps) {
  return (
    <View
      className={`self-start rounded-2xl px-[10px] py-[5px] ${isCorrect ? "bg-green12" : "bg-red12"}`}
    >
      <Text className={isCorrect ? "text-greenGrid" : "text-red100"}>
        {" "}
        {isCorrect ? "RESPOSTA CORRETA" : "RESPOSTA INCORRETA"}{" "}
      </Text>
    </View>
  );
}
