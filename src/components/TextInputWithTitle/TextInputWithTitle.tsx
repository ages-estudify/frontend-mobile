import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface TextInputWithTitleProps {
  title: string;
  placeholder: string;

  text: string;
  onValueChange: (text: string) => void;

  isPassword?: boolean;
  isLogin?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  maxLength?: number;
  errorMessage?: string;
}

export function TextInputWithTitle({
  title,
  placeholder,
  text,
  onValueChange,
  isPassword = false,
  isLogin = true,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
  errorMessage,
}: TextInputWithTitleProps) {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View className="mb-4 w-full gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-greenPrimary">{title}</Text>

        {isPassword && isLogin && (
          <Pressable onPress={() => {}}>
            <Text className="text-xs text-greenPrimary">Esqueceu sua senha?</Text>
          </Pressable>
        )}
      </View>

      <View className="relative">
        <TextInput
          value={text}
          onChangeText={(value: string) => onValueChange(value)}
          placeholder={placeholder}
          secureTextEntry={isPassword && showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          className={`rounded-2xl border px-4 py-3 ${
            errorMessage ? "border-red-500" : "border-gray-300"
          }`}
        />

        {isPassword && (
          <Pressable
            testID="toggle-password-visibility"
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Pressable>
        )}
      </View>

      {errorMessage ? <Text className="ml-1 text-xs text-red-500">{errorMessage}</Text> : null}
    </View>
  );
}
