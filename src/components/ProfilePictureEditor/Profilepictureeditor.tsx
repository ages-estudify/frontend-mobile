import { useProfilePicture } from "@/hooks/useProfilePicture/useProfilePicture";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Pressable, Text, View } from "react-native";

const PLACEHOLDER = require("../../../assets/placeholder_user.png");

type ProfilePictureEditorProps = {
  currentUrl?: string | null;
  onUpdate?: (url: string) => void;
  onRemove?: () => void;
};

export function ProfilePictureEditor({
  currentUrl,
  onUpdate,
  onRemove,
}: ProfilePictureEditorProps) {
  const [showOptions, setShowOptions] = useState(false);

  const { pickAndUpload, removePhoto, isUploading, isRemoving, isLoading } = useProfilePicture({
    onSuccess: (url) => {
      setShowOptions(false);
      onUpdate?.(url);
    },
    onRemoveSuccess: () => {
      setShowOptions(false);
      onRemove?.();
    },
    onError: (message: string) => Alert.alert("Erro", message),
  });

  function handleAvatarPress() {
    if (isLoading) return;

    if (Platform.OS === "web") {
      setShowOptions((prev) => !prev);
    } else {
      Alert.alert("Foto de perfil", "O que você deseja fazer?", [
        { text: "Escolher foto", onPress: pickAndUpload },
        ...(currentUrl
          ? [
              {
                text: "Remover foto",
                style: "destructive" as const,
                onPress: confirmRemove,
              },
            ]
          : []),
        { text: "Cancelar", style: "cancel" as const },
      ]);
    }
  }

  function confirmRemove() {
    if (Platform.OS === "web") {
      void removePhoto();
    } else {
      Alert.alert("Remover foto", "Tem certeza que deseja remover sua foto de perfil?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () => void removePhoto() },
      ]);
    }
  }

  const imageSource = currentUrl ? { uri: currentUrl } : PLACEHOLDER;

  return (
    <View className="items-center">
      <Pressable
        onPress={handleAvatarPress}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Editar foto de perfil"
        className="relative"
      >
        <Image
          source={imageSource}
          className="h-[88px] w-[88px] rounded-full border-4 border-whitebg"
          resizeMode="cover"
        />

        {isLoading && (
          <View className="absolute inset-0 h-[88px] w-[88px] items-center justify-center rounded-full bg-black/40">
            <ActivityIndicator color="#ffffff" size="small" />
          </View>
        )}

        {!isLoading && (
          <View className="absolute bottom-0 right-0 h-[28px] w-[28px] items-center justify-center rounded-full border-2 border-whitebg bg-black">
            <Ionicons name="camera-outline" size={14} color="#ffffff" />
          </View>
        )}
      </Pressable>

      {/* Menu de opções — web only */}
      {showOptions && Platform.OS === "web" && (
        <View className="mt-[8px] overflow-hidden rounded-[12px] border border-cardBorder bg-white shadow-sm">
          <Pressable
            onPress={() => void pickAndUpload()}
            className="flex-row items-center gap-[8px] px-[16px] py-[12px]"
          >
            <Ionicons name="image-outline" size={18} color="#646464" />
            <Text className="font-inter text-[14px] text-black">Escolher foto</Text>
          </Pressable>

          {currentUrl && (
            <Pressable
              onPress={confirmRemove}
              className="flex-row items-center gap-[8px] border-t border-cardBorder px-[16px] py-[12px]"
            >
              <Ionicons name="trash-outline" size={18} color="#D43B3B" />
              <Text className="font-inter text-[14px] text-red-600">Remover foto</Text>
            </Pressable>
          )}
        </View>
      )}

      {isUploading && (
        <Text className="mt-[8px] font-inter text-[13px] text-primaryGray">Enviando foto...</Text>
      )}
      {isRemoving && (
        <Text className="mt-[8px] font-inter text-[13px] text-primaryGray">Removendo foto...</Text>
      )}
    </View>
  );
}
