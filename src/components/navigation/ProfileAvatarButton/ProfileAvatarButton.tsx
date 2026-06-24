import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable } from "react-native";

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
        source={
          profilePictureUrl ? { uri: profilePictureUrl } : require("../../../../assets/User.png")
        }
        style={{ width: 40, height: 40 }}
        className="h-10 w-10 rounded-full"
        resizeMode="cover"
      />
    </Pressable>
  );
}
