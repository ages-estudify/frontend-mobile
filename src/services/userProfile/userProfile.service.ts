import { endPoints } from "@/routes/endpoints";
import type { UserProfile, UserProfileApiResponse } from "@/types/userProfile.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { handleApiError } from "../api";

const USER_ID_STORAGE_KEY = "userId";
const TOKEN_STORAGE_KEY = "token";
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

type JwtPayload = {
  userId?: string;
};

function decodeBase64Url(value: string): string | null {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  try {
    let decoded = "";
    let buffer = 0;
    let bits = 0;

    for (const char of padded.replace(/=+$/, "")) {
      const charIndex = BASE64_CHARS.indexOf(char);
      if (charIndex < 0) return null;

      buffer = (buffer << 6) | charIndex;
      bits += 6;

      if (bits >= 8) {
        bits -= 8;
        decoded += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }

    try {
      return decodeURIComponent(
        decoded
          .split("")
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join("")
      );
    } catch {
      return decoded;
    }
  } catch {
    return null;
  }
}

function getUserIdFromToken(token: string | null): string | null {
  const payload = token?.split(".")[1];
  if (!payload) return null;

  const decodedPayload = decodeBase64Url(payload);
  if (!decodedPayload) return null;

  try {
    const parsed = JSON.parse(decodedPayload) as JwtPayload;
    return parsed.userId ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const storedUserId = await AsyncStorage.getItem(USER_ID_STORAGE_KEY);
  if (storedUserId) return storedUserId;

  const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  const tokenUserId = getUserIdFromToken(token);

  if (tokenUserId) {
    await AsyncStorage.setItem(USER_ID_STORAGE_KEY, tokenUserId);
  }

  return tokenUserId;
}

function mapUserProfileResponse(response: UserProfileApiResponse): UserProfile {
  return {
    id: response.id,
    fullName: response.full_name,
    email: response.email,
    phone: response.phone_number ?? undefined,
    birthDate: response.birth_date ?? undefined,
    role: response.role,
    planEndDate: response.plan_end_date,
    planStatus: response.plan_status,
    preferredLanguage: response.preferred_language ?? undefined,
    desiredCourse: response.desired_course ?? undefined,
    desiredUniversity: response.desired_university ?? undefined,
  };
}

export const userProfileService = {
  getById: async (userId: string): Promise<UserProfile> => {
    try {
      const response: UserProfileApiResponse = await api.get(endPoints.users.profile(userId));
      return mapUserProfileResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCurrent: async (): Promise<UserProfile> => {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("Usuário não identificado. Faça login novamente.");
    }

    return userProfileService.getById(userId);
  },
};
