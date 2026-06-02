import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { progressColors } from "@/constants/progressColors";

interface Props {
  stars?: number;
  streak?: number;
}

export function GamificationMetrics({ stars = 0, streak = 0 }: Props) {
  return (
    <View className="mb-[18px] rounded-[16px] border border-cardBorder bg-white px-[16px] py-[14px]">
      <Text
        allowFontScaling={false}
        className="mb-[12px] font-poppins-semi text-[19px] leading-[24px] text-black"
      >
        Minhas Métricas
      </Text>

      <View className="mb-[11px] h-[86px] flex-row items-center rounded-[15px] bg-metricsYellowBg px-[14px]">
        <View className="mr-[10px] h-[42px] w-[42px] items-center justify-center">
          <Ionicons name="star" size={35} color={progressColors.starIcon} />
        </View>

        <View className="flex-1">
          <Text
            allowFontScaling={false}
            className="mb-[4px] font-inter-semi text-[14.5px] leading-[18px] text-greenPrimary"
          >
            Estrelas: {stars}
          </Text>

          <Text
            allowFontScaling={false}
            className="font-inter text-[13.5px] leading-[17px] text-primaryGray"
          >
            Representa o número total de{"\n"}questões que você já respondeu.
          </Text>
        </View>
      </View>

      <View className="h-[86px] flex-row items-center rounded-[15px] bg-metricsOrangeBg px-[14px]">
        <View className="mr-[10px] h-[42px] w-[42px] items-center justify-center">
          <Ionicons name="flame" size={34} color={progressColors.flameIcon} />
        </View>

        <View className="flex-1">
          <Text
            allowFontScaling={false}
            className="mb-[4px] font-inter-semi text-[14.5px] leading-[18px] text-greenPrimary"
          >
            Sequência de Dias: {streak}
          </Text>

          <Text
            allowFontScaling={false}
            className="font-inter text-[13.5px] leading-[17px] text-primaryGray"
          >
            Representa quantos dias consecutivos{"\n"}você tem estudado na plataforma.
          </Text>
        </View>
      </View>
    </View>
  );
}
