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
      className="items-center rounded-2xl bg-purpleCalm  w-full py-[10px]"
    >
      <Text className="font-medium text-white text-[16px]">{text}</Text>
    </Pressable>
  );
}
