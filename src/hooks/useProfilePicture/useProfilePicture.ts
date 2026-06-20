import { profilePictureService } from "@/services/profilePicture/profilePicture.service";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

type UseProfilePictureOptions = {
  onSuccess?: (url: string) => void;
  onRemoveSuccess?: () => void;
  onError?: (message: string) => void;
};

const GENERIC_ERROR = "Algo deu errado. Tente novamente.";

export function useProfilePicture({
  onSuccess,
  onRemoveSuccess,
  onError,
}: UseProfilePictureOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const isLoading = isUploading || isRemoving;

  async function pickAndUpload() {
    if (isLoading) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      onError?.("Permissão para acessar a galeria é necessária.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      onError?.(GENERIC_ERROR);
      return;
    }

    const mimeType = asset.mimeType ?? "image/jpeg";
    const dataUri = `data:${mimeType};base64,${asset.base64}`;

    setIsUploading(true);
    try {
      const response = await profilePictureService.update(dataUri);
      onSuccess?.(response.profilePictureUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : GENERIC_ERROR;
      onError?.(message || GENERIC_ERROR);
    } finally {
      setIsUploading(false);
    }
  }

  async function removePhoto() {
    if (isLoading) return;

    setIsRemoving(true);
    try {
      await profilePictureService.remove();
      onRemoveSuccess?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : GENERIC_ERROR;
      onError?.(message || GENERIC_ERROR);
    } finally {
      setIsRemoving(false);
    }
  }

  return { pickAndUpload, removePhoto, isUploading, isRemoving, isLoading };
}
