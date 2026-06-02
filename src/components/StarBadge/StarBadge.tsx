import React from "react";
import { Image, Text, View } from "react-native";

const starCoin = require("../../../assets/starCoin.png");

interface StarBadgeProps {
  stars: number | null;
  isLoading: boolean;
  hasError: boolean;
  description?: string;
  errorDescription?: string;
}

export function StarBadge({
  stars,
  isLoading,
  hasError,
  description,
  errorDescription,
}: StarBadgeProps) {
  const title = `Estrelas: ${hasError || stars === null ? "--" : stars}`;

  const resolvedDescription = hasError
    ? (errorDescription ?? "Não foi possível carregar suas estrelas.")
    : (description ?? "Representa o número total de questões que você já respondeu.");

  return (
    <View className="w-full flex-row items-center rounded-[20px] border border-yellowStarCardBorder bg-yellowStarCard/50 px-5 py-4">
      <View className="mr-4 items-center justify-center">
        <Image source={starCoin} style={{ width: 34, height: 34 }} resizeMode="contain" />
      </View>

      <View className="flex-1">
        {isLoading ? (
          <>
            <View
              testID="star-badge-title-skeleton"
              className="mb-2 h-5 w-28 rounded bg-neutral-300"
            />
            <View
              testID="star-badge-description-skeleton"
              className="h-4 w-52 rounded bg-neutral-200"
            />
          </>
        ) : (
          <>
            <Text className="font-inter-semi text-[16px] text-black">{title}</Text>

            <Text className="font-inter text-[13px] text-primaryGray">{resolvedDescription}</Text>
          </>
        )}
      </View>
    </View>
  );
}
