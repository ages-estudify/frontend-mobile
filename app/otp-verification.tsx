import { ActionButton } from "@/components/ActionButton";
import { createOtp, verifyOtp } from "@/services/otp/otp.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function OtpVerificationPage() {
  const params = useLocalSearchParams<{ email: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const router = useRouter();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const otp = digits.join("");
  const isOtpComplete = otp.length === OTP_LENGTH;

  const handleChangeDigit = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: { nativeEvent: { key: string } }, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete) return;
    setIsLoading(true);
    try {
      const token = await verifyOtp(email, otp);
      const authToken = token.data.token;
      router.push({
        pathname: "/new-password",
        params: { token: authToken },
      });
    } catch {
      Alert.alert("Erro", "Código inválido ou expirado. Tente novamente.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    try {
      await createOtp(email);
      setDigits(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      inputsRef.current[0]?.focus();
    } catch {
      Alert.alert("Erro", "Não foi possível reenviar o código. Tente novamente.");
    }
  };

  const handleBackToEmail = () => {
    router.replace("/password-recovery");
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
                Código de Verificação
              </Text>
              <Text className="pt-2 text-center text-[15px] text-primaryGray">
                Digite o código de 6 dígitos enviado para o seu email.
              </Text>

              <Text className="pt-6 text-center text-primaryGray">
                Enviado para <Text className="font-semibold text-black">{email}</Text>
              </Text>

              <View className="mt-6 flex-row justify-between">
                {digits.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputsRef.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(value) => handleChangeDigit(value, index)}
                    onKeyPress={(event) => handleKeyPress(event, index)}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    maxLength={1}
                    autoFocus={index === 0}
                    className={`h-14 w-12 rounded-xl border text-center text-xl font-semibold text-purple100 ${
                      digit ? "border-purple100" : "border-gray-300"
                    }`}
                  />
                ))}
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <Text className="text-primaryGray">Não recebeu o código?</Text>
                <Pressable onPress={handleResend} disabled={secondsLeft > 0}>
                  <Text
                    className={`font-semibold ${
                      secondsLeft > 0 ? "text-primaryGray" : "text-purple100"
                    }`}
                  >
                    {secondsLeft > 0 ? `Reenviar em ${secondsLeft}s` : "Reenviar código"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="mb-8 items-center gap-4 pb-16">
              <ActionButton
                text="Verificar código"
                action={handleVerify}
                disabled={isLoading || !isOtpComplete}
              />
              <Pressable onPress={handleBackToEmail}>
                <Text className="font-semibold text-purple100">‹ Voltar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
