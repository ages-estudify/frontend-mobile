import { useAuth } from "@/hooks/useAuth";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const USER_IMAGE = require("../../../../assets/User.png");

type TabHeaderProps = {
  title: string;
  subtitle?: string;
};

export function TabHeader({ title, subtitle }: TabHeaderProps) {
  const { logout } = useAuth();

  return (
    <SafeAreaView className="bg-whitebg dark:bg-whitebg" edges={["top", "left", "right"]}>
      <View className="w-full px-[16px] pb-1 pt-2">
        <Pressable onPress={() => logout()} style={{ alignSelf: "flex-end" }}>
          <Image
            source={USER_IMAGE}
            placeholder={USER_IMAGE}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            className="bg-secondaryGray"
            contentFit="cover"
            placeholderContentFit="cover"
            cachePolicy="memory-disk"
            transition={0}
            priority="high"
          />
        </Pressable>

        <Text className="mt-2 font-inter-semi text-[34px] leading-none text-black">{title}</Text>

        <Text
          className="mt-1 font-inter text-[15px] text-primaryGray"
          style={{
            opacity: subtitle ? 1 : 0,
          }}
          numberOfLines={1}
        >
          {subtitle ?? "Texto invisível"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
