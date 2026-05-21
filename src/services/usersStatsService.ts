import { populatedUserStatsMock } from "../mocks/userStatsMock";
import { endPoints } from "../routes/endpoints";
import api from "./api";
import { UserStatsData, UserStatsResponse } from "../types/userStats";

export const usersStatsService = {
  getUserStats: async (): Promise<UserStatsData> => {
    // Return mock for now.
    // To test empty state, use: return Promise.resolve(emptyUserStatsMock.data);
    return Promise.resolve(populatedUserStatsMock.data);

    // TODO: When backend is ready, uncomment the lines below and remove the mock.
    // const response = await api.get<UserStatsResponse>(endPoints.users.stats);
    // return response.data; // Depending on api interceptor, it might return just response or response.data
  },
};
