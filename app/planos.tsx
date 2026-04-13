import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanosScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Planos</Text>
        <Text className="mt-3 text-base leading-6 text-neutral-600 dark:text-neutral-400">
          Seu plano está inativo. Assine para liberar Treinar, Simulados, Cronograma e Progresso.
        </Text>
        <Pressable
          testID="planos-back"
          onPress={() => router.back()}
          className="mt-8 items-center rounded-xl border border-neutral-300 py-4 dark:border-neutral-600"
        >
          <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Voltar
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
