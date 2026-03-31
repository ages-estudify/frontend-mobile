import React from "react";
import { View, Text, Pressable } from "react-native";
import { AnswerStatusBadge } from "./AnswerStatusBadge";
import { AnswerCard } from "./AnswerCard";
import { ActionButton } from "./ActionButton";

interface AnalysisProps {
  isCorrect: boolean;
  correctAlternative: {
    letter: string;
    text: string;
  };
  markedAlternative?: {
    letter: string;
    text: string;
  };
  comment: string;
  onNext: () => void;
  onFinish: () => void;
}

export function QuestionAnalysisSheet({
  isCorrect,
  correctAlternative,
  markedAlternative,
  comment,
  onNext,
  onFinish,
}: AnalysisProps) {
  return (
    <View>
      <View className="gap-[41px] pb-5">
        <View className="gap-[24px]">
          <AnswerStatusBadge isCorrect={isCorrect} />

          <View className="gap-[16px]">
            <Text className="text-greenPrimary font-semibold text-2xl">
              Análise
            </Text>
            {isCorrect ? (
              <AnswerCard
                isCorrect={true}
                alternative={{
                  letter: correctAlternative.letter,
                  text: correctAlternative.text,
                }}
              />
            ) : (
              <View className="gap-[8px]">
                <AnswerCard
                  isCorrect={true}
                  alternative={{
                    letter: correctAlternative.letter,
                    text: correctAlternative.text,
                  }}
                />
                <AnswerCard
                  isCorrect={false}
                  alternative={{
                    letter: markedAlternative?.letter ?? "",
                    text: markedAlternative?.text ?? "",
                  }}
                />
              </View>
            )}
          </View>
        </View>

        <View className="gap-[16px]">
          <Text className="text-greenPrimary text-[16px] font-semibold">
            Explicação
          </Text>
          <Text className="text-greenPrimary text-[16px] font-regular">
            {comment}
          </Text>
        </View>

        <View className="gap-[11px] items-center">
          <ActionButton text="Próxima Questão" action={onNext} />
          <Pressable onPress={onFinish} className="">
            <Text className="font-medium text-primaryGray text-[16px]">
              Finalizar Treino
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
