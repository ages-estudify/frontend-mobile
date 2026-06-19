import { ActionButton } from "@/components/ActionButton";
import { updatePassword } from "@/services/otp/otp.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordResetPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token: string }>();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const getStrengthMetrics = () => {
    if (!password)
      return { label: "", color: "#E5E7EB", textColor: "#9CA3AF", width: "0%" as const };

    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    if (password.length > 0 && score === 0)
      return {
        label: "Muito fraca",
        color: "#EF4444",
        textColor: "#EF4444",
        width: "20%" as const,
      };

    switch (score) {
      case 1:
        return { label: "Fraca", color: "#EF4444", textColor: "#EF4444", width: "40%" as const };
      case 2:
        return { label: "Razoável", color: "#F59E0B", textColor: "#F59E0B", width: "60%" as const };
      case 3:
        return { label: "Boa", color: "#10B981", textColor: "#10B981", width: "80%" as const };
      case 4:
        return { label: "Forte", color: "#059669", textColor: "#059669", width: "100%" as const };
      default:
        return {
          label: "Muito fraca",
          color: "#EF4444",
          textColor: "#EF4444",
          width: "20%" as const,
        };
    }
  };

  const strength = getStrengthMetrics();
  const isFormValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleResetPassword = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      await updatePassword(token, password);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível redefinir a senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-between px-6">
            <View className="pt-12">
              <Text className="text-center text-[32px] font-semibold text-purple100">
                Nova senha
              </Text>
              <Text className="px-4 pt-2 text-center text-[15px] text-primaryGray">
                Escolha uma senha forte para proteger sua conta.
              </Text>

              <View className="mt-8">
                <Text className="mb-2 text-base font-semibold text-gray-700">Nova senha</Text>
                <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-3 py-3">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite sua nova senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: 15, color: "#111827" }}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>

                {password.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          flex: 1,
                          height: 6,
                          backgroundColor: "#E5E7EB",
                          borderRadius: 999,
                          marginRight: 12,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: strength.width,
                            backgroundColor: strength.color,
                            borderRadius: 999,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: strength.textColor,
                          minWidth: 60,
                        }}
                      >
                        {strength.label}
                      </Text>
                    </View>
                  </View>
                )}

                <View className="mt-4 gap-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={hasMinLength ? "#10B981" : "#9CA3AF"}
                    />
                    <Text
                      className={`ml-2 text-xs ${hasMinLength ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      Mínimo de 8 caracteres
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={hasUppercase ? "#10B981" : "#9CA3AF"}
                    />
                    <Text
                      className={`ml-2 text-xs ${hasUppercase ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      Pelo menos 1 letra maiúscula
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={hasNumber ? "#10B981" : "#9CA3AF"}
                    />
                    <Text
                      className={`ml-2 text-xs ${hasNumber ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      Pelo menos 1 número
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={hasSpecialChar ? "#10B981" : "#9CA3AF"}
                    />
                    <Text
                      className={`ml-2 text-xs ${hasSpecialChar ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      Pelo menos 1 caractere especial
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-6">
                <Text className="mb-2 text-base font-semibold text-gray-700">Confirmar senha</Text>
                <View
                  className={`flex-row items-center rounded-xl border bg-gray-50 px-3 py-3 ${showMatchError ? "border-red-500" : "border-gray-300"}`}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repita a senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: 15, color: "#111827" }}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>

                {showMatchError && (
                  <View className="mt-2 flex-row items-center">
                    <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                    <Text className="ml-1 text-xs text-red-500">As senhas não coincidem.</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="mt-8 items-center gap-4 pb-12">
              <View style={{ opacity: isFormValid ? 1 : 0.6, width: "100%" }}>
                <ActionButton
                  text="Redefinir senha"
                  action={handleResetPassword}
                  disabled={!isFormValid || isLoading}
                />
              </View>

              <Pressable
                onPress={() => router.replace("/otp-verification")}
                className="flex-row items-center py-2"
              >
                <Ionicons name="chevron-back" size={16} color="#6B21A8" />
                <Text className="ml-1 font-semibold text-purple100">Voltar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showSuccessModal} transparent animationType="fade" onRequestClose={() => {}}>
        <View className="flex-1 items-center justify-center bg-black/50 px-8">
          <View className="w-full items-center rounded-3xl bg-white p-6">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-purple100">
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
            <Text className="mb-2 text-center text-2xl font-semibold text-purple100">
              Senha redefinida!
            </Text>
            <Text className="mb-6 text-center text-[15px] text-primaryGray">
              Sua senha foi atualizada com sucesso. Agora você pode entrar com sua nova senha.
            </Text>
            <View className="w-full">
              <ActionButton text="Ir para o login" action={handleGoToLogin} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
