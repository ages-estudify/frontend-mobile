import React from "react";
import { Text } from "react-native";

type Props = {
  time: string | undefined;
};

export default function TimerExam({ time }: Props) {
  return (
    <Text className="w-max rounded-3xl bg-white px-5 py-2 text-lg text-[#646464]">
      {time || "00:00"}
    </Text>
  );
}
