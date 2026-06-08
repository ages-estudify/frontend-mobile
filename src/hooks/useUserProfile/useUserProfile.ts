import { getUserProfile } from "@/services/userProfile/userProfile.storage";
import type { UserProfile } from "@/types/userProfile.types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await getUserProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  return { profile, loading, reload };
}
