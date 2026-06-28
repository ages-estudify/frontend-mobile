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
  const { updatePlanExpirationDate, sessionVersion } = useAuthSession();

  const refreshProfilePicture = useCallback(async () => {
    // Fast path: show cached value immediately
    const cached = await getUserProfile();
    setProfilePictureUrl(cached?.profilePictureUrl ?? null);

    // Not authenticated: keep the cached value (the fast path above already
    // reflects cleared storage on logout, which resets the picture to null).
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
  }, [updatePlanExpirationDate]);

  // Re-run on mount and whenever the authenticated user changes (login/logout),
  // so the picture always follows the current session instead of leaking across users.
  useEffect(() => {
    void refreshProfilePicture();
  }, [refreshProfilePicture, sessionVersion]);

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
