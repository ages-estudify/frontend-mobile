import { ActionButton } from "@/components/ActionButton";
import { TextInputWithTitle } from "@/components/TextInputWithTitle";
import { authService } from "@/services/auth.service";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Image, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const login = await authService.login({
        email,
        password,
      });

      router.replace("/progress");
    } catch (error) {
      Alert.alert("Falha no Login", String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center px-4">
        <View className="pb-9">
          <Image
            source={require("../assets/login_fox.png")}
            className="w-[159px] h-[132.68px]"
            resizeMode="contain"
          />
          <Text className="text-4xl font-semibold text-purple100">
            Bem Vindo!
          </Text>
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
            onValueChange={setPassword}
            text={password}
          />
        </View>

        <View className="w-full items-center gap-4 pt-16">
          <ActionButton
            text={"Login"}
            action={handleLogin}
            disabled={isLoading}
          />
          <View className="flex-row gap-2">
            <Text className="text-primaryGray font-regular">
              Não possui conta?
            </Text>
            <Text>Registrar</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
