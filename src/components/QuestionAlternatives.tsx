import { Alternative } from "@/types/questions.types";
import React, { Text, TouchableOpacity, View } from "react-native";

type Props = {
  alternatives: Alternative[];
  selected: string | null;
  setSelected: (letter: string) => void;
};

export default function QuestionAlternatives({ alternatives, selected, setSelected }: Props) {
  return (
    <View className="mt-6">
      {alternatives.map((alt) => {
        const isSelected = selected === alt.label || selected === alt.letter;
        return (
          <TouchableOpacity
            key={alt.id}
            onPress={() => setSelected(alt.label || alt.letter || "")}
            className={`mb-3 rounded-xl border p-2 ${
              isSelected ? "border-purpleCalm bg-white" : "border-gray-300 bg-white"
            }`}
          >
            <View className="flex-row items-center space-x-3">
              <View
                className={`h-8 w-8 items-center justify-center rounded-full ${
                  isSelected ? "bg-purpleCalm" : "bg-gray-400"
                }`}
              >
                <Text className={`font-bold ${isSelected ? "text-white" : "text-gray-700"}`}>
                  {alt.label || alt.letter}
                </Text>
              </View>
              <Text className="flex-1 items-center justify-center text-black">{alt.text}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
