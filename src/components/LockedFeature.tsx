import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import LockIcon from "../../assets/icons/lock.svg";

type LockedFeatureProps = {
  title?: string;
  subtitle?: string;
};

export function LockedFeature({}: LockedFeatureProps) {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-whitebg px-2 pb-[140px]">
      <View className="mb-6 h-[70px] w-[70px] items-center justify-center rounded-2xl bg-greenSecondary">
        <LockIcon width={31} height={31} />
      </View>

      <View className="w-full items-center">
        <Text className="mb-2 text-center font-inter-semi text-2xl text-purple100">
          Funcionalidade Exclusiva
        </Text>

        <Text
          className="text-center font-inter text-[13px] leading-[18px] text-primaryGray"
          adjustsFontSizeToFit
          numberOfLines={3}
        >
          {
            "Assine um plano e acesse treinos, simulados,\nacompanhe seu progresso e crie seu cronograma de\nestudos aqui mesmo!"
          }
        </Text>
      </View>

      <Pressable
        testID="planos"
        onPress={() => router.push("/plans")}
        className="mt-6 h-[34px] w-[164px] items-center justify-center rounded-2xl bg-purpleCalm"
      >
        <Text className="text-center font-poppins text-[16px] text-white">Ver Planos</Text>
      </Pressable>
    </View>
  );
}