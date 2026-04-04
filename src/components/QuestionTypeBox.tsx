import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export interface QuestionTypeBoxProps {
  title: string;
  description: string;
  icon?: string;
}

export function QuestionTypeBox({ title, description, icon }: QuestionTypeBoxProps) {
  return (
    <Pressable
      className={`h-[80px] w-full flex-1 flex-row items-center gap-[26px] rounded-[15px] border border-secondaryGray p-[8px]`}
    >
      <Image
        source={{ uri: icon }}
        className="h-[24px] w-[24px] rounded-full border border-secondaryGray"
      />
      <View className="flex-column flex-1">
        <Text className="font-inter-semi text-[16px]">{title}</Text>
        <Text className="font-inter text-[11px] text-primaryGray">{description}</Text>
      </View>
    </Pressable>
  );
}
