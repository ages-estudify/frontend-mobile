import React, { useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";

export interface TopicStepProps {
  title: string;
  description: string;
  icon?: string;
  stepNumber: number;
  donePercentage: number;
  onPress?: () => void;
}

const textColorMap = {
  green: "text-greenGrid",
  default: "text-purple50",
  red: "text-red100",
};

export function TopicStep({
  title,
  description,
  icon,
  stepNumber,
  donePercentage,
  onPress,
}: TopicStepProps) {
  const displayStepNumber = useMemo(() => {
    if (stepNumber < 10) {
      return `0${stepNumber}`;
    } else {
      return stepNumber;
    }
  }, [stepNumber]);

  const textColor = useMemo(() => {
    if (donePercentage >= 50) {
      return "green";
    } else if (donePercentage > 0) {
      return "red";
    } else {
      return "default";
    }
  }, [donePercentage]);

  const progressText = useMemo(() => {
    if (donePercentage === 0) {
      return "";
    } else if (donePercentage < 100) {
      return `- EM ANDAMENTO · ${donePercentage}%`;
    } else {
      return "";
    }
  }, [donePercentage]);

  return (
    <Pressable className="w-[370px] flex-row items-center gap-[16px]" onPress={onPress}>
      <View className="h-[63px] w-[63px] items-center justify-center rounded-full bg-purple84">
        <Image source={{ uri: icon }} className="h-[32px] w-[32px]" />
      </View>
      <View className="flex-column flex-1 gap-[2px] text-start">
        <Text className={`font-inter-medium ${textColorMap[textColor]} text-[13px]`}>
          Etapa {displayStepNumber} {progressText}
        </Text>
        <Text className="text-primaryGreen font-inter-semi text-[20px]">{title}</Text>
        <Text className="font-inter text-[13px] text-primaryGray">{description}</Text>
      </View>
    </Pressable>
  );
}
