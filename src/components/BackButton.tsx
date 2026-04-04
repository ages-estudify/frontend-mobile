import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import BackArrowIcon from "../../assets/icons/back_arrow.svg";

export function BackButton() {
  const router = useRouter();
  return (
    <Pressable
      className="h-[50px] w-[50px] items-center justify-center rounded-full bg-white"
      onPress={() => router.back()}
    >
      <BackArrowIcon width={16} height={16} />
    </Pressable>
  );
}
