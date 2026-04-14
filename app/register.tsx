import { TextInputWithTitle } from "@/components/TextInputWithTitle/TextInputWithTitle";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest } from "@/types/auth.types";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDateText, setBirthDateText] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function formatDate(text: string) {
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;

    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");
    // Remove country code if present (55)
    const withoutCountry = cleaned.startsWith("55") ? cleaned.slice(2) : cleaned;
    return withoutCountry.length === 10 || withoutCountry.length === 11;
  }

  function formatPhone(text: string) {
    const cleaned = text.replace(/\D/g, "");

    const withoutCountry = cleaned.startsWith("55") ? cleaned.slice(2) : cleaned;

    if (withoutCountry.length === 0) return "+55 ";

    if (withoutCountry.length <= 2) {
      return `+55 (${withoutCountry}`;
    }

    if (withoutCountry.length <= 7) {
      return `+55 (${withoutCountry.slice(0, 2)}) ${withoutCountry.slice(2)}`;
    }

    return `+55 (${withoutCountry.slice(0, 2)}) ${withoutCountry.slice(
      2,
      7
    )}-${withoutCountry.slice(7, 11)}`;
  }

  async function handleRegister() {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      alert("Preencha todos os campos");
      return;
    }

    if (!birthDateText || birthDateText.length < 10) {
      alert("Data de nascimento inválida");
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

    if (!isValidPhone(phone)) {
      alert("Número de telefone inválido");
      return;
    }

    const registerRequest: RegisterRequest = {
      fullName,
      email,
      password,
      phone: phone.replace(/\D/g, "").replace(/^55/, ""), // Remove non-digits and country code
      birthDate: parsedBirthDate,
    };

    try {
      await register(registerRequest);
      router.replace("/");
    } catch (error) {
      console.log("Register error:", error);
      alert("Erro ao realizar cadastro. Tente novamente.");
      return;
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        <Text className="mb-16 text-center text-4xl font-bold text-purple100">Cadastro</Text>

        <TextInputWithTitle
          title="Nome"
          placeholder="Ex: Maria dos Santos"
          text={fullName}
          onValueChange={setFullName}
          autoCapitalize="words"
        />

        <TextInputWithTitle
          title="Email"
          placeholder="abc@abc.com"
          text={email}
          onValueChange={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInputWithTitle
          title="Data de Nascimento"
          placeholder="DD/MM/AAAA"
          text={birthDateText}
          onValueChange={(value) => setBirthDateText(formatDate(value))}
          keyboardType="numeric"
          maxLength={10}
        />

        <TextInputWithTitle
          title="Número"
          placeholder="(11) 99999-9999"
          text={phone}
          onValueChange={(value) => {
            const formatted = formatPhone(value);
            setPhone(formatted);

            if (!isValidPhone(formatted)) {
              setPhoneError("Número inválido");
            } else {
              setPhoneError("");
            }
          }}
          keyboardType="phone-pad"
          errorMessage={phoneError}
        />

        <TextInputWithTitle
          title="Senha"
          placeholder="******"
          text={password}
          onValueChange={(value) => {
            setPassword(value);
            if (value.length > 0 && value.length < 8) {
              setPasswordError("A senha deve ter no mínimo 8 caracteres");
            } else {
              setPasswordError("");
            }
          }}
          isPassword
          isLogin={false}
          errorMessage={passwordError}
        />

        <TextInputWithTitle
          title="Confirmar Senha"
          placeholder="******"
          text={confirmPassword}
          onValueChange={setConfirmPassword}
          isPassword
          isLogin={false}
          errorMessage={password !== confirmPassword ? "As senhas não conferem" : ""}
        />

        <Pressable
          onPress={handleRegister}
          className="mt-6 h-12 items-center justify-center rounded-full bg-purple100"
        >
          <Text className="text-base font-semibold text-white">Confirmar</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} className="mt-4 items-center">
          <Text className="font-medium text-purple100">‹ Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
