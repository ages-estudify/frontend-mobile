import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { UserSession } from "@/types/auth.types";

const SESSION_KEY = "estudify.user_session";

async function getWebStorage() {
  const { default: AsyncStorage } =
    await import("@react-native-async-storage/async-storage");
  return AsyncStorage;
}

export async function loadSession(): Promise<UserSession | null> {
  const raw =
    Platform.OS === "web"
      ? await (await getWebStorage()).getItem(SESSION_KEY)
      : await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UserSession;
    if (
      typeof parsed.token !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.planActive !== "boolean"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveSession(session: UserSession): Promise<void> {
  const payload = JSON.stringify(session);
  if (Platform.OS === "web") {
    await (await getWebStorage()).setItem(SESSION_KEY, payload);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, payload);
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === "web") {
    await (await getWebStorage()).removeItem(SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
