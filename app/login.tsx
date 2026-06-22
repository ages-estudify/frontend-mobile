import { ActionButton } from "@/components/ActionButton";
import { TextInputWithTitle } from "@/components/TextInputWithTitle/TextInputWithTitle";
import { useAuth } from "@/hooks/useAuth";
import { userMeService } from "@/services/userMe/userMe.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_COMPLETED_STORAGE_KEY = "hasCompletedOnboarding";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    try {
      await login({ email, password });

      let onboardingCompleted: boolean;
      try {
        const me = await userMeService.getMe();
        onboardingCompleted = me.onboarding_completed;
        await AsyncStorage.setItem(
          ONBOARDING_COMPLETED_STORAGE_KEY,
          me.onboarding_completed ? "true" : "false"
        );
      } catch {
        onboardingCompleted =
          (await AsyncStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY)) === "true";
      }

      router.replace(onboardingCompleted ? "/" : "/onboarding");
    } catch (error) {
      Alert.alert("Erro", "Verifique os campos preenchidos");
    } finally {
      setIsLoading(false);
    }
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
          <View className="flex-1 items-center justify-center px-4">
            <View className="pb-9">
              <Image
                source={require("../assets/login_fox.png")}
                className="h-[132.68px] w-[159px]"
                resizeMode="contain"
              />
              <Text className="text-4xl font-semibold text-purple100">Bem Vindo!</Text>
            </View>
            <View className="w-full gap-4">
              <TextInputWithTitle
                title={"Email"}
                placeholder={"email@email.com"}
                onValueChange={setEmail}
                text={email}
              />
              <TextInputWithTitle
                title={"Senha"}
                placeholder={"*******"}
                isPassword={true}
                isLogin={true}
                onValueChange={setPassword}
                text={password}
                onForgotPassword={() => router.push("/password-recovery")}
              />
            </View>
            <View className="w-full items-center gap-4 pt-16">
              <ActionButton text={"Login"} action={handleLogin} disabled={isLoading} />
              <Pressable onPress={() => router.push("/register")} className="flex-row gap-2">
                <View className="flex-row gap-2">
                  <Text className="font-regular text-primaryGray">Não possui conta?</Text>
                  <Text className="font-semibold text-purple100">Registrar</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
