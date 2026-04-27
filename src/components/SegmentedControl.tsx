import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

const options = ["Todas", "Corretas", "Incorretas", "Vazias"];

export default function SegmentedControl() {
  const [selected, setSelected] = useState("Resumo");

  return (
    <View className="flex-row rounded-3xl bg-secondaryGray p-1">
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <Pressable
            key={option}
            onPress={() => setSelected(option)}
            className={`flex-1 rounded-2xl px-4 py-2 ${isSelected ? "bg-white" : "bg-transparent"}`}
          >
            <Text
              className={`text-center text-[11px] font-semibold ${
                isSelected ? "text-purple100" : "text-primaryGray"
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
