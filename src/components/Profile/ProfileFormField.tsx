import React from "react";
import { Text, TextInput, View } from "react-native";

type ProfileFormFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  variant?: "input" | "text";
  testID?: string;
};

export function ProfileFormField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  variant = "input",
  testID,
}: ProfileFormFieldProps) {
  return (
    <View className="gap-[8px]">
      <Text className="font-inter-medium text-[14px] text-primaryGray">{label}</Text>

      {variant === "text" ? (
        <Text className="font-inter-regular text-[16px]">{value}</Text>
      ) : (
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={editable}
          className={`rounded-[12px] bg-white px-[16px] py-[14px] font-inter text-[16px] text-black ${
            editable ? "" : "opacity-70"
          }`}
          autoCapitalize="words"
          keyboardType={label.toLowerCase().includes("e-mail") ? "email-address" : "default"}
        />
      )}
    </View>
  );
}
