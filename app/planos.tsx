import { ActionButton } from "@/components/ActionButton";
import { useRouter, type RelativePathString } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlanosScreen() {
  const router = useRouter();

  const goHome = () => {
    router.replace("/(tabs)/treinar" as RelativePathString);
  };

  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1 justify-center gap-6 px-6">
        <Text className="text-center font-poppins-semi text-2xl text-purple100">Planos</Text>
        <Text className="text-center font-inter text-primaryGray">
          Em breve você poderá contratar e renovar seu plano por aqui.
        </Text>
        <ActionButton text="Voltar ao início" action={goHome} />
      </View>
    </SafeAreaView>
  );
}
