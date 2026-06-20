import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

const PLACEHOLDER = require("../../../../assets/placeholder_user.png");

export function ProfileAvatarButton() {
  const router = useRouter();
  const { profilePictureUrl } = useUserProfileContext();

  return (
    <Pressable
      onPress={() => router.push("/profile")}
      accessibilityRole="button"
      accessibilityLabel="Abrir perfil"
    >
      <Image
        source={profilePictureUrl ? { uri: profilePictureUrl } : PLACEHOLDER}
        placeholder={PLACEHOLDER}
        style={{ width: 40, height: 40, borderRadius: 20 }}
        contentFit="cover"
        placeholderContentFit="cover"
        cachePolicy="memory-disk"
        transition={0}
        priority="high"
      />
    </Pressable>
  );
}
