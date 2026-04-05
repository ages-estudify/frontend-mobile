import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Question } from "@/types/Question"; 

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
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
            <ScrollView className="mt-6" showsVerticalScrollIndicator={true}>
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
    </>
  );
}