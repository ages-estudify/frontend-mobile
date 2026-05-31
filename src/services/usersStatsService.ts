import { endPoints } from "@/routes/endpoints";
import { UserStatsData, UserStatsResponse } from "@/types/userStats";
import api, { handleApiError } from "./api";

export const usersStatsService = {
  getUserStats: async (): Promise<UserStatsData> => {
    try {
      const response: UserStatsResponse = await api.get(endPoints.users.stats);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
