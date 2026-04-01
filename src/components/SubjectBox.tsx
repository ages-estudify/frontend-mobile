import React from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SubjectBoxProps {
  subject: string;
  icon: string;
}

export default function SubjectBox({ subject, icon }: SubjectBoxProps) {
  return (
    <View className="rounded-3xl border border-purple84 p-[10px] align-items-center justify-center w-[110px] h-[110px]">
      <View className="flex-column items-center justify-center gap-[5px]">
        <Svg width="30" height="30">
          <Path d={icon} fill="purple100" />
        </Svg>
        <Text className="text-purple100 font-inter-regular text-[13px]">
          {subject}
        </Text>
      </View>
    </View>
  );
}
