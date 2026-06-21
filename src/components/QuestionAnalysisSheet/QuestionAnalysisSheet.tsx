import { TouchableOpacity } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import { AnswerCard } from "../AnswerCard";
import { AnswerStatusBadge } from "../AnswerStatusBadge";

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
            <Text className="text-2xl font-semibold text-greenPrimary">Análise</Text>
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
          <Text className="text-[16px] font-semibold text-greenPrimary">Explicação</Text>
          <Text className="font-regular text-[16px] text-greenPrimary">{comment}</Text>
        </View>

        <View className="items-center gap-[11px]">
          <TouchableOpacity
            onPress={onNext}
            className="w-full items-center rounded-2xl bg-purpleCalm py-[10px]"
          >
            <Text className="text-[16px] font-medium text-white">Próxima Questão</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onFinish}>
            <Text className="text-[16px] font-medium text-primaryGray">Finalizar Treino</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
