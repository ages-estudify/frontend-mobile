import React from "react";
import { Text, View } from "react-native";
import Fire from "../../assets/icons/fire.svg";

interface StarBadgeProps {
  sequence: number | null;
  streakActive: boolean | null;
  isLoading: boolean;
  hasError: boolean;
  description?: string;
  errorDescription?: string;
}

export function SequenceBadge({
  sequence,
  streakActive,
  isLoading,
  hasError,
  description,
  errorDescription,
}: StarBadgeProps) {
  const title = `Sequencia de Dias: ${hasError || sequence === null ? "--" : sequence}`;

  const fallbackDescription =
    sequence === 0
      ? "Seu streak está quebrado."
      : streakActive
        ? "Seu streak está ativo."
        : "Seu streak está pendente.";

  const resolvedDescription = hasError
    ? (errorDescription ?? "Não foi possível carregar sua sequência.")
    : (description ?? fallbackDescription);

  return (
    <View className="w-full flex-row items-center rounded-[20px] border border-orangeSequenceCardBorder bg-orangeSequenceCard/50 px-5 py-4">
      <View className="mr-4 items-center justify-center">
        <Fire width={28} height={33} />
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
