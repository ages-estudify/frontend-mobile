import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export interface SubjectBoxProps {
  subject: string;
  icon?: string;
  href: `/subject?id=${string}`;
}

export default function SubjectBox({ subject, icon, href }: SubjectBoxProps) {
  const router = useRouter();
  return (
    <Pressable
      className="align-items-center h-[110px] w-[110px] justify-center rounded-3xl border border-purple84 p-[10px]"
      onPress={() => router.navigate(href)}
    >
      <View className="flex-column items-center justify-center gap-[5px]">
        <Image source={{ uri: icon }} className="h-[32px] w-[32px]" />
        <Text className="font-inter text-[13px] text-purple100">{subject}</Text>
      </View>
    </Pressable>
  );
}
