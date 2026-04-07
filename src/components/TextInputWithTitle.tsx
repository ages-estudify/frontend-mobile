import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface TextInputWithTitleProps {
  title: string;
  placeholder: string;
  isPassword?: boolean;
  text: string;
  onValueChange: (text: string) => void;
}

export function TextInputWithTitle({
  title,
  placeholder,
  isPassword = false,
  text,
  onValueChange,
}: TextInputWithTitleProps) {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View className="w-full gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-base text-purple100">{title}</Text>
        {isPassword && (
          <Pressable onPress={() => {}}>
            <Text className="font-regular text-xs text-greenPrimary">
              Esqueceu sua senha?
            </Text>
          </Pressable>
        )}
      </View>

      <View className="relative">
        <TextInput
          value={text}
          onChangeText={onValueChange}
          placeholder={placeholder}
          secureTextEntry={isPassword && showPassword}
          className="border rounded-2xl border-gray-300 py-3 px-4"
        />
        {isPassword && (
          <Pressable
            onPress={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Pressable>
        )}
      </View>
    </View>
  );
}
