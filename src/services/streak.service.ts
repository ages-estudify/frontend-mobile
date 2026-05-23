import { endPoints } from "@/routes/endpoints";
import type { GetStreakResponse } from "@/types/streak.types";
import api, { handleApiError } from "./api";

export const getUserStreak = async (): Promise<GetStreakResponse> => {
  try {
    console.log("[STREAK] request endpoint:", endPoints.users.streak);
    const response: GetStreakResponse = await api.get(endPoints.users.streak);
    console.log("[STREAK] response data:", response);
    return response;
  } catch (error) {
    console.log("[STREAK] request failed:", error);
    handleApiError(error);
    throw error;
  }
};
