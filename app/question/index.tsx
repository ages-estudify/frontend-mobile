import { useQuestionSession } from "@/hooks/useQuestionSession";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function QuestionScreen() {
  const { question, selected, setSelected, confirmAnswer, loading, progress } =
    useQuestionSession("1", "ORIGINAL");

  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    confirmAnswer(() => {
      console.log("Navegando para gabarito da questão de ID ", question.id);
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
          <Text className="text-3xl text-black">←</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-12 h-12 rounded-full bg-white shadow-sm items-center justify-center">
          <Text className="text-3xl text-black">▦</Text>
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

      {/* Question Card */}
      <View className="bg-white rounded-2xl p-3 border border-gray-300 mt-4">

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          <View className="border border-gray-400 bg-gray-100 rounded-md px-2 py-1 bg-white">
            <Text className="text-[10px] text-gray-400 font-medium">Questão Estudify</Text>
          </View>
          <View className="border border-green-400 bg-green-100 rounded-md px-2 py-1 bg-white">
            <Text className="text-[10px] text-green-500 font-medium">Matéria</Text>
          </View>
          <View className="border border-blue-400 bg-blue-100 rounded-md px-2 py-1 bg-white">
            <Text className="text-[10px] text-blue-500 font-medium">Submatéria</Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-gray-800 mb-1">
          Questão {question.id}
        </Text>
        <Text className="text-base font-normal text-gray-600 leading-6" numberOfLines={6}>
          {question.text}
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setExpanded(true)}
          className="items-end">
          <Text className="text-3xl text-gray-500 rotate-90">⤢</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={expanded} transparent animationType="fade">
        <View className="flex-1 bg-black/20 justify-center items-center">
          <TouchableOpacity
            className="absolute inset-0 bg-black/50"
            onPress={() => setExpanded(false)}
          />

          {/* Content */}
          <View className="bg-white w-[90%] h-[85%] rounded-xl p-6">

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              className="w-10 h-10 rounded-full bg-purpleCalm items-center justify-center absolute top-6 right-6">
              <Text className="text-lg text-white">X</Text>
            </TouchableOpacity>

            {/* Scroll */}
            <ScrollView className="mt-6"
              showsVerticalScrollIndicator={true}>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Questão {question.id}
              </Text>
              <Text className="text-sm font-normal text-gray-800">
                {question.text}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>


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
