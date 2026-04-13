import React from "react";
import { Pressable, Text } from "react-native";

interface ActionButtonProps {
  text: string;
  action: () => void;
  disabled?: boolean;
}

export function ActionButton({ text, action, disabled }: ActionButtonProps) {
  return (
    <Pressable
      onPress={action}
      disabled={disabled}
      className="w-full items-center rounded-2xl bg-purpleCalm py-[10px]"
    >
      <Text className="text-[16px] font-medium text-white">{text}</Text>
    </Pressable>
  );
}
