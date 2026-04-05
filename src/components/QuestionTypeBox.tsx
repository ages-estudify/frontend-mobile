import React from "react";
import { Pressable, Text, View } from "react-native";
import OriginalQuestionsIcon from "../../assets/icons/original.questions.svg";
import SimplifiedQuestionsIcon from "../../assets/icons/simplified_questions.svg";

export interface QuestionTypeBoxProps {
  title: string;
  description: string;
  variant?: "original" | "simplified";
  onPress?: () => void;
}

export function QuestionTypeBox({
  title,
  description,
  variant = "original",
  onPress,
}: QuestionTypeBoxProps) {
  return (
    <Pressable
      className="h-[80px] w-full flex-row items-center gap-[26px] rounded-[15px] border border-secondaryGray p-[8px]"
      onPress={onPress}
    >
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full border border-secondaryGray">
        {variant === "original" ? (
          <OriginalQuestionsIcon width={28} height={28} />
        ) : (
          <SimplifiedQuestionsIcon width={28} height={28} />
        )}
      </View>
      <View className="flex-column flex-1">
        <Text className="font-inter-semi text-[16px]">{title}</Text>
        <Text className="font-inter text-[11px] text-primaryGray">{description}</Text>
      </View>
    </Pressable>
  );
}
