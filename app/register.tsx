import { register } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleRegister() {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      alert("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem");
      return;
    }

    const registerRequest: RegisterRequest = {
      fullName,
      email,
      password,
      phone,
      birthDate: new Date().toISOString(),
    };
    register(registerRequest);
    console.log("RegisterRequest:", registerRequest);
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        {/* Título */}
        <Text className="text-4xl font-bold text-center text-[#3F2A66] mb-16">
          Cadastro
        </Text>

        {/* Nome */}
        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Nome</Text>
          <TextInput
            placeholder="Ex: Maria dos Santos"
            value={fullName}
            onChangeText={setFullName}
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

        {/* Email */}
        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Email</Text>
          <TextInput
            placeholder="abc@abc.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

        {/* Número */}
        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Número</Text>
          <TextInput
            placeholder="55 11 99999-9999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

        {/* Senha */}
        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Senha</Text>
          <View className="flex-row items-center border border-neutral-300 rounded-lg px-4 h-12">
            <TextInput
              placeholder="******"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="flex-1"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={18}
                color="#3F2A66"
              />
            </Pressable>
          </View>
        </View>

        {/* Confirmar Senha */}
        <View className="mb-14">
          <Text className="mb-1 font-bold text-[#3F2A66]">Confirmar Senha</Text>
          <View className="flex-row items-center border border-neutral-300 rounded-lg px-4 h-12">
            <TextInput
              placeholder="******"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              className="flex-1"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={18}
                color="#3F2A66"
              />
            </Pressable>
          </View>
        </View>

        {/* Botão */}
        <Pressable
          onPress={handleRegister}
          className="h-12 bg-[#3F2A66] rounded-full justify-center items-center"
        >
          <Text className="text-white font-semibold text-base">Confirmar</Text>
        </Pressable>

        {/* Voltar */}
        <Pressable onPress={() => router.back()} className="mt-4 items-center">
          <Text className="text-[#3F2A66] font-medium">‹ Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
