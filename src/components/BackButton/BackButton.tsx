import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import BackArrowIcon from "../../../assets/icons/back_arrow.svg";

type props = {
  backFunction?: () => void;
};

export function BackButton({ backFunction }: props) {
  const router = useRouter();
  return (
    <Pressable
      className="mt-[8px] h-[50px] w-[50px] items-center justify-center rounded-full bg-white"
      onPress={() => {
        backFunction?.();
        router.back();
      }}
    >
      <BackArrowIcon width={16} height={16} />
    </Pressable>
  );
}
