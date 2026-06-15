import { useAuthSession } from "@/contexts/AuthContext";
import { userProfileService } from "@/services/userProfile/userProfile.service";
import { getUserProfile, saveUserProfile } from "@/services/userProfile/userProfile.storage";
import type { UserProfile } from "@/types/userProfile.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

const GENERIC_PROFILE_ERROR = "Algo deu errado. Tente novamente.";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }

  return GENERIC_PROFILE_ERROR;
}

export function useUserProfile() {
  const { setSessionFromCredentials, updatePlanSession } = useAuthSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [storedProfile, apiProfile] = await Promise.all([
        getUserProfile(),
        userProfileService.getCurrent(),
      ]);

      const nextProfile: UserProfile = {
        ...(storedProfile ?? {}),
        ...apiProfile,
        studyHours: storedProfile?.studyHours,
      };
      const planActive = apiProfile.planStatus === "active";
      const planEndDate = apiProfile.planEndDate ?? null;

      if (apiProfile.role) {
        await AsyncStorage.setItem("role", apiProfile.role);
      }
      await updatePlanSession({ planExpirationDate: planEndDate, planActive });
      setSessionFromCredentials(apiProfile.role ?? "USER", planEndDate, planActive);
      await saveUserProfile(nextProfile);

      setProfile(nextProfile);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [setSessionFromCredentials, updatePlanSession]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  return { profile, loading, error, reload };
}
