import type { ReactNode } from "react";
import React from "react";
import { Text, View } from "react-native";

type GatedTabScreenHeaderProps = {
  title: string;
  /** Linha superior (ex.: avatar); se omitido, mantém o espaço vazio para alinhar com outras abas gated. */
  trailing?: ReactNode;
};

/**
 * Cabeçalho com altura fixa entre abas gated: 8px abaixo da safe area,
 * linha de 40px (avatar) e título colado abaixo, alinhado à esquerda.
 */
export function GatedTabScreenHeader({ title, trailing }: GatedTabScreenHeaderProps) {
  return (
    <View className="w-full shrink-0 px-[16px] pt-[8px]">
      <View className="h-10 flex-row items-center justify-end">{trailing}</View>
      <Text className="self-start font-poppins-semi text-[34px]">{title}</Text>
    </View>
  );
}
