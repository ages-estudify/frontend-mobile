import { endPoints } from "@/routes/endpoints";
import type { GetStreakResponse } from "@/types/streak.types";
import api, { handleApiError } from "./api";

export const getUserStreak = async (): Promise<GetStreakResponse> => {
  try {
    const response: GetStreakResponse = await api.get(endPoints.users.streak);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
