import React from "react";
import { Text, Pressable } from "react-native";

interface ActionButtonProps {
  text: string;
  action: () => void;
}

export function ActionButton({ text, action }: ActionButtonProps) {
  return (
    <Pressable
      onPress={action}
      className="items-center rounded-2xl bg-purpleCalm  w-full py-[10px]"
    >
      <Text className="font-medium text-white text-[16px]">{text}</Text>
    </Pressable>
  );
}
