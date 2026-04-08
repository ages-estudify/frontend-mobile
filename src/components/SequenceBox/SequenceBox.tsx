import React from "react";
import { Text, View } from "react-native";

import FireIcon from "../../../assets/icons/fire.svg";
import StarIcon from "../../../assets/icons/star.svg";

export interface SequenceBoxProps {
  title: string;
  value: number;
  description: string;
  variant?: "sequence" | "stars";
}

const backgroundColorMap = {
  sequence: "bg-lightOrange",
  stars: "bg-lightYellow",
};

const borderColorMap = {
  sequence: "border border-[1px] border-orange",
  stars: "border border-[1px] border-yellow",
};

export function SequenceBox({ title, value, description, variant = "sequence" }: SequenceBoxProps) {
  return (
    <View
      className={`w-full ${backgroundColorMap[variant]} ${borderColorMap[variant]} flex-row items-center gap-[18px] rounded-2xl px-[24px] py-[8px]`}
    >
      {variant === "sequence" ? (
        <FireIcon width={32} height={32} />
      ) : (
        <StarIcon width={32} height={32} />
      )}
      <View className="flex-column">
        <Text className="font-inter-semi text-[16px]">
          {title}: {value}
        </Text>
        <Text className="font-inter text-[13px] text-primaryGray">{description}</Text>
      </View>
    </View>
  );
}
