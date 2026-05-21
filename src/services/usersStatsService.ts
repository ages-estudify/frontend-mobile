import { populatedUserStatsMock } from "../mocks/userStatsMock";
import { UserStatsData } from "../types/userStats";
import { api } from "./api";

export const usersStatsService = {
  getUserStats: async (): Promise<UserStatsData> => {
    // descomentar o código abaixo quando a tarefa BACK-06.5 estiver na develop
    // const response = await api.get('/users/stats');
    // return response.data.data;

    // mocado temporário populado para testar
    return Promise.resolve(populatedUserStatsMock.data);
  },
};
