import React from "react";
import { Pressable, Text, View } from "react-native";

export type SegmentedControlValue = "ALL" | "CORRECT" | "WRONG" | "BLANK";

type Option = {
  label: string;
  value: SegmentedControlValue;
};

type Props = {
  selected: SegmentedControlValue;
  onChange: (value: SegmentedControlValue) => void;
};

const options: Option[] = [
  { label: "Todas", value: "ALL" },
  { label: "Corretas", value: "CORRECT" },
  { label: "Incorretas", value: "WRONG" },
  { label: "Vazias", value: "BLANK" },
];

export default function SegmentedControl({ selected, onChange }: Props) {
  return (
    <View className="flex-row rounded-3xl bg-secondaryGray p-1">
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`flex-1 rounded-2xl px-4 py-2 ${isSelected ? "bg-white" : "bg-transparent"}`}
          >
            <Text
              className={`text-center text-[11px] font-semibold ${
                isSelected ? "text-purple100" : "text-primaryGray"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
