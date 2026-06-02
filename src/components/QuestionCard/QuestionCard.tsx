import { Question } from "@/types/questions.types";
import React, { useState } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import XIcon from "../../../assets/icons/close-white.svg";
import ExpandIcon from "../../../assets/icons/expand.svg";

interface QuestionCardProps {
  question: Question;
  progress: number;
  isSimulated?: boolean;
}

export default function QuestionCard({ question, progress, isSimulated }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const originTag = question.origin === "ORIGINAL" ? "Questão Estudify" : "Questão Vestibular";

  return (
    <>
      <View className="mt-4 rounded-2xl border border-gray-300 bg-white p-3">
        {!isSimulated && (
          <View className="mb-4 flex-row flex-wrap gap-2">
            <View className="rounded-md border border-gray-400 bg-gray-100 px-2 py-1">
              <Text className="text-[10px] font-medium text-gray-400">{originTag}</Text>
            </View>
            <View className="rounded-md border border-green-400 bg-green-100 px-2 py-1">
              <Text className="text-[10px] font-medium text-green-500">{question.subjectName}</Text>
            </View>
            <View className="rounded-md border border-blue-400 bg-blue-100 px-2 py-1">
              <Text className="text-[10px] font-medium text-blue-500">{question.topicName}</Text>
            </View>
          </View>
        )}

        <Text className="mb-1 text-lg font-bold text-gray-800">Questão {progress}</Text>

        <Text className="text-base font-normal leading-6 text-gray-600" numberOfLines={6}>
          {question.text}
        </Text>

        <TouchableOpacity
          testID="botao-expandir"
          activeOpacity={0.6}
          onPress={() => setExpanded(true)}
          className="mt-3 items-end"
        >
          <ExpandIcon width={16} height={16} />
        </TouchableOpacity>
      </View>

      <Modal visible={expanded} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/20">
          <TouchableOpacity
            className="absolute inset-0 bg-black/50"
            onPress={() => setExpanded(false)}
          />

          <View className="h-[85%] w-[90%] rounded-xl bg-white p-6">
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              className="absolute right-6 top-6 h-10 w-10 items-center justify-center rounded-full bg-purpleCalm"
            >
              <XIcon width={16} height={16} color="#fff" />
            </TouchableOpacity>

            <ScrollView className="mt-6" showsVerticalScrollIndicator={true}>
              <Text className="mb-2 text-xl font-bold text-gray-800">Questão {progress}</Text>
              <Text className="text-sm font-normal text-gray-800">{question.text}</Text>
              {question.imageUrl && (
                <Image
                  source={{ uri: question.imageUrl }}
                  className="mt-4 h-48 w-full rounded-lg"
                  resizeMode="contain"
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
