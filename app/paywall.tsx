import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LockIcon from "../assets/icons/lock.svg";

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-whitebg">
      <View className="flex-1 flex-col items-center justify-center gap-6 px-8">
        <View className="h-[70px] w-[70px] items-center justify-center rounded-2xl bg-greenSecondary">
          <LockIcon width={31} height={31} />
        </View>
        <View>
          <Text className="text-center font-inter-semi text-2xl text-purple100">
            Funcionalidade Exclusiva
          </Text>
          <Text className="max-w-[320px] text-center font-inter text-[13px] leading-5 text-primaryGray">
            Assine um plano e acesse treinos, simulados, acompanhe seu progresso e crie seu
            cronograma de estudos aqui mesmo!
          </Text>
        </View>
        <Pressable
          testID="planos"
          onPress={() => router.replace("/planos")}
          className="h-[34px] w-[164px] items-center justify-center self-center rounded-2xl bg-purpleCalm"
        >
          <Text className="text-center font-poppins text-[16px] text-white">Ver Planos</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
