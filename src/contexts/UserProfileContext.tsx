import { useAuthSession } from "@/contexts/AuthContext";
import { getUserProfile, saveUserProfile } from "@/services/userProfile/userProfile.storage";
import { userMeService } from "@/services/userMe/userMe.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type UserProfileContextValue = {
  profilePictureUrl: string | null;
  updateProfilePicture: (url: string | null) => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const { updatePlanExpirationDate } = useAuthSession();

  useEffect(() => {
    const init = async () => {
      // Fast path: show cached value immediately
      const cached = await getUserProfile();
      setProfilePictureUrl(cached?.profilePictureUrl ?? null);

      // Skip API call if not authenticated
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      try {
        const me = await userMeService.getMe();

        // Persist and display fresh picture URL
        await saveUserProfile({ profilePictureUrl: me.profile_picture_url });
        setProfilePictureUrl(me.profile_picture_url);

        // Sync plan expiration date into AuthContext + AsyncStorage
        await updatePlanExpirationDate(me.plan_end_date);
      } catch {
        // Keep cached values on network failure
      }
    };

    void init();
  }, [updatePlanExpirationDate]);

  const updateProfilePicture = useCallback(async (url: string | null) => {
    setProfilePictureUrl(url);
    await saveUserProfile({ profilePictureUrl: url });
  }, []);

  const value = useMemo<UserProfileContextValue>(
    () => ({ profilePictureUrl, updateProfilePicture }),
    [profilePictureUrl, updateProfilePicture]
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfileContext(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfileContext must be used within UserProfileProvider");
  return ctx;
}
