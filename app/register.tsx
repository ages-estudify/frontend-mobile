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
  const [birthDateText, setBirthDateText] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function formatDate(text: string) {
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4)
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;

    return `${cleaned.slice(0, 2)}/${cleaned.slice(
      2,
      4
    )}/${cleaned.slice(4, 8)}`;
  }

  function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");

    return cleaned.length === 10 || cleaned.length === 11;
  }

  function formatPhone(text: string) {
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length === 0) return "";

    if (cleaned.length <= 2) {
      return `(${cleaned}`;
    }

    if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }

    if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(
        2,
        6
      )}-${cleaned.slice(6)}`;
    }

    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(
      2,
      7
    )}-${cleaned.slice(7, 11)}`;
  }

  function parseBirthDate(date: string): string | null {
    const [day, month, year] = date.split("/").map(Number);

    if (!day || !month || !year) return null;

    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function handleRegister() {
    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !birthDateText
    ) {
      alert("Preencha todos os campos");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Email inválido");
      return;
    }

    if (password.length < 8) {
      alert("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem");
      return;
    }

    const parsedBirthDate = parseBirthDate(birthDateText);

    if (!parsedBirthDate) {
      alert("Data de nascimento inválida");
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");

    if (!isValidPhone(phone)) {
      alert("Número de telefone inválido");
      return;
    }

    const registerRequest: RegisterRequest = {
      fullName: fullName,
      email: email,
      password: password,
      phone: cleanedPhone,
      birthDate: parsedBirthDate,
    };

    register(registerRequest);
    console.log("RegisterRequest:", registerRequest);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        <Text className="text-4xl font-bold text-center text-[#3F2A66] mb-16">
          Cadastro
        </Text>

        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Nome</Text>
          <TextInput
            placeholder="Ex: Maria dos Santos"
            value={fullName}
            onChangeText={setFullName}
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

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

        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">
            Data de Nascimento
          </Text>
          <TextInput
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
            value={birthDateText}
            onChangeText={(text) => setBirthDateText(formatDate(text))}
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />
        </View>

        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Número</Text>

          <TextInput
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              const formatted = formatPhone(text);
              setPhone(formatted);

              if (!isValidPhone(formatted)) {
                setPhoneError("Número inválido");
              } else {
                setPhoneError("");
              }
            }}
            className="h-12 px-4 border border-neutral-300 rounded-lg"
          />

          {phoneError ? (
            <Text className="text-red-500 text-sm mt-0.5">{phoneError}</Text>
          ) : null}
        </View>

        <View className="mb-8">
          <Text className="mb-1 font-bold text-[#3F2A66]">Senha</Text>

          <View className="flex-row items-center border border-neutral-300 rounded-lg px-4 h-12">
            <TextInput
              placeholder="******"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text.length > 0 && text.length < 8) {
                  setPasswordError("A senha deve ter no mínimo 8 caracteres");
                } else {
                  setPasswordError("");
                }
              }}
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

          {passwordError ? (
            <Text className="text-red-500 text-sm mt-0.5">{passwordError}</Text>
          ) : null}
        </View>

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

        <Pressable
          onPress={handleRegister}
          className="h-12 bg-[#3F2A66] rounded-full justify-center items-center"
        >
          <Text className="text-white font-semibold text-base">Confirmar</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} className="mt-4 items-center">
          <Text className="text-[#3F2A66] font-medium">‹ Voltar</Text>
        </Pressable>
      </View >
    </SafeAreaView >
  );
}
