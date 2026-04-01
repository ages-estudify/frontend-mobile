import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-16">
        {/* Título */}
        <Text className="text-2xl font-bold text-center text-[#3F2A66] mb-10">
          Cadastro
        </Text>

        {/* Nome */}
        <View className="mb-4">
          <Text className="mb-1 text-neutral-700">Nome</Text>
          <TextInput
            placeholder="Ex: Maria dos Santos"
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="mb-1 text-neutral-700">Email</Text>
          <TextInput
            placeholder="abc@abc.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

        {/* Senha */}
        <View className="mb-4">
          <Text className="mb-1 text-neutral-700">Senha</Text>
          <View className="flex-row items-center border border-neutral-300 rounded-lg px-4 h-12">
            <TextInput
              placeholder="******"
              secureTextEntry={!showPassword}
              className="flex-1"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
            ></Pressable>
          </View>
        </View>

        {/* Confirmar Senha */}
        <View className="mb-8">
          <Text className="mb-1 text-neutral-700">Confirmar Senha</Text>
          <View className="flex-row items-center border border-neutral-300 rounded-lg px-4 h-12">
            <TextInput
              placeholder="******"
              secureTextEntry={!showConfirmPassword}
              className="flex-1"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            ></Pressable>
          </View>
        </View>

        {/* Botão */}
        <Pressable className="h-12 bg-[#3F2A66] rounded-full justify-center items-center">
          <Text className="text-white font-semibold text-base">Confirmar</Text>
        </Pressable>

        {/* Voltar */}
        <Pressable onPress={() => router.back()} className="mt-6 items-center">
          <Text className="text-[#3F2A66] font-medium">‹ Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
