import QuestionCard from "@/components/QuestionCard";
import { useQuestionSession } from "@/hooks/useQuestionSession";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import BackArrowIcon from "../../assets/icons/back-arrow.svg";

export default function QuestionScreen() {
  const { question, selected, setSelected, confirmAnswer, loading, progress } =
    useQuestionSession("1", "ORIGINAL");

  const router = useRouter();

  const handleConfirm = () => {
    confirmAnswer(() => {
      console.log("Navegando para gabarito da questão de ID: ", question.id);
      //router.push(`/gabarito/${question.id}`)
    })
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Todas as questões foram respondidas</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 p-4 bg-gray-50 justify-normal">

      {/* Top Buttons */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity className="w-12 h-12 rounded-full bg-white shadow-sm items-center justify-center">
          <BackArrowIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar*/}
      <View className="mb-1">
        <Text className="text-right text-sm text-gray-400 font-medium mt-1">
          {progress.current} / {progress.total}
        </Text>
        <View className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
          <View className="h-1.5 bg-greenGrid"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </View>
      </View>

      <QuestionCard question={question} />

      {/* Alternatives */}
      <View className="mt-6">
        {question.alternatives.map((alt) => {
          const isSelected = selected === alt.label;
          return (
            <TouchableOpacity
              key={alt.label}
              onPress={() => setSelected(alt.label)}
              className={`p-2 mb-3 rounded-xl border ${isSelected
                ? "bg-white border-purpleCalm"
                : "bg-white border-gray-300"
                }`}
            >
              <View className="flex-row items-center space-x-3">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? "bg-purpleCalm" : "bg-gray-400"
                    }`}
                >
                  <Text
                    className={`font-bold ${isSelected ? "text-white" : "text-gray-700"}`}
                  >
                    {alt.label}
                  </Text>
                </View>
                <Text className="text-black flex-1 items-center justify-center">
                  {alt.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={handleConfirm}
        disabled={!selected}
        className={`p-4 rounded-xl mt-auto mb-4 ${selected ? "bg-purpleCalm" : "bg-gray-400"
          }`}
      >
        <Text className="text-white text-center font-bold">Enviar</Text>
      </TouchableOpacity>
    </View >
  );
}
