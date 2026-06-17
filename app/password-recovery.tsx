import { ActionButton } from "@/components/ActionButton";
import { TextInputWithTitle } from "@/components/TextInputWithTitle/TextInputWithTitle";
import { createOtp } from "@/services/otp/otp.service";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendCode = async () => {
    if (!email || !EMAIL_REGEX.test(email)) {
      Alert.alert("Erro", "Informe um email válido");
      return;
    }
    setIsLoading(true);
    try {
      await createOtp(email);
      // O endpoint sempre retorna sucesso por segurança (não revela
      // se o email existe), então seguimos para a tela de
      // verificação do código já passando o email digitado.
      router.push({
        pathname: "/otp-verification", // ajuste para a rota real da tela de OTP
        params: { email },
      });
    } catch {
      Alert.alert("Erro", "Não foi possível enviar o código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-between px-4">
            <View className="pt-28">
              <Text className="mt-8 text-center text-4xl font-semibold text-purple100">
                Recuperar Senha
              </Text>
              <Text className="pt-2 text-center text-[15px] text-primaryGray">
                Informe seu email e enviaremos um código de verificação.
              </Text>
              <View className="mt-8">
                <TextInputWithTitle
                  title="Email"
                  placeholder="abc@abc.com"
                  onValueChange={setEmail}
                  text={email}
                />
              </View>
            </View>
            <View className="mb-8 items-center gap-4 pb-16">
              <ActionButton text="Enviar email" action={handleSendCode} disabled={isLoading} />
              <Pressable onPress={handleBackToLogin}>
                <Text className="font-semibold text-purple100">‹ Voltar ao login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
