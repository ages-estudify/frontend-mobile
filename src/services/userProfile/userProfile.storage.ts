import type { UserProfile, UserProfileUpdate } from "@/types/userProfile.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_PROFILE_STORAGE_KEY = "userProfile";

export async function getUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserProfile(update: UserProfileUpdate): Promise<UserProfile> {
  const current = (await getUserProfile()) ?? {};
  const nextProfile: UserProfile = { ...current, ...update };

  await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));

  return nextProfile;
}

export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(USER_PROFILE_STORAGE_KEY);
}
