import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function EmptySimuladosState() {
  const router = useRouter();

  return (
    <View className="items-center justify-center py-[18px]">
      <Text
        allowFontScaling={false}
        className="mb-[4px] text-center font-poppins-semi text-[15px] leading-[20px] text-black"
      >
        Você ainda não tem simulados
      </Text>

      <Text
        allowFontScaling={false}
        className="mb-[14px] max-w-[230px] text-center font-inter text-[13px] leading-[17px] text-primaryGray"
      >
        Comece um novo simulado e alcance sua aprovação
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/(tabs)/simulado")}
        className="rounded-full bg-purpleCalm px-[18px] py-[7px]"
      >
        <Text
          allowFontScaling={false}
          className="font-inter-semi text-[12px] leading-[15px] text-white"
        >
          Começar Simulado
        </Text>
      </TouchableOpacity>
    </View>
  );
}
